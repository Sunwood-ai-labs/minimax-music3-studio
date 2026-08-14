---
layout: home
hero:
  name: MiniMax Music 3.0 Studio
  text: Keep the generation loop close to the GPU.
  tagline: A local-first ComfyUI workspace for structured briefs, Japanese vocals, tagged lyrics, and MP3 Library playback.
  actions:
    - theme: brand
      text: Studio guide
      link: /en/MINIMAX_MUSIC3_STUDIO
    - theme: alt
      text: GitHub README
      link: https://github.com/Sunwood-ai-labs/minimax-music3-studio
    - theme: alt
      text: 日本語
      link: /ja/MINIMAX_MUSIC3_STUDIO
features:
  - icon: "✦"
    title: Brief → queue → Library
    details: Turn structured production notes and section-tagged lyrics into a real ComfyUI job, then audition the MP3 locally.
  - icon: "⌘"
    title: MiniMax-focused
    details: The checked-in workflow keeps the MiniMax Music 3.0 nodes, INT8 model path, and audio output contract visible.
  - icon: "◌"
    title: GPU intentional
    details: ComfyUI remains the local worker, so model files and renders stay on the workstation that owns the GPU.
---

## See the Studio surface

![MiniMax Music 3.0 Studio Compose screen with a Japanese vocal brief](/images/minimax-music3-studio-ui.png)

Start with the [MiniMax Studio guide](./MINIMAX_MUSIC3_STUDIO), then use the
repository [README](https://github.com/Sunwood-ai-labs/minimax-music3-studio)
for the full local setup.

## Downstream-ready

The Library MP3 can flow into later SRT and HyperFrames lyric-motion work. Those
steps stay separate so the generation UI remains focused and local.
