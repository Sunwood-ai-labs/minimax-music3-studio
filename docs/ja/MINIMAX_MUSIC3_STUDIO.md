# MiniMax Music 3.0 Studio

MiniMax Music 3.0 Studio は、ComfyUI 用のローカル音楽生成ワークスペースです。
構造化した制作メモとセクション付き歌詞を実際のキューへ送り、生成された
MP3をローカル Library に残して、ブラウザから再生・ダウンロードできます。

## できること

- **Compose** — ジャンル、テンポ、キー、ボーカル、アレンジ、歌詞を分けて入力。
- **ローカルゲートウェイ** — ブラウザとチェックイン済みの MiniMax Music 3.0
  workflow をつなぐ、依存の少ない Python ブリッジ。
- **Library** — タスクのローカルメタデータ、ブラウザ再生、MP3ダウンロード。
- **Setup** — ComfyUI とゲートウェイの状態、コピーできる Windows 起動コマンド。

主役は生成UIです。SRT生成やHyperFramesのリリックモーションは、Libraryの
MP3を入力にする後段の別ワークフローとして切り分けています。

## 起動手順

1. ComfyUI の API を `127.0.0.1:8201` で起動します。
2. リポジトリのルートでゲートウェイを起動します。

   ```powershell
   python tools/music3_gateway.py
   ```

3. フロントエンドを起動します。

   ```powershell
   Set-Location frontend
   npm ci
   npm run dev
   ```

4. <http://127.0.0.1:5173> を開き、**Compose** で Quick start を選びます。

ポートを変える場合は `MUSIC3_COMFY_URL`、`MUSIC3_GATEWAY_PORT`、
`VITE_API_TARGET` を設定してください。モデルウェイトはリポジトリに含めません。

## 生成の流れ

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
Library メタデータ + /audio/<prompt-id>
```

チェックインしている workflow は、INT8 DiT、MiniMax text encoder、MiniMax
DAV VAE、KSampler、`SaveAudioMP3` で構成しています。Tiled decode は
`VAEDecodeAudioTiled`、通常の decode は `VAEDecodeAudio` を使います。

## 変更を確認する

リポジトリのルートで実行します。

```powershell
docker compose -f docker-compose.music3.yml config --quiet
Set-Location frontend
npm run typecheck
npm test
npm run build
Set-Location ..
python -m unittest tools.test_music3_gateway
```

実機のスモーク確認は、**Compose** を開く → Quick start を選ぶ → 短い尺で
Generate → **Ready to audition** を待つ → キューまたは Library でMP3を再生、
という流れです。

## 公開リポジトリの境界

- モデルウェイト、秘密の `.env`、音声、SRT、レンダリング済み動画はGitに入れません。
- 非公式のコミュニティプロジェクトです。MiniMax、ComfyUI、ACE-Stepチームとは
  提携・承認関係にありません。
- React の土台は [ACE-Step Forge](https://github.com/Sunwood-ai-labs/ace-step-forge)
  です。MiniMax向けのgateway、workflow、Studio UIはこのリポジトリにあります。

[English guide](../en/MINIMAX_MUSIC3_STUDIO) または
[リポジトリ README](https://github.com/Sunwood-ai-labs/minimax-music3-studio)へ戻る。
