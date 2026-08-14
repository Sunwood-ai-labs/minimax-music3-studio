# MiniMax Music 3.0 Studio

ComfyUI 上の MiniMax Music 3.0 で、ローカル生成を行うための音楽制作
ワークスペースです。

[English](./README.md) · [Documentation](https://sunwood-ai-labs.github.io/minimax-music3-studio/)

[![Frontend CI](https://github.com/Sunwood-ai-labs/minimax-music3-studio/actions/workflows/frontend.yml/badge.svg)](https://github.com/Sunwood-ai-labs/minimax-music3-studio/actions/workflows/frontend.yml) [![License](https://img.shields.io/github/license/Sunwood-ai-labs/minimax-music3-studio)](./LICENSE) [![Node.js 20+](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

構造化した制作メモとセクション付き歌詞を実際の ComfyUI キューへ送り、
GPU レンダリングの進行を表示します。完成した MP3 はローカル Library
から再生・ダウンロードできます。

> 非公式のコミュニティプロジェクトです。MiniMax、ComfyUI、ACE-Step
> チームとは提携・承認関係にありません。

[MiniMax workflow](./workflows/minimax_music3_api.json) · [Issues](https://github.com/Sunwood-ai-labs/minimax-music3-studio/issues) · [MIT License](./LICENSE)

## 🎛️ このUIでできること

生成画面が主役です。ジャンル名を1つ入力するだけではなく、次の3つの
欄を分けて入力します。

```text
Global Metadata: ジャンル・テンポ・キー・感情の流れ
Vocal Details: 言語・声質・歌い方
Arrangement: 楽器・曲構成・ミックスの方向
```

UI が3つの欄を MiniMax Music 3.0 用の caption にまとめ、
`[Intro]`、`[Verse]`、`[Chorus]`、`[Bridge]`、`[Outro]` などのタグを含む
歌詞はそのまま渡します。

- **Compose** — 和風ロック・シティポップなどのQuick start、歌詞、
  秒数、steps、CFG、seed、テイク数、Tiled decode。
- **ローカルゲートウェイ** — Python 標準ライブラリだけで ComfyUI の
  API workflow をキューに送り、履歴を Studio 用の状態へ変換。
- **Library** — 生成済みMP3の再生とダウンロード。音声はGitに入りません。
- **Setup** — ComfyUI とゲートウェイの接続状態、Windows用コマンド。
- **レスポンシブUI** — デスクトップと狭い画面の両方で使える音楽制作画面。

生成後の歌詞・SRT・HyperFrames動画化は、Library の MP3 を入力にする別の
ワークフローとして扱います。このリポジトリでは、まず生成を確実に使える
ことを優先しています。

## 🖼️ UIプレビュー

![日本語ボーカルの制作メモを入力した MiniMax Music 3.0 Studio のCompose画面](./docs/public/images/minimax-music3-studio-ui.png)

1440×900のローカルCompose画面です。日本語シェルを選択し、MiniMax Music 3.0
のランタイムがReadyになった状態で、日本語ボーカル用の制作メモを入力しています。

## 🧰 必要なもの

- Windows、Python 3.11 以上、Node.js 20 以上
- MiniMax Music 3.0 ノードが使える ComfyUI
- 選択した尺に十分なVRAMを持つNVIDIA GPU（RTX 4090プロファイルで実機確認）
- ComfyUI のモデルフォルダに次のファイル：
  - `diffusion_models/minimax_music3_dit_int8_convrot.safetensors`
  - `text_encoders/minimax_music3_text_encoder_pruned_int8_convrot.safetensors`
  - `vae/minimax_music3_dav.safetensors`

モデルウェイトは公開リポジトリに含めません。

## 🚀 起動手順

### 1. ComfyUI を起動

ComfyUI の API を `127.0.0.1:8201` で起動します。別ポートの場合は、
ゲートウェイ起動前に `MUSIC3_COMFY_URL` を設定します。

### 2. ローカルゲートウェイを起動

リポジトリのルートで実行します。

```powershell
python tools/music3_gateway.py
```

ゲートウェイは `http://127.0.0.1:8202` で待機します。GPU処理はComfyUIが
担当し、ゲートウェイはリクエストの変換と履歴の読み取りだけを行います。

```powershell
$env:MUSIC3_COMFY_URL = "http://127.0.0.1:8201"
$env:MUSIC3_GATEWAY_PORT = "8202"
python tools/music3_gateway.py
```

### 3. Studio UI を起動

```powershell
Set-Location frontend
npm ci
npm run dev
```

ブラウザで <http://127.0.0.1:5173> を開きます。

ComfyUIをWindowsホストに残したまま、UIとgatewayだけをコンテナで起動する
場合は次を使えます。

```powershell
docker compose -f docker-compose.music3.yml up -d --build
```

ブラウザで <http://127.0.0.1:5173> を開きます。Compose版gatewayは
`host.docker.internal:8201` 経由でホスト上のComfyUIへ接続します。

## 🔄 生成の流れ

```text
Compose
  │ 構造化 caption + セクション付き歌詞
  ▼
MiniMax Music 3.0 gateway :8202
  │ POST /prompt
  ▼
ComfyUI :8201 ── GPU生成 ──► SaveAudioMP3
  │ 履歴をポーリング
  ▼
Library + /audio/<prompt-id>
```

チェックインしているworkflowは、INT8 DiT、MiniMax text encoder、MiniMax
DAV VAE、KSampler、`SaveAudioMP3` で構成しています。Tiled decode をONに
すると `VAEDecodeAudioTiled`（tile 512 / overlap 64）、OFFにすると通常の
`VAEDecodeAudio`を使います。

## ✅ 変更を確認する

```powershell
docker compose -f docker-compose.music3.yml config --quiet
Set-Location frontend
npm run typecheck
npm test
npm run build
Set-Location ..
python -m unittest tools.test_music3_gateway
```

実機の確認手順は、Composeを開く → Quick startを選ぶ → 短い尺にする →
Generate → **Ready to audition** を待つ → キューまたはLibraryでMP3を再生、
です。8秒・日本語ボーカル・8 steps・Tiled decodeのリクエストを実際に生成し、
ブラウザで約8秒のMP3を再生するところまで確認済みです。

## 🧱 公開リポジトリの境界

- モデルウェイト、秘密の `.env`、音声、SRT、動画はコミットしません。
  実行時のLibraryメタデータは無視対象の `data/` に保存します。
- Reactの土台は
  [ACE-Step Forge](https://github.com/Sunwood-ai-labs/ace-step-forge) を
  もとにしています。上流コードとMIT表記はツリーに残し、MiniMax向けの
  生成処理はこのリポジトリのgateway/UIで実装しています。
- リポジトリ名は `minimax-music3-studio`、表示名は
  **MiniMax Music 3.0 Studio** です。

## 🔗 参考リンク

- [MiniMax AI（GitHub）](https://github.com/MiniMax-AI)
- [ComfyUI用 MiniMax Music 3.0 モデル](https://huggingface.co/Comfy-Org/MiniMax-Music-3)
- [ComfyUI](https://github.com/comfyanonymous/ComfyUI)
- [ACE-Step Forge](https://github.com/Sunwood-ai-labs/ace-step-forge)
- [ACE-Step 1.5 upstream](https://github.com/ace-step/ACE-Step-1.5)
