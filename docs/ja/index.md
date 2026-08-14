---
layout: home
hero:
  name: MiniMax Music 3.0 Studio
  text: GPUのそばで、生成の流れをつなぐ。
  tagline: 構造化した制作メモ、日本語ボーカル、セクション付き歌詞、MP3 LibraryをまとめたComfyUI向けローカルワークスペースです。
  actions:
    - theme: brand
      text: Studio ガイド
      link: /ja/MINIMAX_MUSIC3_STUDIO
    - theme: alt
      text: GitHub README
      link: https://github.com/Sunwood-ai-labs/minimax-music3-studio
    - theme: alt
      text: English
      link: /en/MINIMAX_MUSIC3_STUDIO
features:
  - icon: "✦"
    title: Brief → queue → Library
    details: 制作メモとセクション付き歌詞をComfyUIの実ジョブへ送り、MP3をローカルで試聴できます。
  - icon: "⌘"
    title: MiniMaxに集中
    details: チェックイン済みworkflow、INT8モデル構成、音声出力の契約をUIから追いやすくしています。
  - icon: "◌"
    title: GPUを意識した構成
    details: ComfyUIをローカルworkerとして使うため、モデルと生成物はGPUを持つワークステーションに残ります。
---

## Studioの画面を見る

![日本語ボーカルの制作メモを入力した MiniMax Music 3.0 Studio のCompose画面](/images/minimax-music3-studio-ui.png)

実際に動作しているローカルStudio UIの画面です。日本語シェルでComposeを
開き、ComfyUI上のMiniMax Music 3.0がReadyになった状態を表示しています。

[MiniMax Studio ガイド](./MINIMAX_MUSIC3_STUDIO)から始め、詳しい起動手順は
リポジトリの [README](https://github.com/Sunwood-ai-labs/minimax-music3-studio)を参照してください。

## 後段のワークフローへ

LibraryのMP3は、後段のSRT生成やHyperFramesのリリックモーションに渡せます。
生成UIの役割を絞るため、動画化は別ワークフローとして扱います。
