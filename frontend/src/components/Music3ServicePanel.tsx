import { Cpu, ExternalLink, RefreshCw, ServerCog, ShieldCheck } from "lucide-react";
import type { ServiceState, StudioHealth } from "../lib/music3Types";

interface Music3ServicePanelProps {
  state: ServiceState;
  health?: StudioHealth;
  onRefresh: () => void;
}

export function Music3ServicePanel({ state, health, onRefresh }: Music3ServicePanelProps) {
  const online = state === "online";
  return (
    <section className="music3-service-panel">
      <div className="music3-panel-heading"><div><p className="eyebrow">Local runtime</p><h2>4090 / ComfyUI</h2></div><span className={`music3-state ${state}`}>{online ? "READY" : state.toUpperCase()}</span></div>
      <p>{online ? "MiniMax Music 3.0 is ready to receive a structured prompt." : "Start the gateway and ComfyUI to unlock generation."}</p>
      <dl className="music3-facts"><div><dt><Cpu size={14} aria-hidden="true" /> Model</dt><dd>Music 3 INT8</dd></div><div><dt><ShieldCheck size={14} aria-hidden="true" /> Decode</dt><dd>Tiled / local</dd></div><div><dt><ServerCog size={14} aria-hidden="true" /> ComfyUI</dt><dd>{health?.comfyui_version ?? "—"}</dd></div></dl>
      <div className="music3-service-actions"><button className="secondary-button" type="button" onClick={onRefresh}><RefreshCw size={15} aria-hidden="true" /> Refresh</button>{health?.comfyui_url && <a href={health.comfyui_url} target="_blank" rel="noreferrer"><ExternalLink size={14} aria-hidden="true" /> ComfyUI</a>}</div>
    </section>
  );
}
