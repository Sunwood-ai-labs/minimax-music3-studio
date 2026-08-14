import { AlertTriangle, Check, Download, Headphones, LoaderCircle, Play, RotateCw } from "lucide-react";
import { audioUrl } from "../lib/music3Api";
import type { StudioTask } from "../lib/music3Types";

interface Music3TaskQueueProps { tasks: StudioTask[]; }

function stateLabel(task: StudioTask) {
  if (task.state === "ready") return "Ready to audition";
  if (task.state === "failed") return "Needs review";
  return task.state === "working" ? "Rendering on GPU" : "Queued for ComfyUI";
}

export function Music3TaskQueue({ tasks }: Music3TaskQueueProps) {
  if (!tasks.length) return <div className="music3-empty"><Headphones size={21} aria-hidden="true" /><div><strong>Your first take starts here.</strong><p>Generated tracks will stay in this local Library.</p></div></div>;
  return <div className="music3-task-list">{tasks.slice(0, 8).map((task) => <article className={`music3-task ${task.state}`} key={task.id}><div className="music3-task-icon">{task.state === "ready" ? <Check size={17} /> : task.state === "failed" ? <AlertTriangle size={17} /> : task.state === "working" ? <LoaderCircle size={17} className="spin" /> : <RotateCw size={17} className="spin" />}</div><div className="music3-task-main"><div className="music3-task-title"><strong>{task.settings?.max_duration ? `${task.settings.max_duration}s take` : "MiniMax take"}</strong><span>{stateLabel(task)}</span></div><p>{task.prompt.split("\n")[0].replace(/^Global Metadata:\s*/, "")}</p>{task.error && <small className="music3-task-error">{task.error}</small>}{task.state === "ready" && <div className="music3-audio-row"><Play size={14} aria-hidden="true" /><audio controls preload="metadata" src={audioUrl(task.id)}><track kind="captions" /></audio><a className="icon-button subtle" href={audioUrl(task.id, true)} download title="Download MP3" aria-label="Download MP3"><Download size={16} /></a></div>}</div><time dateTime={new Date(task.created_at).toISOString()}>{new Date(task.created_at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}</time></article>)}</div>;
}
