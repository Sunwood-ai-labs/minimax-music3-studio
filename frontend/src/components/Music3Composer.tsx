import { FileMusic, Mic2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { Music3Settings } from "./Music3Settings";
import { defaultStudioDraft, type ServiceState, type StudioDraft } from "../lib/music3Types";

interface Music3ComposerProps {
  isSubmitting: boolean;
  serviceState: ServiceState;
  onSubmit: (draft: StudioDraft) => Promise<boolean>;
}

const quickStarts = [
  { label: "Wafu rock", globalMetadata: "Modern Japanese wafu rock, 118 BPM, D minor, cinematic and defiant, polished studio mix.", arrangement: "Shamisen accents, distorted electric guitar, melodic bass, live drums, taiko hits, and atmospheric synth pads." },
  { label: "City pop", globalMetadata: "Japanese city pop, 112 BPM, E major, bright and hopeful, nocturnal-to-dawn emotional arc.", arrangement: "Electric piano, clean chorus guitar, melodic bass, tight live drums, analog synth pads, and layered hook." },
  { label: "Film score", globalMetadata: "Japanese cinematic ballad, 82 BPM, A minor, spacious and bittersweet, intimate film-score production.", arrangement: "Piano, shakuhachi breath tones, restrained strings, low taiko, soft bass, and a slow-building final chorus." },
];

export function Music3Composer({ isSubmitting, serviceState, onSubmit }: Music3ComposerProps) {
  const [draft, setDraft] = useState<StudioDraft>(defaultStudioDraft);
  const [error, setError] = useState("");
  const update = <Key extends keyof StudioDraft>(key: Key, value: StudioDraft[Key]) => setDraft((current) => ({ ...current, [key]: value }));
  const submit = async () => {
    if (!draft.globalMetadata.trim()) return setError("Global Metadata を入力してください。");
    if (!draft.vocalDetails.trim()) return setError("Vocal Details を入力してください。");
    setError("");
    await onSubmit(draft);
  };
  const applyQuickStart = (preset: (typeof quickStarts)[number]) => setDraft((current) => ({ ...current, globalMetadata: preset.globalMetadata, arrangement: preset.arrangement }));

  return (
    <form className="music3-composer" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
      <div className="music3-composer-head">
        <div><p className="eyebrow">MiniMax Music 3.0</p><h2>Compose a whole song.</h2><p>Give the model a sonic brief, a voice, and lyrics with section tags.</p></div>
        <div className="music3-model-mark" aria-label="MiniMax Music 3.0"><span>3.0</span><small>MODEL</small></div>
      </div>

      <div className="music3-quickstarts" aria-label="Quick starts"><span>Start from</span>{quickStarts.map((preset) => <button type="button" key={preset.label} onClick={() => applyQuickStart(preset)}>{preset.label}</button>)}</div>

      <div className="music3-brief-grid">
        <label className="music3-brief-field wide"><span><strong>Global Metadata</strong><small>genre · tempo · key · emotional arc</small></span><textarea rows={3} value={draft.globalMetadata} onChange={(event) => update("globalMetadata", event.target.value)} placeholder="Modern Japanese rock, 120 BPM…" /></label>
        <label className="music3-brief-field"><span><strong>Vocal Details</strong><small>language · timbre · performance</small></span><textarea rows={3} value={draft.vocalDetails} onChange={(event) => update("vocalDetails", event.target.value)} placeholder="Clear Japanese lead vocal…" /></label>
        <label className="music3-brief-field"><span><strong>Arrangement</strong><small>instruments · structure · mix</small></span><textarea rows={3} value={draft.arrangement} onChange={(event) => update("arrangement", event.target.value)} placeholder="Shamisen, electric guitar…" /></label>
      </div>

      <label className="music3-lyrics-field"><span><strong>Lyrics</strong><small><Mic2 size={13} aria-hidden="true" /> Use [Intro], [Verse], [Chorus], [Bridge], [Outro]</small></span><textarea rows={7} value={draft.lyrics} onChange={(event) => update("lyrics", event.target.value)} placeholder={'[Verse]\n夜の向こうへ\n\n[Chorus]\nここから歌おう'} /></label>
      <Music3Settings draft={draft} onUpdate={update} />
      {error && <p className="music3-error" role="alert">{error}</p>}
      {serviceState === "offline" && <p className="music3-error" role="status">ComfyUI gateway に接続できません。Setup で起動手順を確認してください。</p>}
      <div className="music3-submit-row"><p><FileMusic size={15} aria-hidden="true" /> Local render · RTX 4090 profile · MP3 V0</p><button className="music3-generate" type="submit" disabled={isSubmitting || serviceState !== "online"}><Sparkles size={18} aria-hidden="true" /><span>{isSubmitting ? "Queuing…" : "Generate with MiniMax 3.0"}</span><kbd>⌘ ↵</kbd></button></div>
      <p className="music3-form-note"><Wand2 size={14} aria-hidden="true" /> The three brief fields are sent as the structured MiniMax caption format.</p>
    </form>
  );
}
