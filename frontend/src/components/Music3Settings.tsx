import { ChevronDown, Dice5, Gauge, Layers3 } from "lucide-react";
import type { StudioDraft } from "../lib/music3Types";

interface Music3SettingsProps {
  draft: StudioDraft;
  onUpdate: <Key extends keyof StudioDraft>(key: Key, value: StudioDraft[Key]) => void;
}

export function Music3Settings({ draft, onUpdate }: Music3SettingsProps) {
  return (
    <section className="music3-settings" aria-labelledby="settings-heading">
      <div className="music3-section-label"><Gauge size={16} aria-hidden="true" /><span id="settings-heading">Render controls</span><span className="music3-section-rule" /></div>
      <div className="music3-settings-grid">
        <label><span>Vocal language</span><select value={draft.vocalLanguage} onChange={(event) => onUpdate("vocalLanguage", event.target.value as StudioDraft["vocalLanguage"])}><option value="ja">Japanese / 日本語</option><option value="en">English</option><option value="zh">中文</option></select></label>
        <label><span>Length</span><div className="music3-unit-input"><input type="number" min="1" max="300" value={draft.duration} onChange={(event) => onUpdate("duration", event.target.value)} /><em>sec</em></div></label>
        <label><span>Variations</span><select value={draft.batchSize} onChange={(event) => onUpdate("batchSize", event.target.value)}><option value="1">1 take</option><option value="2">2 takes</option><option value="3">3 takes</option><option value="4">4 takes</option></select></label>
      </div>
      <details className="music3-advanced">
        <summary>Advanced sampler <ChevronDown size={15} aria-hidden="true" /></summary>
        <div className="music3-settings-grid advanced">
          <label><span>Steps</span><input type="number" min="4" max="60" value={draft.steps} onChange={(event) => onUpdate("steps", event.target.value)} /></label>
          <label><span>CFG scale</span><input type="number" min="0.1" max="4" step="0.1" value={draft.cfgScale} onChange={(event) => onUpdate("cfgScale", event.target.value)} /></label>
          <label className="music3-check"><input type="checkbox" checked={draft.tiledDecode} onChange={(event) => onUpdate("tiledDecode", event.target.checked)} /><span><strong><Layers3 size={14} aria-hidden="true" /> Tiled decode</strong><small>VRAM-friendly on a 4090</small></span></label>
        </div>
        <label className="music3-seed"><span><Dice5 size={14} aria-hidden="true" /> Seed</span><div><input disabled={draft.useRandomSeed} value={draft.useRandomSeed ? "Random per take" : draft.seed} onChange={(event) => onUpdate("seed", event.target.value)} /><div className="music3-check compact"><input aria-label="Random" type="checkbox" checked={draft.useRandomSeed} onChange={(event) => onUpdate("useRandomSeed", event.target.checked)} /><span>Random</span></div></div></label>
      </details>
    </section>
  );
}
