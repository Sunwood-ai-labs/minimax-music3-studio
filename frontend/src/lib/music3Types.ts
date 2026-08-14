export type StudioTaskState = "queued" | "working" | "ready" | "failed";
export type ServiceState = "checking" | "online" | "offline";

export interface StudioDraft {
  globalMetadata: string;
  vocalDetails: string;
  arrangement: string;
  lyrics: string;
  vocalLanguage: "ja" | "en" | "zh";
  duration: string;
  steps: string;
  cfgScale: string;
  useRandomSeed: boolean;
  seed: string;
  batchSize: string;
  tiledDecode: boolean;
}

export interface StudioSettings {
  caption: string;
  lyrics: string;
  max_duration: number;
  steps: number;
  cfg_scale: number;
  seed?: number;
  batch_size: number;
  tiled_decode: boolean;
}

export interface StudioResult {
  file: string;
}

export interface StudioTask {
  id: string;
  state: StudioTaskState;
  created_at: number;
  prompt: string;
  lyrics: string;
  settings?: StudioSettings;
  result?: StudioResult;
  error?: string;
}

export interface StudioHealth {
  status: string;
  service: string;
  comfyui_version?: string;
  comfyui_url: string;
}

export const defaultStudioDraft: StudioDraft = {
  globalMetadata: "Modern Japanese wafu rock, 118 BPM, D minor, cinematic and defiant, polished studio mix.",
  vocalDetails: "Clear Japanese female lead vocal, intimate verse, soaring chorus, natural breaths, no rap.",
  arrangement: "Shamisen accents, distorted electric guitar, melodic bass, live drums, taiko hits, and atmospheric synth pads.",
  lyrics: "[Intro]\n夜明け前の風\n\n[Verse]\n静かな街を抜けて\n\n[Chorus]\nここから走り出そう",
  vocalLanguage: "ja",
  duration: "30",
  steps: "30",
  cfgScale: "1.7",
  useRandomSeed: true,
  seed: "",
  batchSize: "1",
  tiledDecode: true,
};
