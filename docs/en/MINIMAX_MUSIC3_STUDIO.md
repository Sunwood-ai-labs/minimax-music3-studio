# MiniMax Music 3.0 Studio

MiniMax Music 3.0 Studio is a local-first generation workspace for ComfyUI.
It turns a structured brief and section-tagged lyrics into a real queue job,
then keeps the resulting MP3 available in a small local Library.

## What it provides

- **Compose** — separate fields for genre, tempo, key, vocal direction,
  arrangement, and tagged lyrics.
- **Local gateway** — a dependency-light Python bridge between the browser and
  the checked-in MiniMax Music 3.0 workflow.
- **Library** — local task metadata plus browser playback and MP3 download.
- **Setup** — visible ComfyUI and gateway health with copyable Windows commands.

The UI is the primary product surface. SRT generation and HyperFrames lyric
motion are intentionally separate downstream workflows that consume a Library
MP3.

## Quick start

1. Start ComfyUI with its API on `127.0.0.1:8201`.
2. From the repository root, start the gateway:

   ```powershell
   python tools/music3_gateway.py
   ```

3. Start the frontend:

   ```powershell
   Set-Location frontend
   npm ci
   npm run dev
   ```

4. Open <http://127.0.0.1:5173> and choose a Quick start in **Compose**.

Set `MUSIC3_COMFY_URL`, `MUSIC3_GATEWAY_PORT`, or `VITE_API_TARGET` when the
local services use different addresses. Model weights are not included in the
repository.

## Request flow

```text
Compose form
    │ structured caption + tagged lyrics
    ▼
MiniMax Music 3.0 gateway :8202
    │ POST /prompt
    ▼
ComfyUI :8201 ── GPU render ──► SaveAudioMP3
    │ history polling
    ▼
Library metadata + /audio/<prompt-id>
```

The checked-in workflow uses the INT8 DiT, MiniMax text encoder, MiniMax DAV
VAE, KSampler, and `SaveAudioMP3`. Tiled decode selects
`VAEDecodeAudioTiled`; regular decode uses `VAEDecodeAudio`.

## Verification

From the repository root:

```powershell
docker compose -f docker-compose.music3.yml config --quiet
Set-Location frontend
npm run typecheck
npm test
npm run build
Set-Location ..
python -m unittest tools.test_music3_gateway
```

The practical smoke path is: open **Compose**, choose a Quick start, use a
short duration, generate, wait for **Ready to audition**, and play the MP3 from
the queue or Library.

## Boundaries

- Keep model weights, private `.env` files, audio, SRT, and rendered video out
  of Git.
- The public repository is an unofficial community project and is not
  affiliated with MiniMax, ComfyUI, or the ACE-Step team.
- The React shell started from [ACE-Step Forge](https://github.com/Sunwood-ai-labs/ace-step-forge);
  the MiniMax gateway, workflow, and Studio UI changes live in this repository.

See the [Japanese guide](../ja/MINIMAX_MUSIC3_STUDIO) or return to the
[repository README](https://github.com/Sunwood-ai-labs/minimax-music3-studio).
