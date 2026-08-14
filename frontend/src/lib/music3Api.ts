import type { StudioDraft, StudioHealth, StudioTask } from "./music3Types";

const apiBase = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

export class Music3ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "Music3ApiError";
  }
}

interface Envelope<T> {
  code: number;
  data: T;
  error: string | null;
}

function endpoint(path: string) {
  return `${apiBase}${path}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(endpoint(path), init);
  const body = (await response.json().catch(() => null)) as Envelope<T> | null;
  if (!response.ok || !body || body.code >= 400) {
    throw new Music3ApiError(body?.error || `Studio API returned ${response.status}.`, response.status);
  }
  return body.data;
}

export function captionFromDraft(draft: StudioDraft) {
  return [
    `Global Metadata: ${draft.globalMetadata.trim()}`,
    `Vocal Details: ${draft.vocalDetails.trim()}`,
    `Arrangement: ${draft.arrangement.trim()}`,
  ].join("\n");
}

export async function getHealth() {
  return request<StudioHealth>("/health");
}

export async function getLibrary() {
  return request<{ items: StudioTask[] }>("/library");
}

export async function getTask(taskId: string) {
  return request<StudioTask>(`/tasks/${encodeURIComponent(taskId)}`);
}

export async function generate(draft: StudioDraft) {
  const body = {
    caption: captionFromDraft(draft),
    lyrics: draft.lyrics.trim(),
    max_duration: Number(draft.duration),
    steps: Number(draft.steps),
    cfg_scale: Number(draft.cfgScale),
    ...(draft.useRandomSeed || !draft.seed.trim() ? {} : { seed: Number(draft.seed) }),
    batch_size: Number(draft.batchSize),
    tiled_decode: draft.tiledDecode,
  };
  return request<{ task_id: string; state: "queued"; seed: number }>("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function audioUrl(taskId: string, download = false) {
  return `${endpoint(`/audio/${encodeURIComponent(taskId)}`)}${download ? "?download=1" : ""}`;
}
