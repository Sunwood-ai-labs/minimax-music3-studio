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
  - icon: "↗"
    title: Downstream-ready
    details: The Library MP3 can flow into later SRT and HyperFrames lyric-motion work without making video generation part of the core UI.
---

## A verified local workspace

![MiniMax Music 3.0 Studio Compose screen with a Japanese vocal brief](/images/minimax-music3-studio-ui.png)

The screenshot is from the running local Studio UI: the Japanese shell is using
the Compose surface, MiniMax Music 3.0 is ready through ComfyUI, and the brief
is prepared for a Japanese vocal generation.

[Read the Studio guide](./en/MINIMAX_MUSIC3_STUDIO) · [日本語ガイド](./ja/MINIMAX_MUSIC3_STUDIO)

## Keep the boundaries clear

MiniMax model weights stay outside Git. The gateway translates browser requests,
ComfyUI owns GPU execution, and the Studio keeps local task metadata plus audio
playback in the Library.
