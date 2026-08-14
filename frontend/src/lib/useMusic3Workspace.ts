import { useCallback, useEffect, useMemo, useState } from "react";
import { Music3ApiError, generate, getHealth, getLibrary, getTask } from "./music3Api";
import type { ServiceState, StudioDraft, StudioHealth, StudioTask } from "./music3Types";

export function useMusic3Workspace() {
  const [tasks, setTasks] = useState<StudioTask[]>([]);
  const [health, setHealth] = useState<StudioHealth>();
  const [serviceState, setServiceState] = useState<ServiceState>("checking");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  const refreshService = useCallback(async () => {
    setServiceState("checking");
    try {
      const nextHealth = await getHealth();
      setHealth(nextHealth);
      setServiceState("online");
    } catch {
      setServiceState("offline");
    }
  }, []);

  const refreshLibrary = useCallback(async () => {
    try {
      const response = await getLibrary();
      setTasks((current) => {
        const active = current.filter((task) => task.state === "queued" || task.state === "working");
        const serverIds = new Set(response.items.map((task) => task.id));
        return [...active.filter((task) => !serverIds.has(task.id)), ...response.items].sort((a, b) => b.created_at - a.created_at);
      });
    } catch {
      // The health indicator gives the user the visible connection state.
    }
  }, []);

  const pollTasks = useCallback(async () => {
    const active = tasks.filter((task) => task.state === "queued" || task.state === "working");
    if (!active.length) return;
    const updates = await Promise.all(active.map((task) => getTask(task.id).catch(() => task)));
    setTasks((current) => current.map((task) => updates.find((update) => update.id === task.id) ?? task));
    if (updates.some((task) => task.state === "ready")) {
      setNotice("生成が完了しました。音声を再生できます。");
      await refreshLibrary();
    }
  }, [refreshLibrary, tasks]);

  useEffect(() => {
    void refreshService();
    const timer = window.setInterval(() => void refreshService(), 20_000);
    return () => window.clearInterval(timer);
  }, [refreshService]);

  useEffect(() => {
    void refreshLibrary();
    const timer = window.setInterval(() => void refreshLibrary(), 8_000);
    return () => window.clearInterval(timer);
  }, [refreshLibrary]);

  useEffect(() => {
    if (!tasks.some((task) => task.state === "queued" || task.state === "working")) return;
    void pollTasks();
    const timer = window.setInterval(() => void pollTasks(), 3_000);
    return () => window.clearInterval(timer);
  }, [pollTasks, tasks]);

  const submit = useCallback(async (draft: StudioDraft) => {
    setIsSubmitting(true);
    setNotice("");
    try {
      const queued = await generate(draft);
      setTasks((current) => [{ id: queued.task_id, state: "queued", created_at: Date.now(), prompt: draft.globalMetadata, lyrics: draft.lyrics, settings: { caption: draft.globalMetadata, lyrics: draft.lyrics, max_duration: Number(draft.duration), steps: Number(draft.steps), cfg_scale: Number(draft.cfgScale), seed: queued.seed, batch_size: Number(draft.batchSize), tiled_decode: draft.tiledDecode } }, ...current]);
      setNotice(`キューに追加しました。seed ${queued.seed}`);
      return true;
    } catch (error) {
      setNotice(error instanceof Music3ApiError ? error.message : "生成リクエストを送信できませんでした。");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const metrics = useMemo(() => ({
    active: tasks.filter((task) => task.state === "queued" || task.state === "working").length,
    ready: tasks.filter((task) => task.state === "ready").length,
    failed: tasks.filter((task) => task.state === "failed").length,
  }), [tasks]);

  return { tasks, health, serviceState, isSubmitting, notice, metrics, refreshService, submit };
}

export type Music3Workspace = ReturnType<typeof useMusic3Workspace>;
