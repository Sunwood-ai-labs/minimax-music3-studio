import { BookOpen, CheckCircle2, Copy, ExternalLink, ServerCog } from "lucide-react";
import { useState } from "react";
import type { Music3Workspace } from "../lib/useMusic3Workspace";

function CopyLine({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard?.writeText(command); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  return <div className="music3-command"><code>{command}</code><button className="icon-button subtle" type="button" onClick={() => void copy()} title="Copy command" aria-label="Copy command">{copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}</button></div>;
}

export function Music3SystemPage({ workspace }: { workspace: Music3Workspace }) {
  return <div className="page-stack music3-system-page"><section className="music3-setup-hero"><div><p className="eyebrow">Local setup</p><h2>One GPU worker. One focused studio.</h2><p>ComfyUI owns model execution on the RTX 4090. This gateway only translates Studio requests into the checked-in MiniMax Music 3.0 API workflow.</p></div><ServerCog size={40} aria-hidden="true" /></section><div className="music3-setup-grid"><section className="music3-setup-card"><div className="music3-panel-heading"><div><p className="eyebrow">Runtime</p><h2>Connection status</h2></div><span className={`music3-state ${workspace.serviceState}`}>{workspace.serviceState.toUpperCase()}</span></div><dl className="music3-facts"><div><dt>Gateway</dt><dd>127.0.0.1:8202</dd></div><div><dt>ComfyUI</dt><dd>{workspace.health?.comfyui_url ?? "Not connected"}</dd></div><div><dt>ComfyUI version</dt><dd>{workspace.health?.comfyui_version ?? "—"}</dd></div></dl><button className="secondary-button" type="button" onClick={workspace.refreshService}>Refresh status</button></section><section className="music3-setup-card"><div className="music3-panel-heading"><div><p className="eyebrow">Start here</p><h2>Windows commands</h2></div><BookOpen size={20} aria-hidden="true" /></div><p className="music3-setup-copy">Run ComfyUI with the MiniMax workflow, then launch the gateway from the repository root.</p><CopyLine command="python tools/music3_gateway.py" /><CopyLine command="cd frontend; npm run dev" /><a className="music3-doc-link" href="https://github.com/Sunwood-ai-labs/minimax-music3-studio" target="_blank" rel="noreferrer">Open repository <ExternalLink size={14} aria-hidden="true" /></a></section></div></div>;
}
