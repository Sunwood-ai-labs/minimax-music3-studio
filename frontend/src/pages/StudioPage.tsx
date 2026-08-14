import { Activity, CircleAlert, LibraryBig, Radio, Sparkles, Timer } from "lucide-react";
import { Music3Composer } from "../components/Music3Composer";
import { Music3ServicePanel } from "../components/Music3ServicePanel";
import { Music3TaskQueue } from "../components/Music3TaskQueue";
import type { Music3Workspace } from "../lib/useMusic3Workspace";

interface StudioPageProps { workspace: Music3Workspace; }

export function StudioPage({ workspace }: StudioPageProps) {
  return (
    <div className="page-stack music3-page">
      {workspace.notice && <div className="notice-banner" role="status"><Radio size={17} aria-hidden="true" />{workspace.notice}</div>}
      <section className="music3-metric-strip" aria-label="Generation summary"><div><Timer size={16} aria-hidden="true" /><span>In motion</span><strong>{workspace.metrics.active}</strong></div><div><LibraryBig size={16} aria-hidden="true" /><span>Library</span><strong>{workspace.metrics.ready}</strong></div><div><CircleAlert size={16} aria-hidden="true" /><span>Needs review</span><strong>{workspace.metrics.failed}</strong></div></section>
      <div className="music3-layout"><Music3Composer isSubmitting={workspace.isSubmitting} serviceState={workspace.serviceState} onSubmit={workspace.submit} /><aside className="music3-aside"><Music3ServicePanel state={workspace.serviceState} health={workspace.health} onRefresh={workspace.refreshService} /><section className="music3-note"><p className="eyebrow">Studio note</p><h2>Structure is the shortcut.</h2><p>The prompt becomes a durable MiniMax caption. Lyrics stay tagged, so the model can feel where the song changes shape.</p><div><Sparkles size={15} aria-hidden="true" /><span>30 sec → 5 min</span></div></section></aside></div>
      <section className="music3-queue" aria-labelledby="music3-queue-heading"><div className="music3-queue-heading"><div><p className="eyebrow">Render queue</p><h2 id="music3-queue-heading">What is taking shape</h2></div><div><Activity size={17} aria-hidden="true" /><span>{workspace.metrics.active ? "GPU active" : "Queue clear"}</span></div></div><Music3TaskQueue tasks={workspace.tasks} /></section>
    </div>
  );
}
