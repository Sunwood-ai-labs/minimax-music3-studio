import { Archive, Music2, Radio } from "lucide-react";
import { Music3TaskQueue } from "../components/Music3TaskQueue";
import type { Music3Workspace } from "../lib/useMusic3Workspace";

export function Music3LibraryPage({ workspace }: { workspace: Music3Workspace }) {
  const ready = workspace.tasks.filter((task) => task.state === "ready");
  return <div className="page-stack music3-library-page">{workspace.notice && <div className="notice-banner" role="status"><Radio size={17} aria-hidden="true" />{workspace.notice}</div>}<section className="music3-library-hero"><div><p className="eyebrow">Local collection</p><h2>Every take, ready to hear again.</h2><p>MiniMax Music 3.0 outputs remain on this machine. Preview the MP3, download it, or pass it to your lyric-motion workflow.</p></div><div className="music3-library-count"><Music2 size={23} aria-hidden="true" /><strong>{ready.length}</strong><span>ready to audition</span></div></section><section className="music3-queue" aria-labelledby="library-heading"><div className="music3-queue-heading"><div><p className="eyebrow">Finished takes</p><h2 id="library-heading">Audition & collect</h2></div><Archive size={21} aria-hidden="true" /></div><Music3TaskQueue tasks={ready} /></section></div>;
}
