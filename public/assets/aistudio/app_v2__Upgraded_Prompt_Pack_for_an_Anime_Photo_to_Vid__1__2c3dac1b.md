# Cinematic Sky v2 — Upgraded Prompt Pack (Oct 2026)

Upgraded prompt below → drop-in: 1 master spec + 16 phased module prompts + settings reference + changelog. Every original feature kept; ~150 features/functions/settings added; grounded in Oct-2026 browser/platform/AI-tool facts.

## TL;DR
- Paste `00-master-prompt.md` for one-shot builders w/ big context (Claude Code, Cursor, AI Studio); paste `01`→`16` in order for Lovable/Bolt/v0/Base44 (Lovable Knowledge caps at 10,000 chars, URL prompts at 50,000 chars per Lovable docs) → phased build avoids truncation.
- Big fixes: export → MP4 (H.264/AAC) where supported + WebM fallback + offline frame-perfect WebCodecs render via Mediabunny (mp4-muxer/webm-muxer deprecated); Scene Anchors editor so effects work on any photo; render res decoupled from preview; procedural fallback scene; WCAG 2.3.1 lightning cap.
- AI Prompt Modal updated: Sora 2 API shut down Sept 24, 2026 → removed; now Midjourney V8.2 / Niji 7, Kling 3.0, Veo 3.1, Runway Gen-4.5, MiniMax H3, PixVerse V6, Pika 2.5, Suno v6.

## Key Findings (research → spec decisions)
- **MediaRecorder MP4**: Chrome 126+ records MP4 (H.264 + AAC-LC, fragmented MP4) per addpipe's MediaRecorder demo table; [github](https://github.com/addpipe/Media-Recorder-API-Demo) Safari has recorded MP4 H.264/AAC since 14.1, Safari 18.4 added WebM; Firefox doesn't record MP4 (testmuai MediaRecorder guide). [testmuai](https://www.testmuai.com/learning-hub/mediarecorder-browser-support/) Chrome MP4 only where OS encoder exists → `isTypeSupported()` chain mandatory. [testmuai](https://www.testmuai.com/learning-hub/mediarecorder-browser-support/)
- **WebCodecs**: Chrome 94+, Firefox 130+ desktop only (no Android), Safari 26.0+ (testmuai WebCodecs guide); [testmuai](https://www.testmuai.com/learning-hub/webcodecs-browser-support/) Safari 26.0 added AudioEncoder/AudioDecoder (WebKit "Features in Safari 26.0"). [webkit](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/) MDN Codec selection: AAC encoding unsupported in Firefox on any platform + any browser on desktop Linux → WebM/Opus fallback there. [mozilla](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API/Codec_selection)
- **Muxer**: mp4-muxer deprecated, "superseded by Mediabunny" (npm); Mediabunny = zero-dep, tree-shakable TS (mediabunny.dev); MPL-2.0, v1.60.0 released 2026-09-27 per a Sept-2026 project PR. → use Mediabunny only. [npmjs +2](https://www.npmjs.com/package/mp4-muxer)
- **WebM duration bug**: Chrome writes WebM as live stream w/ no Duration + no Cues (ffmpeg-micro); `fix-webm-duration` patches Duration but not Cues → spec patches duration client-side, server remux `-cues_to_front 1` optional. [dev](https://dev.to/daniel_pertu/chrome-records-webm-with-no-duration-in-the-header-and-five-head-requests-decide-whether-you-get-1ho7) [ffmpeg-micro](https://www.ffmpeg-micro.com/blog/mediarecorder-webm-isn-t-broken-convert-it-to-mp4-server-side)
- **Hidden tab**: rAF paused in background tabs (MDN); [github](https://github.com/mdn/content/blob/main/files/en-us/web/api/window/requestanimationframe/index.md?plain=1) Chrome intensive throttling = timers checked once per minute (MDN setTimeout); [mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout) Firefox canvas stream "throttled to 1 fps" in background, "Canvas captureStreams are tied to rAF" (Mozilla bug 1344524) [mozilla](https://bugzilla.mozilla.org/show_bug.cgi?id=1344524) → real-time recording unreliable → offline render mode + visibility guard.
- **WebGPU**: Chrome 113 (Android 121), Firefox 141 Windows / 145 macOS Apple Silicon, Linux+Android in progress, Safari 26 (web.dev) [chrome](https://developer.chrome.com/docs/web-platform/webgpu/overview) [webgpu](https://webgpu.com/news/webgpu-hits-critical-mass-all-major-browsers/) → WebGPU primary, WebGL2 fallback, Canvas2D last resort.
- **HEIC**: Safari 17+ decodes via `createImageBitmap`; Chrome/Firefox generally can't (dev.to libheif write-ups). [dev](https://dev.to/muhayminbinmehmood/decoding-iphone-heic-photos-in-the-browser-with-libheif-wasm-and-the-one-line-bug-that-broke-it-242) [dev](https://dev.to/zahriontech/how-to-convert-heic-to-jpg-in-the-browser-no-uploads-100-private-25m0) Conflict: one source claims Chrome 118 on macOS/Android → runtime probe, then lazy WASM (libheif) fallback. [heicify](https://www.heicify.com/guides/heic-browser-support)
- **Depth**: Depth Anything V2 Small = 24.8M params, Apache-2.0 (larger variants different license); ONNX fp32 94.47 MB / fp16 47.34 MB / quantized 26.00 MB (Hugging Face model card). [huggingface +2](https://huggingface.co/skillsafe-ai/depth-anything-v2-small) Opt-in + lazy.
- **Segmentation**: MediaPipe SelfieSegmenter 256×256, ~447 KB, Apache-2.0; DeepLab-V3 257×257 general-purpose, 123.93 ms CPU / 103.30 ms GPU (Google AI Edge guide) → sky mask via DeepLab or depth-threshold heuristic. [google](https://developers.google.com/edge/mediapipe/solutions/vision/image_segmenter) [qualcomm](https://aihub.qualcomm.com/models/mediapipe_selfie)
- **Platforms**: all three = 1080×1920, 9:16, MP4, stereo AAC; Shorts max 3 min, Reels 90 s shelf, TikTok 10 min (Blitzcut 2026 table). [blitzcutai](https://blitzcutai.com/blog/social-video-specs-2026) Safe zones disagree across sources: Meta asks 14% top / 35% bottom / 6% sides (Solid Labs); [solidlabs](https://www.solidlabs.com/social-safe-zones) common denominator 900×1400 centered (AdaptlyPost) [adaptlypost](https://adaptlypost.com/en/blog/social-media-safe-zones-2026-complete-guide) → ship per-platform guide overlays, default = strictest.
- **Competitors**: Motionleap = motion paths + anchors + freeze brush, sky replacement, overlays, Camera FX (tilt, zoom, dolly), loop modes (Boomerang, Circular) (App Store listing, Google Play editorial, TapSmart) → all reproducible client-side via mesh warp. [apple +3](https://apps.apple.com/mx/app/motionleap-ai-animate-photo/id1381206010?l=en-GB)
- **AI tools Oct 2026**: Midjourney V8.2 default since July 24, 2026; `--q` unsupported on V8.1/8.2; `--cref` V6-only; anime → `--niji 7` (aireiter, prompt-architects). [aireiter](https://aireiter.com/blog/midjourney-v8-1-prompts-guide) [prompt-architects](https://prompt-architects.com/blog/334-midjourney-prompts-for-architecture-v8-parameters) Kling 3.0 (Feb 2026; Turbo + Omni June 17, 2026); [tech-insider](https://tech-insider.org/ca/sora-2-vs-veo-3-1-vs-kling-3-0-2026/) Veo 3.1; Runway Gen-4.5 (Dec 1, 2025); [ocdevel](https://ocdevel.com/mlg/mla-26) [getaiperks](https://www.getaiperks.com/en/blogs/44-best-ai-video-generators-2026) Sora 2: app closed Apr 2026, API shut down Sept 24, 2026 (tech-insider, pinggy); [pinggy](https://pinggy.io/blog/best_video_generation_ai_models/) [tech-insider](https://tech-insider.org/best-ai-video-generator-2026/) MiniMax H3 released July 31, 2026; [pixo](https://pixo.video/blog/what-is-minimax-h3) PixVerse V6 Mar 30, 2026; [versely](https://www.versely.studio/blog/best-ai-video-generation-models-2026) Pika 2.5 = "current engine… released in early 2026" (aitoolses.com, Sept 2026). Suno v6 / v6-wild / v6-mini launched Sept 9, 2026, all older models retired (datanorth). [moelueker +2](https://moelueker.com/blog/suno-v5-vs-v4-5-what-actually-changed-and-when-to-use-each) Udio: "downloading of audio, video, and stems has been disabled" since the Oct 29, 2025 UMG partnership (Udio Help Center) → not templated.
- **Flash safety**: WCAG 2.3.1 — nothing flashes "more than three times in any one second period" unless below general/red flash thresholds (W3C Understanding 2.3.1). [w3](https://www.w3.org/TR/UNDERSTANDING-WCAG20/seizure-does-not-violate.html)
- **Web Share files**: `navigator.canShare` Chrome 128, Edge 93, Firefox behind flag (web.dev) → feature-detect, fall back to download. [web](https://web.dev/articles/web-share)
- **Builder limits**: Lovable Knowledge 10,000 chars; Build-with-URL 50,000 chars (Lovable docs); [lovable](https://docs.lovable.dev/integrations/build-with-url) [lovable](https://docs.lovable.dev/features/knowledge) Bolt hit "200000 maximum" / "500000 maximum" token errors (GitHub issues); [github](https://github.com/stackblitz/webcontainer-core/issues/1616) [github](https://github.com/stackblitz/webcontainer-core/issues/1856) v0 attachment 5 MB (Vercel community); [vercel](https://community.vercel.com/t/attachment-size-limits/45645) AI Studio Build + Base44 → no published cap found.

---

## FILE: 00-master-prompt.md

````markdown
# Build: "Cinematic Sky — Anime Photo to Video Animator" (v2, production spec)

You are building a complete, production-grade web application. Deliver complete, verified, drop-in production code for every file listed. Do not output placeholders, TODOs, stubs, "omitted for brevity", pseudo-code, or truncated files. Put every module in its own file following the folder structure below; never merge unrelated concerns into one file. Explanations appear only as inline code comments and short technical-tradeoff notes inside comments. If your output budget is exhausted, stop at a file boundary and state the exact next file to generate; never emit a partial file.

## 0. Product summary
A mobile-first, offline-capable Progressive Web App that turns a static anime artwork or photo into a living cinematic video loop: procedural weather and lighting, 2.5D depth parallax, motion-brush animation, color grading, a fully generative lo-fi soundtrack synthesized with the Web Audio API, a social-reel overlay, and client-side video export (MP4 where the browser supports it, WebM otherwise). The core engine (decode, analyze, render, audio, export) runs 100% in the browser and works with no network and no backend. An optional Node.js/Express backend (separate package) adds accounts, cloud projects, a public preset gallery, comments, server-side MP4 transcoding, share links, and an LLM proxy.

## 1. Tech stack (pin exact versions in package.json; use the latest stable releases available at build time)
- React 18+ with TypeScript in strict mode (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), Vite, Tailwind CSS, Lucide React icons.
- State: Zustand with `subscribeWithSelector` and `persist` middleware; zod for every schema crossing a trust boundary (files, JSON imports, URL state, IndexedDB reads, network responses).
- Rendering: WebGPU primary, WebGL2 fallback, Canvas2D last-resort fallback. Rendering runs in a Web Worker via OffscreenCanvas when `HTMLCanvasElement.prototype.transferControlToOffscreen` exists; otherwise on the main thread.
- Media: Mediabunny for muxing MP4/WebM from WebCodecs output (do not use the deprecated mp4-muxer or webm-muxer packages); MediaRecorder for real-time capture.
- Optional lazy-loaded modules: @huggingface/transformers (Depth Anything V2 Small, ONNX, WebGPU with WASM fallback), @mediapipe/tasks-vision (image segmentation), a libheif WASM build for HEIC, gifenc for GIF, fflate for ZIP. Each loads only on first use via dynamic `import()`.
- Testing: Vitest + @testing-library/react, Playwright, fast-check for property tests.
- i18n: i18next with ICU message format; RTL support.

## 2. Architecture rules
1. The engine is framework-agnostic TypeScript (`src/engine/**`) with zero React imports. React (`src/ui/**`) only renders controls and subscribes to the store.
2. The render loop never triggers React re-renders. Engine reads the latest state through a mutable ref/snapshot updated by a Zustand `subscribe` listener; UI components use narrow selectors with shallow equality.
3. One master clock: `AudioContext.currentTime` during live preview; a deterministic frame clock (`frameIndex / fps`) during offline render. All visual events (lightning, beat pulses, keyframes) are scheduled against this clock.
4. A typed event bus (`EventBus<EventMap>`) carries cross-module events: `lightning:strike {t, distanceKm, intensity}`, `beat {t, bar, step}`, `record:state`, `render:progress`, `asset:decoded`, `gl:contextlost`, `audio:state`.
5. Seeded determinism: every random source uses a seeded PRNG (mulberry32 or sfc32) derived from `project.seed` + subsystem salt, so the same project renders identical frames and audio.
6. All long tasks accept an `AbortSignal`. All async results carry a request token; stale results are discarded.
7. Object pooling and typed arrays (`Float32Array` struct-of-arrays) for particles; zero allocations per frame in hot paths.
8. Lazy-load heavy modules (ML, HEIC, GIF, ZIP, LUT parser, timeline editor).

### 2.1 Frontend pipeline (mirrors Client → Route → Middleware → Controller → Service → Model → Response)
Input (file/drop/paste/camera/URL) → Sanitize & Decode (magic-byte sniff, size caps, orientation, HEIC) → Analyze (auto-crop, focal point, depth, segmentation, anchor suggestions) → Scene Graph (layers, anchors, emitters, lights, camera) → Render (background, parallax, particles, lights) → PostFX (grade, bloom, film, VHS/CRT) → Compositor (reel overlay, text, watermark, safe-zone guides) → Capture/Encode (MediaRecorder or WebCodecs) → Mux (Mediabunny) → Download/Share.

### 2.2 Frontend folder structure (generate every file)
```
frontend/
  public/
    manifest.webmanifest        → PWA manifest incl. file_handlers + share_target
    icons/                      → PWA icons (generated SVG → PNG at build)
    sw.js                       → generated by vite-plugin-pwa (Workbox)
  src/
    main.tsx                    → bootstraps React, registers SW, error boundary
    App.tsx                     → layout shell, routes panels, lazy boundaries
    config/
      constants.ts              → limits, defaults, budgets (single source of truth)
      featureDetect.ts          → WebGPU/WebGL2/OffscreenCanvas/WebCodecs/MediaRecorder/HEIC/Share probes
      env.ts                    → optional VITE_API_BASE_URL; app works when unset
    core/
      eventBus.ts               → typed pub/sub
      clock.ts                  → master clock (audio or frame clock)
      rng.ts                    → seeded PRNG + noise (simplex/value noise)
      pool.ts                   → generic object/typed-array pools
      commands.ts               → command pattern for undo/redo
      errors.ts                 → typed AppError hierarchy + user-safe messages
    pipeline/
      input/                    → fileIntake.ts, pasteDrop.ts, cameraCapture.ts, urlImport.ts
      sanitize/                 → sniffMime.ts, limits.ts, decodeImage.ts, heicDecode.ts, svgPolicy.ts
      analyze/                  → autoCrop.ts, focalPoint.ts, depthEstimator.ts, skySegmenter.ts, anchorSuggest.ts
      scene/                    → sceneGraph.ts, anchors.ts, layers.ts, proceduralFallback.ts
      render/                   → renderer.ts, backends/{webgpu,webgl2,canvas2d}.ts, renderWorker.ts, adaptiveQuality.ts
      fx/                       → weather/*.ts, lighting/*.ts, camera/*.ts, anime/*.ts, motionBrush/*.ts
      postfx/                   → passes/*.ts, lut.ts, colorMath.ts
      compositor/               → overlayCompositor.ts, safeZones.ts, textRenderer.ts, subtitles.ts
      capture/                  → mimeNegotiation.ts, realtimeRecorder.ts, offlineRenderer.ts, webmDurationFix.ts
      mux/                      → mediabunnyMux.ts, gifEncode.ts, pngSequenceZip.ts, wavEncode.ts
      deliver/                  → download.ts, share.ts, filename.ts
    audio/
      engine.ts                 → AudioContext lifecycle, unlock, routing graph
      scheduler.ts              → lookahead scheduler (25 ms tick, 100 ms horizon)
      instruments/              → fmRhodes.ts, drums.ts, bass.ts, melody.ts
      ambience/                 → rain.ts, thunder.ts, wind.ts, engineRumble.ts, city.ts, cafe.ts, crickets.ts, train.ts, chimes.ts
      fx/                       → reverbIR.ts, tape.ts, vinyl.ts, eq3.ts, sidechain.ts, master.ts
      composer/                 → theory.ts, progressions.ts, generator.ts
      analysis/                 → analyser.ts, bpmDetect.ts
      offline.ts                → OfflineAudioContext deterministic render
    timeline/
      keyframes.ts, easing.ts, markers.ts, interpolate.ts
    presets/
      schema.ts                 → zod PresetV3 + migrations v1→v2→v3
      builtin/                  → one file per built-in preset (12 files)
      presetService.ts          → CRUD, favorites, randomize, thumbnails
    storage/
      db.ts                     → IndexedDB (idb) stores: projects, presets, assets, thumbnails, settings
      autosave.ts, quota.ts, shareUrl.ts, projectIO.ts
    settings/
      schema.ts, defaults.ts, settingsService.ts
    ai/
      promptTemplates.ts        → per-tool templates
      promptFromScene.ts        → derives prompts from current scene state
    api/                        → optional backend client (fetch wrapper, retry, idempotency, offline queue)
    i18n/                       → index.ts + locales/{en,ja,es,ar,he,hi,pt,ko,zh}.json
    store/
      index.ts                  → root store composition
      slices/                   → sceneSlice, fxSlice, audioSlice, overlaySlice, exportSlice, timelineSlice, settingsSlice, uiSlice, historySlice
    ui/
      components/               → one component per file (Slider, Toggle, ColorPicker, Knob, Meter, Modal, Drawer, Toast...)
      panels/                   → ScenePanel, WeatherPanel, LightingPanel, CameraPanel, PostFxPanel, AudioMixerPanel, ComposerPanel, OverlayPanel, TimelinePanel, ExportPanel, PresetsPanel, SettingsPanel, AnchorsEditor, MotionBrushEditor, AIPromptModal, CommentsDrawer, RecordingHUD, PreviewModal, PerfOverlay
      hooks/                    → useEngine, useHotkeys, useReducedMotion, useVisibility, useHaptics
      styles/                   → tailwind.css, tokens.css
    workers/
      render.worker.ts, analyze.worker.ts, encode.worker.ts
    types/                      → shared TS types
  tests/
    unit/  e2e/  fixtures/
  index.html  vite.config.ts  tailwind.config.ts  tsconfig.json  playwright.config.ts  vitest.config.ts  package.json  README.md
```

## 3. Rendering engine
### 3.1 Resolution model (fixes the false "4K" claim)
- Preview resolution and render resolution are independent. Preview = canvas CSS size × min(devicePixelRatio, DPR cap [default 2]) × render scale [0.5–1.0, default auto]. Export resolution = 720p, 1080p (default), 1440p, or 2160p on the chosen aspect ratio's long edge mapping (e.g., 9:16 1080p = 1080×1920; 2160p = 2160×3840).
- 2160p export is enabled only when the offline renderer is available and `maxTextureDimension2D ≥ 4096` (WebGPU) or `MAX_TEXTURE_SIZE ≥ 4096` (WebGL2); show estimated memory and duration before starting.
- Source images are downscaled once to at most 4096 px on the long edge (configurable 2048–8192) using `createImageBitmap` with `resizeQuality: 'high'`.

### 3.2 Backends
- Auto selection order: WebGPU → WebGL2 → Canvas2D (user-overridable in Settings). WebGPU ships in Chrome 113+ (Android 121+), Firefox 141+ on Windows and 145+ on Apple-silicon macOS, and Safari 26 (web.dev); Linux and Android Firefox remain incomplete, so WebGL2 fallback is mandatory.
- Identical visual output contract across WebGPU/WebGL2 (shader parity tests compare frames with SSIM ≥ 0.98). Canvas2D renders a reduced feature set (no depth parallax, no bloom; particles and grade only) and labels itself "Compatibility mode".
- Handle `webglcontextlost`/`webglcontextrestored` and `GPUDevice.lost`: pause loop, release resources, rebuild pipeline, re-upload textures from retained ImageBitmaps, resume; after 3 losses in 60 s, drop one backend tier and toast the user.

### 3.3 Frame loop & adaptive quality
- Preview loop via `requestAnimationFrame` (or worker rAF). Fixed-timestep simulation at 60 Hz with interpolation; render at max FPS setting (30/60/120/display).
- Adaptive quality controller: rolling 60-frame average; if frame time > budget × 1.15 for 1 s, step down (particle density −20%, then postFX quality, then render scale −0.1, floor 0.5); step up after 5 s under budget × 0.8. Hysteresis prevents oscillation.
- Performance budget: 60 fps preview at 1080×1920 on a 2023 mid-range Android device (e.g., Snapdragon 7-series) with adaptive quality on; ≤ 8 ms main-thread time per frame; JS heap < 400 MB at 1080p preview.

### 3.4 Procedural fallback scene (never a blank canvas)
If no image is loaded or the default asset fails, render a fully procedural anime night scene: gradient sky, moon disc with glow, layered parallax hills, a stylized road with wet reflections, a silhouetted tree, and a motorcycle silhouette built from vector paths with a headlight anchor. All weather and audio work on it.

### 3.5 Scene Anchors editor (fixes effects hardcoded to the default image)
Per image, the user places (drag, resize, rotate) and the engine persists in the project:
- Light sources (point / spot / headlight cone): position, direction, cone angle 5–90°, color temperature 1800–12000 K, intensity 0–200%, flicker type (none, vintage electrical, candle, neon buzz), flicker rate.
- Horizon line and ground plane (two-point quad) used for puddle ripples, reflections, and particle collision.
- Puddle zones (polygons, feather 0–64 px).
- Foliage emitter regions (polygons) for leaves/petals; spawn rate per region.
- Sky mask (brush + auto) for clouds, moon, aurora, lightning, sky replacement.
- Foreground occlusion mask (brush + auto from depth) so particles pass behind foreground objects.
- Water regions for flow animation; freeze mask for motion brush.
- Auto-suggest button: runs depth + segmentation (opt-in download) and proposes horizon, sky mask, occlusion mask, and brightest-blob light candidates; the user accepts or edits each suggestion.

## 4. Visual effects (every parameter: range, default, unit; all keyframeable)
### 4.1 Weather & particles
- Rain: 3 depth layers (far/mid/near) with per-layer speed, length, opacity; intensity 0–100% (default 60), wind −100…100 (default 15) deflecting angle up to 35°; motion-blurred streaks; ground splashes on ground plane; lens droplets (0–100%) with refraction (sample background with offset normal map) and slide trails; rain occluded by foreground mask.
- Puddle ripples: concentric rings, radius growth 40–200 px/s, lifetime 0.4–1.6 s, alpha fade, max 512 concurrent (pooled), only inside puddle zones or below horizon.
- Wet-road reflections: vertically mirrored, blurred, streaked specular of every light source on the ground plane; wetness 0–100%.
- Snow (flake size, drift turbulence, accumulation tint), hail (bounce), fog/mist (2-octave scrolling noise, density 0–100%, height falloff from horizon, depth-weighted when depth exists), fireflies (blink rate, glow), sakura petals (tumbling 3D rotation projected), autumn leaves (from foliage regions, flutter), embers (rising, additive), dust motes (depth-of-field bokeh), god rays (radial blur from a light anchor), rainbow (arc position, opacity), heat haze (screen-space distortion below horizon), shooting stars (frequency per minute), aurora (curtain noise, hue range), stars (density, twinkle).
- Moon: phase 0–1 (default 0.85), draggable position, glow radius, halo ring toggle; procedural volumetric clouds (3 noise layers, coverage 0–100%, speed, darkness) that periodically veil the moon (moon glow modulated by cloud density sampled at the moon position).
- Global particle cap setting (1k–50k, default auto by device tier); all systems share the pool budget.

### 4.2 Lighting & lightning
- Headlight: radial flare + volumetric cone beam on the wet road with vintage electrical flicker (noise-driven 0–30% amplitude); anamorphic streak toggle.
- Lightning: procedural branching bolts (midpoint displacement, 3–6 generations, branch probability 0.3), sky illumination flash, scene relight; frequency 0–12 per minute (default 2); distance 0.5–15 km controls flash-to-bang delay (distance / 0.343 km/s, the speed of sound in dry air at 20 °C, about 3 s per km; optional temperature input adjusts it, 331.3 m/s at 0 °C) and thunder low-pass cutoff; manual "Strike" button; event markers on the timeline.
- Photosensitivity guard (WCAG 2.3.1): a flash limiter enforces no more than 3 flashes in any rolling 1000 ms window and never emits saturated-red flashes; Photosensitive Safe Mode limits to 1 flash per 2 s, ramps flashes over ≥ 300 ms, and clamps frame-mean relative-luminance change below 0.1; `prefers-reduced-motion` enables Safe Mode by default. The limiter also applies to audio-reactive pulses and glitch effects.

### 4.3 Camera
- Ken Burns path editor: start and end rectangles drawn on the image, easing curve (linear, easeInOutSine, easeInOutCubic, custom bezier), duration synced to loop length.
- Modes: breathing drift, slow zoom in/out, horizontal/vertical pan, orbit (with depth), dolly zoom (vertigo, requires depth), Perlin handheld shake (amplitude 0–20 px, frequency 0.1–3 Hz), audio-reactive pulse.
- Depth parallax camera: 2.5D displacement using the depth map (strength 0–100%, focus depth 0–1), with edge inpainting via mirrored stretch to hide disocclusion.

### 4.4 2.5D, motion brush, sky
- Depth (opt-in, lazy): Depth Anything V2 Small via transformers.js (ONNX, WebGPU device with WASM fallback). Default to the quantized ONNX (~26 MB) on mobile and fp16 (~47 MB) on WebGPU desktops; Apache-2.0 license applies only to the Small variant — never ship larger variants. Show download size, cache in Cache Storage, run in `analyze.worker.ts` at 518 px input, upscale with joint bilateral filtering guided by the image.
- Uses: parallax, depth fog, depth-of-field / rack focus (focus keyframes), particle occlusion by depth, auto foreground mask.
- Motion brush (Motionleap-style paths + anchors): user draws flow arrows (direction + speed) and places anchor pins and a freeze brush; build a triangulated mesh (Delaunay over arrows + pins + border), compute per-vertex velocity by inverse-distance interpolation of arrows (anchors = zero), and animate via crossfaded dual-phase displacement (two samples offset by half-period, blended with a triangle wave) to produce a perfectly seamless loop. Loop styles: forward, boomerang, circular.
- Sky segmentation + animated sky replacement library (procedural skies: storm, sunset, starry, aurora, pastel, timelapse clouds) with horizon blend feather, color-match of foreground to sky (mean/std transfer in Lab, strength 0–100%).
- Anime FX: speed lines (radial/directional), sparkles, bokeh, light rays, mask-based character blink (eyelid mask region + timing), hair sway (motion-brush region preset), breathing (subtle vertical scale on a mask region, 0.2–0.4 Hz).

### 4.5 Post-processing (ordered passes, each toggleable)
Exposure (−3…+3 EV), contrast, saturation, vibrance, temperature/tint, lift/gamma/gain (color wheels), `.cube` 3D LUT import (17/33/65 grid, validated, max 5 MB, strength 0–100%), bloom (threshold, intensity, radius), halation, chromatic aberration, film grain (size, intensity, luma-weighted, animated by seed), vignette, sharpen, 2.39:1 letterbox, Retro Tape (tracking noise, chroma bleed, head-switching band, date stamp with editable text, scanlines), CRT (curvature, scanlines, phosphor mask, glow), film (gate weave, dust/scratches, flicker), glitch (RGB split blocks, rate-limited by the flash guard), light leaks, anamorphic streaks. Grade presets: Midnight Lo-Fi, Golden Hour, Neon Night, Film Noir, Retro Tape. Before/after split slider (draggable divider). All color math in linear light; output sRGB; dithering to avoid banding.

## 5. Generative audio (Web Audio API, no external audio files required)
- Routing: per-track gain → 3-band EQ → pan (StereoPanner, or PannerNode when spatial mode is on) → bus; buses → sidechain duck → master: compressor (threshold −18 dB, ratio 3:1, attack 10 ms, release 200 ms) → convolution reverb send (generated impulse response: exponentially decaying stereo noise, length 0.5–6 s, pre-delay 0–80 ms, damping low-pass) → brickwall limiter (DynamicsCompressor ratio 20, threshold −1 dBFS, plus soft-clip WaveShaper) → master gain → analyser → destination and MediaStreamAudioDestinationNode for recording.
- Scheduler: lookahead pattern (setInterval 25 ms in a Worker-driven tick, schedule events within 100 ms horizon using `AudioContext.currentTime`). Swing 0–75%, humanize timing ±0–20 ms and velocity ±0–20%.
- Lo-fi composer: key (12) + scale (major, minor, dorian, mixolydian, lydian), BPM 60–100 (default 78), progression presets (ii–V–I, I–vi–IV–V, vi–IV–I–V, iii–vi–ii–V, i–VI–III–VII, plus seeded generator), voicings 7th/9th/11th with voice-leading minimization; FM Rhodes (2-operator FM, ratio 1:1 and 14:1 tine transient, velocity → modulation index, tremolo 4–6 Hz); synthesized drums (kick: sine pitch-sweep 150→45 Hz; snare: noise + 180 Hz tone; hats: highpassed noise; all bit-crushed optionally); bass (sine + light saturation, follows roots); melody (pentatonic, seeded motifs, density 0–100%); vinyl crackle (sparse impulse noise + 50/60 Hz hum toggle); tape wow (0.5 Hz) and flutter (8 Hz) via modulated DelayNode; muffle low-pass 400–20000 Hz; sidechain duck from kick 0–12 dB.
- Ambience: rain (pink/white noise with modulated LP/HP), rain surfaces (roof, window, umbrella filters), thunder (sub-bass oscillator 30–60 Hz + low-passed noise rumble, triggered by lightning bus events with distance delay), motorcycle idle (pulse oscillator ~ 12–16 Hz firing rate through resonant LP, single-cylinder irregularity), wind rustle (bandpass noise sweeping in stereo), city night, café murmur (formant-filtered noise bursts), crickets (AM-modulated sine chirps), distant train (Doppler pitch bend + clack rhythm), wind chimes (inharmonic partials, random strikes).
- Mixer: per-track mute/solo/volume (−60…+6 dB)/pan/3-band EQ; master meters (peak + RMS, LUFS-short estimate); spatial mode ties track pan to scene anchor x-position (headlight → engine, tree → wind).
- Custom music upload: decode audio (MP3/AAC/OGG/WAV/FLAC per browser support), trim, fade in/out, loop crossfade, BPM detection (onset autocorrelation), beat grid drives audio-reactive visuals.
- Audio-reactive visuals: AnalyserNode bands → light flicker, particle burst, camera pulse (all bounded by the flash guard).
- Autoplay/iOS: AudioContext created suspended; resume on first user gesture; detect and show "Tap to enable sound" chip; handle `interrupted` state on iOS; warn that the iOS hardware silent switch may mute Web Audio and offer a test tone.
- Deterministic offline audio: for offline export, re-render the full graph in `OfflineAudioContext` (48 kHz stereo) with the same seed and schedule.

## 6. Social reel overlay & text
- Fully editable: creator handle (default "Cinematic Sky"), verified badge toggle, avatar upload, caption (expandable; Instagram's documented caption limit of 2,200 characters, 30 hashtags and 20 @ tags), hashtags, like/comment/share/save counts (compact number formatting per locale), music marquee text (default "🎵 e you again · Antent · hope"), follow state.
- Interactions: like button heart pop + particle burst + live counter, double-tap like, follow toggle, comments drawer with seeded aesthetic comments and an "Add a comment" form (plain text only, rendered as text nodes, 500 chars max), spinning vinyl disc with floating notes synced to BPM.
- Platform skins: Reels, TikTok, Shorts, Generic; safe-zone guide overlays per platform (default to the strictest common area, 900×1400 centered on 1080×1920; show platform-specific margins, e.g., Meta's 14% top / 35% bottom / 6% sides).
- "Clean Cut" toggle (key `C`) hides all UI overlays; "Bake overlay into export" toggle (default off).
- Watermark/logo (PNG/WebP, position, opacity, scale), titles and lower thirds, animated text presets (typewriter, fade-up, glitch-in, vertical Japanese with `writing-mode: vertical-rl`), SRT/WebVTT subtitle import with styling, safe-zone-aware placement.

## 7. Timeline & keyframes
Keyframe any numeric/color parameter; easing per segment (linear, ease, cubic-bezier, step, hold); scrubbing with frame-accurate preview; event markers (lightning strikes, text in/out); loop region; duration = export duration; zoomable tracks; copy/paste keyframes; snap to beat grid.

## 8. Export pipeline
- Modes: (A) Real-time capture: `canvas.captureStream(fps)` + audio `MediaStreamAudioDestinationNode` → MediaRecorder. (B) Offline frame-perfect render (default when WebCodecs `VideoEncoder` exists): step frame clock, render each frame, wrap in `VideoFrame`, encode with `VideoEncoder`, render audio with `OfflineAudioContext`, encode with `AudioEncoder`, mux with Mediabunny. Offline mode is immune to hidden-tab throttling.
- MIME negotiation (`mimeNegotiation.ts`, pure function, unit-tested): Offline: probe `VideoEncoder.isConfigSupported` for `avc1.640028` (H.264 High), then `avc1.4D4028`, `avc1.42E028`, then `vp09.00.40.08`, `vp8`; audio `mp4a.40.2` (AAC-LC) then `opus`. Choose MP4 when H.264 + AAC are available; otherwise WebM (VP9/VP8 + Opus). AAC encoding is unavailable in Firefox and on desktop Linux (MDN), so those environments produce WebM and may offer backend MP4 transcoding. Real-time: try in order `video/mp4;codecs=avc1.640028,mp4a.40.2`, `video/mp4;codecs=avc1,mp4a.40.2`, `video/mp4`, `video/webm;codecs=vp9,opus`, `video/webm;codecs=vp8,opus`, `video/webm` via `MediaRecorder.isTypeSupported`. Chrome 126+ can record MP4 with H.264/AAC where the OS provides an encoder, Safari records MP4, Firefox records WebM only.
- WebM duration fix: MediaRecorder WebM lacks a Duration element; patch the EBML Duration using the measured clock duration before download (implement in `webmDurationFix.ts`); Mediabunny output needs no fix.
- MP4 via Mediabunny uses fast-start (moov at front) for in-memory targets.
- Settings: resolution 720p/1080p/1440p/2160p; fps 24/30/60; bitrate auto per YouTube's recommended upload encoding settings (1080p at 24–30 fps = 8 Mbps, 1080p at 48–60 fps = 12 Mbps, 2160p standard frame rate = 35–45 Mbps → use 40 Mbps, 2160p high frame rate = 53–68 Mbps → use 60 Mbps; variable bitrate; stereo audio up to 384 kbps) or manual 2–80 Mbps; keyframe interval 2 s; durations 5/10/15/30/60 s + custom 1–180 s; seamless loop export (duration snapped to the least common multiple of loop periods, capped; first and last frame identical); GIF (≤ 15 s, ≤ 720 px, palette per 2 s, dithering); PNG sequence ZIP; WAV soundtrack (16/24-bit); poster frame PNG/JPEG; filename template `{title}_{preset}_{ratio}_{res}_{fps}_{date}.{ext}` sanitized.
- UX: progress bar + ETA + cancel (AbortController), countdown for real-time capture, preview modal with 1-click "Download" and "Share" (Web Share Level 2 when `navigator.canShare({files})` is true — supported in Chrome/Edge, behind a flag in Firefox per web.dev — else download), memory guard (estimate bytes = width×height×4×queued frames; cap encoder queue at 8 frames using `encodeQueueSize` backpressure; refuse settings exceeding `navigator.deviceMemory` heuristics), keep-awake via Screen Wake Lock during export.
- Hidden-tab policy for real-time mode: listen to `visibilitychange`; on hidden, pause the recording and show a "Recording paused — tab hidden" notice (rAF stops in background tabs and Firefox throttles canvas capture to ~1 fps), or auto-switch to offline render if available.

## 9. Input, auto-crop, ratios
- Inputs: drag-drop, paste (Clipboard API), file picker, mobile camera (`capture="environment"`), URL import (only through backend proxy when configured; otherwise disabled with explanation), PWA file_handlers and share_target.
- Accept JPEG, PNG, WebP, AVIF, GIF (first frame), BMP, HEIC/HEIF; reject SVG by default (optional rasterize-in-sandbox: load via `<img>` from a Blob URL so scripts never execute, then draw to canvas). Sniff magic bytes; ignore client-declared MIME.
- Decode with `createImageBitmap(blob, { imageOrientation: 'from-image' })` so EXIF orientation is applied; HEIC: try native `createImageBitmap` (Safari 17+), else lazy libheif WASM in a worker.
- Smart auto-crop (status bar / nav bar removal): analyze top 0–12% and bottom 0–15% rows; compute per-row luminance variance and edge density; detect uniform bands (variance < threshold) and high-contrast icon rows (status-bar glyph signature: small high-contrast blobs at left/right ends); also detect the home indicator pill; crop boundaries snap to detected band edges; show a preview with adjustable handles and confidence score; never crop more than 20% total automatically.
- Manual crop with focal point; ratio mismatch handling: cover (crop to focal point), blur-fill (blurred, darkened, scaled background), or letterbox (solid/gradient).
- Ratios: 9:16, 16:9, 1:1, 4:5, 3:4, 2:3, 2.39:1, 21:9, custom (0.25–4.0).

## 10. Presets, projects, storage
- 12 built-in presets with complete parameter sets (one file each): Midnight Solitude, Thunder & Downpour, Golden Hour Memory, Neon Alley Rain, Magnetic Tape '95, Sakura Dusk Drift, First Snow Platform, Firefly Summer Field, Misty Dawn Pass, Aurora Overpass, Rooftop Starfall, Ember Festival Night. Names are original; do not use studio, game, or brand trademarks.
- Custom preset CRUD, favorites, tags, auto-thumbnails (render 256 px poster in worker), randomize with seed (constrained ranges), "Surprise me".
- Project JSON import/export: versioned zod schema (`schemaVersion`), migrations, strict parsing (unknown keys stripped, numbers clamped, strings length-limited, max 2 MB).
- Share-via-URL: compressed state (deflate via fflate + base64url) in the URL fragment (never sent to servers); max 8,000 chars; if larger, offer backend share link or JSON file.
- Undo/redo (command pattern, 200 steps, coalesce slider drags), IndexedDB autosave (debounced 1.5 s, versioned snapshots ×10), storage usage panel via `navigator.storage.estimate()`, `navigator.storage.persist()` request, QuotaExceededError handling (evict oldest thumbnails/snapshots, then prompt).
- Multi-image slideshow with transitions (crossfade, dip-to-black, wipe, zoom-through, depth-dissolve) and batch export (queue, sequential, resumable).

## 11. AI Prompt Modal
- Tabs: Image, Video, Music. Each card shows a tool name, the version current as of October 2026, a copy button, and a prompt auto-generated from the current scene (preset mood, weather, lighting, palette, camera, ratio, duration, BPM, key).
- Image: Midjourney V8.2 (default model since July 24, 2026; use `--ar`, `--stylize`, `--raw`, `--chaos`, `--weird`, `--exp`, `--sref`, `--hd`/`--sd`; do not emit `--q`, which V8.1/V8.2 do not support, or `--cref`, which is V6-only), Niji 7 for anime (`--niji 7`), plus a generic prompt for any image model.
- Video: Kling 3.0 (multi-shot, 3–15 s), Google Veo 3.1 (first/last-frame control, native audio), Runway Gen-4.5, MiniMax H3, PixVerse V6, Pika 2.5; each template includes image-to-video instructions, camera move, motion intensity, duration, aspect ratio, negative prompt. Sora is excluded because OpenAI shut down the Sora 2 API on September 24, 2026.
- Music: Suno v6 (style prompt + structure tags + "instrumental" flag; v6-mini available to free users), generic lo-fi prompt for other tools; derived BPM/key/instrumentation from the composer.
- Store the tool/version catalog in `promptTemplates.ts` as data with a `lastVerified` date so it can be updated without code changes; optional "Enhance with AI" calls the backend LLM proxy (never client-side keys).

## 12. Settings (dedicated panel, persisted, reset per section, search box)
Performance: renderer (auto/WebGPU/WebGL2/Canvas2D), render scale, DPR cap, max FPS, particle cap, adaptive quality, worker rendering, FPS/perf overlay. Audio: start muted, latency hint (interactive/balanced/playback), limiter on/off, master volume, sample rate preference, spatial audio. Export defaults: mode, container preference, resolution, fps, bitrate, duration, bake overlay, filename template, include audio. Accessibility: reduced motion (system/on/off), photosensitive safe mode, high contrast, font scale 87.5–200%, captions for generated audio events, remappable shortcuts, screen-reader announcements, focus ring style. UI: theme (system/dark/light/OLED black), language, RTL auto, layout (sidebar/bottom sheet), compact mobile mode, haptics, tooltips. Privacy/Storage: local-only mode (disables every network call incl. ML model download and backend), storage usage, persist storage, clear thumbnails/projects/all data, export all data. ML: enable depth, enable segmentation, model precision (auto/quantized/fp16/fp32), cached model size, delete models. Developer: seed, debug overlay (anchors, masks, depth view, particle counts, GPU timings), log level.

## 13. Accessibility, i18n, PWA, input
- WCAG 2.2 AA for UI: keyboard operable everything, visible focus, ARIA labels for icon buttons, sliders expose `aria-valuetext` with units, contrast ≥ 4.5:1, live region announcements for recording state.
- Respect `prefers-reduced-motion` (disable camera shake, reduce particle speed, Safe Mode on), `prefers-contrast`, `prefers-color-scheme`.
- Keyboard shortcuts (remappable): Space play/pause, R record, C clean cut, L lightning strike, M mute, Ctrl/Cmd+Z / Shift+Z undo/redo, 1–9 presets, F fullscreen, ? shortcut sheet.
- i18n with ICU plurals and locale number formats; RTL mirroring via logical CSS properties; Japanese vertical text option.
- PWA: offline app shell, precache engine and built-in assets, runtime cache for ML models (opt-in), `file_handlers` for images, `share_target` for incoming images, install prompt.
- Haptics: `navigator.vibrate` (where supported) on like, record start/stop, preset change; toggle in Settings.

## 14. Optional backend (separate `backend/` package; the frontend must work without it)
Node.js 20+ LTS, Express, TypeScript, Prisma + PostgreSQL, Redis, BullMQ, FFmpeg. Folder structure mirrors the standard Express layout exactly:
```
backend/
  node_modules/                 → installed packages (git-ignored)
  prisma/schema.prisma          → DB schema (User, Session, Project, Preset, PresetLike, Share, Comment, Upload, RenderJob, AuditLog)
  src/
    config/                     → env.ts (zod-validated env), db.ts (Prisma client), s3.ts, logger.ts, cors.ts
    controllers/                → auth, projects, presets, gallery, comments, uploads, renders, shares, ai, importUrl, health
    middlewares/                → helmet/CSP, cors allowlist, rateLimit (Redis store), validate (zod), auth, requestId, httpLogger (pino), errorHandler, bodyLimits, idempotency
    models/                     → zod DTOs + Prisma repository wrappers (one file per entity)
    routes/                     → one router per resource, mounted under /api/v1
    services/                   → business logic: authService, tokenService, projectService, presetService, galleryService, commentService, uploadService (presign + verify), renderService (queue + worker + ffmpeg), shareService, llmService, urlImportService (SSRF guard), sanitizer
    utils/                      → asyncHandler, httpErrors, pagination, crypto, magicBytes, exifStrip, safeFilename
    redis/                      → client.ts, rateLimitStore.ts, cache.ts, queue.ts (BullMQ connection)
  app.ts                        → configure Express app + middleware chain
  server.ts                     → start HTTP server, graceful shutdown (SIGTERM drains queue + closes DB/Redis)
  .env.example                  → variable names only, no real secrets
  .gitignore                    → node_modules, .env, dist, coverage
  package.json                  → scripts: dev, build, start, worker, migrate, test, lint
  README.md                     → setup, env vars, endpoint table, deployment
```
Request flow: Client → Route → Middleware → Controller → Service → Model/Database → Response.

Endpoints (`/api/v1`, JSON, zod-validated):
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | /health | none | liveness + DB/Redis readiness |
| POST | /auth/register | none | email + password (argon2id) |
| POST | /auth/login | none | sets httpOnly access (15 min) + refresh (30 d) cookies |
| POST | /auth/refresh | refresh cookie | rotation with reuse detection (revoke family) |
| POST | /auth/logout | user | revoke refresh family, clear cookies |
| GET | /me | user | profile |
| GET/POST | /projects | user | list (cursor pagination) / create |
| GET/PATCH/DELETE | /projects/:id | owner | read/update (If-Match version)/delete |
| GET/POST | /presets | user | own presets |
| PATCH/DELETE | /presets/:id | owner | update/delete |
| GET | /gallery/presets | none | public presets (sort: new/top, cursor) |
| POST/DELETE | /gallery/presets/:id/like | user | idempotent like/unlike |
| POST | /uploads/presign | user | presigned S3/R2 PUT (content-length + type conditions) |
| POST | /uploads/:id/complete | owner | server verifies magic bytes, size, strips EXIF, re-encodes |
| POST | /renders | user | enqueue WebM→MP4 H.264/AAC `-movflags +faststart` (Idempotency-Key required) |
| GET | /renders/:id | owner | status/progress; signed download URL (10 min) when done |
| POST | /shares | user | create share link for a project/render |
| GET | /shares/:slug | none | resolve share |
| GET/POST | /shares/:slug/comments | none / user | list / add comment (plain text, 500 chars) |
| DELETE | /comments/:id | owner/admin | delete |
| POST | /ai/prompts | user | LLM proxy, server-side key, per-user quota |
| POST | /import/url | user | fetch remote image with SSRF guard |

Middleware order in app.ts: requestId → pino-http → helmet (strict CSP, HSTS, frameguard deny, noSniff, referrer no-referrer) → CORS allowlist with credentials → body limits (JSON 100 kB, raw upload routes disabled since uploads go direct to storage) → cookie parser → rate limit (Redis; global 300 req/15 min/IP, auth 10/15 min/IP+email, AI 30/hour/user, renders 20/day/user) → routes (validate → auth → controller) → 404 → centralized error handler (maps AppError to status, returns `{error:{code,message,requestId}}`, never stack traces in production).
Cookies: `HttpOnly; Secure; SameSite=Lax` (access) and `SameSite=Strict; Path=/api/v1/auth` (refresh); CSRF protection via double-submit token header on state-changing routes. Every resource query includes `ownerId` (no IDOR). Builder backends: if the builder provides Supabase, map projects/presets/comments to tables with Row Level Security (`auth.uid() = owner_id`), uploads to Supabase Storage signed URLs, and the LLM proxy and render worker to Edge Functions; on Base44, map entities to Base44 entities with owner-only permissions and use its integrations for LLM calls. The client API layer (`src/api/`) is an adapter interface so either backend can be swapped.

## 15. Hardening (implement every remediation; add a test for each)
| Risk | Remediation |
|---|---|
| Malformed/huge/corrupt images | Max 50 MB file, max 40 MP decoded (check header dims before full decode where possible), decode in worker with timeout 15 s, catch decode errors → typed error toast |
| SVG XSS | SVG rejected by default; optional rasterize via `<img>` Blob URL only; never inline SVG markup; CSP `script-src 'self'` |
| Decompression bombs | Pixel-count cap from header parse before decode; ZIP imports (preset packs) cap entries 200 and total uncompressed 50 MB, streaming check |
| HEIC/EXIF orientation | `imageOrientation: 'from-image'`; HEIC native probe then WASM; strip EXIF on any re-export |
| Object-URL leaks | Central `ObjectUrlRegistry` with revoke on replace/unmount/download complete |
| rAF/audio-node/listener leaks | Every engine class implements `dispose()`; React effects return cleanup; AbortController for listeners; `ImageBitmap.close()`; disconnect audio nodes; leak test mounts/unmounts 50× and checks counts |
| WebGL/WebGPU context loss | Restore path (§3.2) with resource re-upload |
| AudioContext suspended / iOS silent | Resume on gesture; state chip; test tone; handle `interrupted` |
| Unsupported MediaRecorder MIME | Negotiation chain; if none, offline mode; if neither, PNG sequence + WAV |
| Double start/stop races | Recording finite-state machine (idle→arming→recording→finalizing→done/error); transitions guarded; buttons disabled during transitions |
| Preset switch during recording | Locked or queued until finalize (setting: lock/queue) |
| Image-decode races | Request token + AbortController; only the latest decode commits |
| Hidden-tab throttling | Pause + notice or offline render |
| Low memory on long 4K renders | Pre-flight estimate, encoder backpressure, streamed muxing to File System Access writable (Chromium) or chunked Blob parts, abort on `memory` pressure heuristics |
| IndexedDB quota exceeded | Catch QuotaExceededError → evict caches → prompt export |
| Corrupted/malicious preset JSON | zod strict parse, clamp, size cap 2 MB, prototype-pollution guard (reject `__proto__`, `constructor`, `prototype` keys) |
| Oversized share URLs | 8,000-char cap → backend link or file |
| XSS in comments/captions | Text nodes only; no `dangerouslySetInnerHTML`; server-side sanitize + length caps; CSP |
| Flash safety | Flash limiter (§4.2) across lightning, glitch, audio-reactive |
| Network dropouts | Offline queue in IndexedDB; retry with exponential backoff + full jitter (base 500 ms, cap 30 s, 6 tries); idempotency keys on POST |
| Backend auth bypass | Auth middleware on every non-public route; route-level test asserting 401 |
| IDOR | Owner scoping in every repository query; tests with two users |
| Rate-limit evasion | Redis store keyed by IP + user + route; trust proxy configured exactly; normalized emails |
| SSRF (URL import) | https only; resolve DNS once and pin; block private/loopback/link-local/metadata ranges (IPv4+IPv6, incl. 169.254.169.254); no redirects beyond 3, each re-validated; 10 MB/10 s caps; image magic-byte check |
| Path traversal | Server generates storage keys (UUID); never use client filenames for paths; `safeFilename` for downloads |
| Secret leakage | `.env.example` only; zod-validated env; no secrets in client bundle; pino redaction of cookies/authorization |
| Boundary values | 0%/100% intensity, zero/negative/NaN durations, extreme ratios (0.25, 4.0), 0-byte files, 1×1 images, 16384-px images all tested |

## 16. Testing & acceptance
- Vitest unit: auto-crop detector (fixtures of iOS/Android screenshots with known crop lines, ±4 px), PRNG determinism, zod schemas + migrations, MIME negotiation (mocked support matrices for Chrome/Safari/Firefox/Linux), color math (sRGB↔linear round-trip error < 1e-4, LUT trilinear), flash limiter, keyframe interpolation, scheduler timing, filename sanitizer, SSRF guard.
- Playwright e2e (Chromium, WebKit, Firefox): upload → preset → record 5 s → download file exists, non-zero, correct container signature; offline render path; PWA offline reload; keyboard-only flow; reduced-motion flow.
- Performance: 60 fps at 1080×1920 preview on mid-range Android with adaptive quality; offline 1080p30 10 s export completes ≤ 60 s on a 2022 laptop.
- Cross-browser matrix with documented fallbacks (WebGPU/WebGL2/Canvas2D; MP4/WebM; WebCodecs/MediaRecorder; HEIC native/WASM; Share/download).
- Acceptance criteria per module are listed in the module prompts; every criterion must pass before the build is complete.
````

---

## FILE: 01-architecture-folder-structure.md

````markdown
# Phase 01 — Architecture & folder structure: "Cinematic Sky — Anime Photo to Video Animator"

Context: A React + TypeScript + Tailwind + Lucide PWA that animates a still anime image/photo into a cinematic video loop with procedural effects, generative Web Audio, a reel overlay, and client-side export. The engine runs entirely in the browser; an optional backend comes in Phase 14. This phase creates the skeleton every later phase plugs into. Deliver complete, verified production code with no placeholders or TODOs, one concern per file, explanations only as inline comments.

Requirements:
1. Scaffold Vite + React 18+ + TypeScript strict (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`), Tailwind, Lucide React, Zustand (`subscribeWithSelector`, `persist`), zod, i18next, Vitest, Playwright, vite-plugin-pwa. Pin exact versions.
2. Create the full folder tree: `public/` (manifest, icons), `src/config` (constants.ts, featureDetect.ts, env.ts), `src/core` (eventBus.ts, clock.ts, rng.ts, pool.ts, commands.ts, errors.ts), `src/pipeline/{input,sanitize,analyze,scene,render,fx,postfx,compositor,capture,mux,deliver}`, `src/audio/{instruments,ambience,fx,composer,analysis}`, `src/timeline`, `src/presets/{builtin}`, `src/storage`, `src/settings`, `src/ai`, `src/api`, `src/i18n/locales`, `src/store/slices`, `src/ui/{components,panels,hooks,styles}`, `src/workers`, `src/types`, `tests/{unit,e2e,fixtures}`.
3. Implement now: `eventBus.ts` (typed `EventBus<EventMap>` with on/off/once/emit, returns unsubscribe, no memory leaks), `rng.ts` (mulberry32 + sfc32, `fork(salt)`, 2D/3D simplex noise), `pool.ts` (typed-array struct-of-arrays pool with free list), `clock.ts` (interface `Clock { now(): number }` with `AudioClock` and `FrameClock(fps)`), `commands.ts` (Command interface, undo/redo stacks capped at 200, coalescing by key within 500 ms), `errors.ts` (AppError with `code`, `userMessage`, `cause`), `featureDetect.ts` (async probes for WebGPU adapter, WebGL2, OffscreenCanvas transfer, WebCodecs VideoEncoder/AudioEncoder, MediaRecorder types, HEIC native decode via tiny embedded sample, Web Share files, File System Access, storage estimate; cached result object).
4. Store: root store composed from slices (scene, fx, audio, overlay, export, timeline, settings, ui, history); export narrow selector hooks; expose `getEngineSnapshot()` returning a frozen view read by the render loop via ref (no per-frame React renders).
5. Pipeline contract (`src/types/pipeline.ts`): Input → Sanitize/Decode → Analyze → Scene Graph → Render → PostFX → Compositor → Capture/Encode → Mux → Deliver; each stage a typed interface with `AbortSignal` support and request tokens.
6. App shell: responsive layout (desktop sidebar + canvas; mobile bottom sheet + full-bleed canvas), error boundary with recovery, lazy panel loading, toast system, `?` shortcut sheet stub wired to a real shortcut registry.

Acceptance criteria:
- `npm run dev`, `npm run build`, `npm run test`, `npm run e2e` all succeed with zero type errors and zero lint errors.
- EventBus, RNG (same seed → identical 10,000-value sequence), pool, and command undo/redo have passing unit tests.
- Feature detection returns a complete typed object on Chromium, WebKit, and Firefox in Playwright.
- No React component re-renders when the engine snapshot is read 60×/s (verified with React Profiler test).
````

## FILE: 02-render-engine-core.md

````markdown
# Phase 02 — Render engine core

Context: Cinematic Sky animates a still image into a video loop. Phase 01 built the skeleton (event bus, seeded RNG, pools, clocks, Zustand store with a render snapshot ref). This phase builds the renderer every effect uses. Deliver complete, verified production code, one concern per file, no placeholders.

Requirements:
1. `renderer.ts`: backend-agnostic `Renderer` interface (init, resize, uploadTexture, drawLayer, runPass, readPixels, dispose) with three implementations in `backends/webgpu.ts`, `backends/webgl2.ts`, `backends/canvas2d.ts`. Auto order WebGPU → WebGL2 → Canvas2D (WebGPU ships in Chrome 113+, Android Chrome 121+, Firefox 141+ Windows / 145+ Apple-silicon macOS, Safari 26; Linux/Android Firefox incomplete, so WebGL2 fallback is mandatory). Canvas2D = "Compatibility mode": background, particles, basic grade only.
2. `renderWorker.ts`: if `transferControlToOffscreen` exists, run the loop in a worker with OffscreenCanvas; message protocol typed with zod-validated payloads; transfer ImageBitmaps; fall back to main thread.
3. Resolution model: preview size = CSS size × min(DPR, DPR cap default 2) × render scale (0.5–1.0, default auto); export resolution independent (720p/1080p/1440p/2160p). Source images downscaled once to ≤ 4096 px long edge (setting 2048–8192).
4. Frame loop: rAF, fixed 60 Hz simulation step with interpolation, max FPS cap (30/60/120/display). Zero allocations per frame (verify with a heap test).
5. `adaptiveQuality.ts`: rolling 60-frame average; step down when > budget×1.15 for 1 s (particles −20% → postFX quality → render scale −0.1, floor 0.5); step up after 5 s < budget×0.8; emits `quality:changed`.
6. Context loss: handle `webglcontextlost/restored` and `GPUDevice.lost`; rebuild pipeline; re-upload textures from retained ImageBitmaps; after 3 losses/60 s drop a tier and toast.
7. `sceneGraph.ts`: ordered layers (background, depth-parallax background, back particles, lights, mid particles, foreground occluder, front particles, lens FX), each with blend mode and opacity.
8. `proceduralFallback.ts`: never-blank procedural anime night scene (gradient sky, moon + glow, parallax hills, wet road, tree silhouette, motorcycle silhouette with headlight anchor) rendered when no image is loaded or loading fails.
9. Perf overlay component: FPS, frame ms (CPU/GPU where timestamp queries exist), particle count, backend, render scale.

Acceptance criteria:
- Same scene renders on WebGPU and WebGL2 with SSIM ≥ 0.98 (Playwright screenshot test).
- Canvas never blank: fallback scene appears within 300 ms of first paint with no image.
- Forced context loss (WEBGL_lose_context) recovers without reload.
- 60 fps at 1080×1920 preview on a mid-range Android profile with adaptive quality on; ≤ 8 ms main-thread per frame in worker mode.
````

## FILE: 03-weather-particles.md

````markdown
# Phase 03 — Weather & particle systems

Context: Cinematic Sky (React/TS PWA) animates a still image into a cinematic loop. Phase 02 provides the renderer, layers, seeded RNG, pooled typed-array particles, and adaptive quality. Effects must work on any image via Scene Anchors (ground plane, horizon, puddle zones, foliage regions, sky mask, occlusion mask — built in Phase 12; read them from the scene graph and use sensible defaults when absent). Deliver complete production code, one system per file, no placeholders.

Requirements (every parameter has range, default, unit, and is keyframeable):
1. Rain (`weather/rain.ts`): 3 depth layers (far/mid/near) with speed, streak length, opacity; intensity 0–100% (default 60); wind −100…100 (default 15) → angle up to 35°; motion-blurred streaks; ground splashes on the ground plane; occluded by the foreground mask.
2. Lens droplets (`weather/lensDroplets.ts`): density 0–100% (default 20); refraction by sampling the background through a per-droplet normal; slide trails with gravity and merge.
3. Puddle ripples (`weather/ripples.ts`): concentric rings, growth 40–200 px/s (default 90), lifetime 0.4–1.6 s (default 0.9), alpha fade, max 512 pooled, spawned only inside puddle zones or below horizon, spawn rate tied to rain intensity.
4. Wet-road reflections (`weather/wetReflections.ts`): mirrored, blurred, vertically streaked speculars of each light anchor on the ground plane; wetness 0–100%.
5. Additional systems, one file each: snow (size, turbulence, accumulation tint), hail (bounce on ground plane), fog/mist (2-octave scrolling noise, density, height falloff, depth-weighted when depth exists), fireflies (blink rate, glow, wander), sakura petals (3D tumble projected), autumn leaves (from foliage regions, flutter), embers (rising additive), dust motes (bokeh), god rays (radial blur from a light anchor), rainbow (arc, opacity), heat haze (screen-space distortion below horizon), shooting stars (per minute), aurora (curtain noise, hue range), stars (density, twinkle).
6. Moon & clouds (`weather/moonClouds.ts`): phase 0–1 (default 0.85), draggable position, glow radius, halo toggle; 3-layer procedural clouds (coverage, speed, darkness) that periodically veil the moon — moon glow multiplied by cloud density sampled at the moon position.
7. Global particle budget shared across systems; setting 1k–50k (default by device tier: low 4k, mid 12k, high 30k).
8. Seamless-loop support: every system exposes `periodSeconds` or a loop-safe mode (spawn schedule derived from `t mod period` with seeded RNG) so the first and last export frames match.

Acceptance criteria:
- 0% intensity spawns zero particles and allocates nothing; 100% stays within budget and frame target via adaptive quality.
- Same seed + time renders identical frames (pixel hash test).
- Ripples never appear above the horizon or outside puddle zones when zones exist.
- Particles are hidden behind the occlusion mask in a fixture scene.
````

## FILE: 04-lighting-lightning-camera.md

````markdown
# Phase 04 — Lighting, lightning, camera

Context: Cinematic Sky (React/TS PWA) animates stills into cinematic loops. Renderer, particles, event bus, master clock, and Scene Anchors (light sources, horizon, sky mask) exist. Deliver complete production code, one concern per file, no placeholders.

Requirements:
1. Light sources (`lighting/lights.ts`): point/spot/headlight types from anchors; color temperature 1800–12000 K (Kelvin→RGB conversion), intensity 0–200%, cone angle 5–90°; flicker types none / vintage electrical (noise, 0–30% amplitude) / candle / neon buzz; volumetric cone beam over the wet road; radial flare; optional anamorphic streak.
2. Lightning (`lighting/lightning.ts`): procedural branching bolts (midpoint displacement, 3–6 generations, branch probability 0.3, seeded), drawn inside the sky mask; sky flash + scene relight; frequency 0–12/min (default 2); distance 0.5–15 km; emits `lightning:strike {t, distanceKm, intensity}` so audio schedules thunder after `distanceKm / 0.343` s (speed of sound ≈ 343 m/s in dry air at 20 °C, about 3 s per km; 331.3 m/s at 0 °C if a temperature input is added); manual "Strike" button and `L` key; timeline markers.
3. Flash limiter (`lighting/flashGuard.ts`, shared by lightning, glitch, audio-reactive): enforce WCAG 2.3.1 — never more than 3 flashes in any rolling 1000 ms window and no saturated-red flashes. Photosensitive Safe Mode: ≤ 1 flash per 2 s, ≥ 300 ms ramps, frame-mean relative-luminance change < 0.1. `prefers-reduced-motion` turns Safe Mode on by default. Unit-test with synthetic sequences.
4. Camera (`camera/*.ts`): Ken Burns path editor (start/end rectangles drawn on the image, easing linear/easeInOutSine/easeInOutCubic/custom bezier, duration = loop length); modes breathing drift, slow zoom in/out, pan H/V, orbit (depth), dolly zoom (depth), Perlin handheld shake (0–20 px, 0.1–3 Hz), audio-reactive pulse. Camera transform loops seamlessly in loop mode.
5. All parameters keyframeable via the timeline interface (Phase 09).

Acceptance criteria:
- Lightning-to-thunder delay matches distance within ±20 ms (event timestamps test).
- Flash guard test: a 10 Hz trigger stream yields ≤ 3 flashes per second; Safe Mode yields ≤ 1 per 2 s.
- Ken Burns start/end rectangles reproduce exactly at t=0 and t=duration.
- Shake disabled when reduced motion is active.
````

## FILE: 05-postfx-color-grading.md

````markdown
# Phase 05 — Post-processing & color grading

Context: Cinematic Sky renders scenes through WebGPU/WebGL2 (Canvas2D reduced). This phase adds the ordered post-processing stack. Deliver complete production code, one pass per file, shader parity between WebGPU (WGSL) and WebGL2 (GLSL ES 3.0), no placeholders.

Requirements:
1. Linear-light pipeline: decode sRGB → linear, grade, encode sRGB, blue-noise dithering. `colorMath.ts` with tested sRGB/linear, Kelvin→RGB, RGB↔Lab, luminance.
2. Passes (toggle + strength each): exposure −3…+3 EV, contrast, saturation, vibrance, temperature/tint, lift/gamma/gain wheels, `.cube` LUT import (17/33/65, header validated, size ≤ 5 MB, malformed lines rejected, strength 0–100%, trilinear 3D texture), bloom (threshold, intensity, radius, dual-filter downsample), halation, chromatic aberration, film grain (size, intensity, luma-weighted, seeded per frame), vignette, sharpen, 2.39:1 letterbox, Retro Tape (tracking noise, chroma bleed, head-switching band, editable date stamp, scanlines), CRT (curvature, scanlines, phosphor mask, glow), film (gate weave, dust/scratches, flicker), glitch (RGB block split, gated by flash guard), light leaks, anamorphic streaks.
3. Grade presets: Midnight Lo-Fi, Golden Hour, Neon Night, Film Noir, Retro Tape (with scanlines). Each a full parameter set in its own file.
4. Before/after split slider: draggable divider (pointer + keyboard), orientation toggle.
5. Quality tiers for adaptive quality (bloom mip count, grain resolution).

Acceptance criteria:
- sRGB↔linear round-trip error < 1e-4; LUT identity file produces identical output (SSIM ≥ 0.999).
- Malformed `.cube` files produce a typed error, never a crash.
- WebGPU vs WebGL2 output SSIM ≥ 0.98 for every grade preset.
- Glitch and flicker passes respect the flash guard.
````

## FILE: 06-depth-parallax-motion-brush-sky.md

````markdown
# Phase 06 — Depth, 2.5D parallax, motion brush, sky replacement, anime FX

Context: Cinematic Sky (React/TS PWA) animates stills. This phase adds optional ML analysis and mesh-warp animation. All ML is opt-in, lazy-loaded, runs in `analyze.worker.ts`, cached in Cache Storage, and disabled in local-only mode. Deliver complete production code, no placeholders.

Requirements:
1. Depth (`analyze/depthEstimator.ts`): Depth Anything V2 Small via @huggingface/transformers (`depth-estimation` pipeline, ONNX), device `webgpu` with `wasm` fallback. Variant: quantized (~26 MB) on mobile/WASM, fp16 (~47 MB) on WebGPU desktops, fp32 (~94 MB) optional. Only the Small variant is Apache-2.0 — never load larger variants. Show size + consent dialog before download; progress; cancel. Input 518 px; upscale with joint bilateral filter guided by the image; store normalized Float16/Uint16 depth per project.
2. Segmentation (`analyze/skySegmenter.ts`): MediaPipe Tasks Image Segmenter with DeepLab-V3 (257×257, general purpose) for sky/background, SelfieSegmenter (256×256, ~447 KB) for people; combine with depth threshold + top-region color heuristic for the sky mask; refine edges with guided filter.
3. 2.5D uses: parallax displacement (strength 0–100%, focus depth), disocclusion fill via mirrored stretch, depth fog, depth-of-field + rack-focus keyframes, particle occlusion by depth, auto foreground mask.
4. Motion brush (`fx/motionBrush/*.ts`): flow arrows (direction + speed), anchor pins, freeze brush; Delaunay mesh over arrows + pins + border samples; per-vertex velocity by inverse-distance weighting (anchors/freeze = 0); seamless loop via dual-phase displacement (two samples offset by half period, triangle-wave crossfade); loop styles forward/boomerang/circular; speed 0–200%.
5. Sky replacement library (procedural skies: storm, sunset, starry, aurora, pastel, timelapse clouds), horizon feather, foreground color match (Lab mean/std transfer, 0–100%).
6. Anime FX: speed lines, sparkles, bokeh, light rays, mask-based blink (eyelid region + interval 2–6 s), hair sway (motion-brush preset), breathing (0.2–0.4 Hz scale on mask region).

Acceptance criteria:
- App fully usable with ML disabled; enabling downloads only after consent; second load uses cache.
- Motion-brush export: first and last frames identical (pixel hash) in loop mode.
- Anchored pixels move < 0.5 px.
- Analysis never blocks the main thread (> 50 ms long tasks = fail).
````

## FILE: 07-generative-audio.md

````markdown
# Phase 07 — Generative audio engine (Web Audio API)

Context: Cinematic Sky generates its entire soundtrack in the browser, no audio files required. The audio clock (`AudioContext.currentTime`) is the master clock for live preview; the event bus delivers `lightning:strike` and emits `beat`. Deliver complete production code, one instrument/effect per file, no placeholders.

Requirements:
1. Engine (`audio/engine.ts`): create AudioContext suspended with configurable `latencyHint`; resume on first user gesture; "Tap to enable sound" chip; handle `suspended`/`interrupted` (iOS) states; test tone button; warn that the iOS silent switch can mute Web Audio.
2. Routing: track gain → 3-band EQ (lowshelf 200 Hz, peaking 1.5 kHz, highshelf 6 kHz) → pan (StereoPanner or PannerNode in spatial mode) → buses → sidechain duck → master compressor (−18 dB, 3:1, 10/200 ms) → reverb send (ConvolverNode with generated IR: decaying stereo noise 0.5–6 s, pre-delay 0–80 ms, damping LP) → limiter (ratio 20, −1 dBFS + soft-clip WaveShaper) → master gain → AnalyserNode → destination + MediaStreamAudioDestinationNode.
3. Scheduler: lookahead (25 ms tick from a Worker timer, 100 ms horizon); swing 0–75%; humanize timing ±0–20 ms, velocity ±0–20%.
4. Composer: key, scale (major/minor/dorian/mixolydian/lydian), BPM 60–100 (default 78), progression presets (ii–V–I, I–vi–IV–V, vi–IV–I–V, iii–vi–ii–V, i–VI–III–VII) + seeded generator; 7th/9th/11th voicings with voice-leading minimization.
5. Instruments: FM Rhodes (2-op FM, 1:1 body + 14:1 tine transient, velocity→index, tremolo 4–6 Hz); drums (kick sine sweep 150→45 Hz, snare noise + 180 Hz tone, hats HP noise, optional bitcrush); bass (sine + saturation following roots); melody (pentatonic seeded motifs, density); vinyl crackle (+ 50/60 Hz hum toggle); tape wow 0.5 Hz / flutter 8 Hz via modulated DelayNode; muffle LP 400–20000 Hz; kick sidechain 0–12 dB.
6. Ambience: rain (pink/white noise, modulated LP/HP; surfaces roof/window/umbrella), thunder (30–60 Hz sub oscillator + LP noise rumble, delayed by distance at ≈ 343 m/s, about 3 s per km; LP cutoff by distance), motorcycle idle (pulse 12–16 Hz firing via resonant LP with cycle irregularity), wind rustle (stereo-sweeping bandpass noise), city night, café murmur, crickets, distant train (Doppler + clacks), wind chimes (inharmonic partials).
7. Mixer UI: per-track mute/solo/volume (−60…+6 dB)/pan/EQ; master peak + RMS meters; master play/pause, mute.
8. Custom music upload: decode, trim, fade, loop crossfade, BPM detection (onset autocorrelation); beat grid drives audio-reactive visuals (AnalyserNode bands → light flicker, particle bursts, camera pulse, all via flash guard).
9. `audio/offline.ts`: rebuild the identical graph in OfflineAudioContext (48 kHz stereo) with the same seed/schedule for frame-perfect export.

Acceptance criteria:
- No audio before a user gesture; resumes correctly after iOS interruption.
- Offline render of the same project twice produces bit-identical PCM.
- Master output never exceeds −1 dBFS true-peak estimate in a stress test with all tracks at +6 dB.
- Thunder follows lightning by `distanceKm / 0.343` s ±20 ms.
- Unmounting disposes every node (node count returns to baseline).
````

## FILE: 08-reel-overlay-text.md

````markdown
# Phase 08 — Social reel overlay, text, subtitles

Context: Cinematic Sky shows a realistic mobile reel overlay over the animated canvas and can bake it into exports. Deliver complete production code, one component per file, no placeholders, no `dangerouslySetInnerHTML`.

Requirements:
1. Editable fields (overlay slice, persisted): handle (default "Cinematic Sky"), verified toggle, avatar upload (sanitized image pipeline), caption (expandable; Instagram's documented limit of 2,200 characters, 30 hashtags and 20 @ tags, enforced with a live counter), hashtags, like/comment/share/save counts (locale compact format), music marquee (default "🎵 e you again · Antent · hope"), follow state.
2. Interactions: like heart pop + burst + live counter, double-tap like, follow toggle, comments drawer with seeded aesthetic comments and "Add a comment" form (plain text, ≤ 500 chars, rendered as text nodes), spinning vinyl synced to BPM with floating notes.
3. Platform skins: Reels, TikTok, Shorts, Generic. Safe-zone guide overlays: strictest common area 900×1400 centered in 1080×1920 by default; platform presets (e.g., Meta 14% top / 35% bottom / 6% sides; Shorts 10% top / 25% bottom / 10% right). Sources disagree; store margins as editable data.
4. "Clean Cut" toggle (key C) hides all overlays; "Bake overlay into export" toggle; compositor draws the overlay into the export canvas at export resolution (vector-crisp text).
5. Watermark/logo (position grid, opacity, scale), titles and lower thirds, animated text presets (typewriter, fade-up, glitch-in gated by flash guard, vertical Japanese via `writing-mode: vertical-rl`), SRT/WebVTT import (parsed safely, ≤ 1 MB, cue timing validated) with styling.

Acceptance criteria:
- Script-like input in caption/comments renders literally (XSS test).
- Baked export pixels match on-screen overlay layout within 2 px at 1080×1920.
- Clean Cut hides 100% of overlay DOM and canvas layers.
- All controls keyboard operable with ARIA labels.
````

## FILE: 09-timeline-keyframes.md

````markdown
# Phase 09 — Timeline & keyframes

Context: Cinematic Sky parameters (weather, light, camera, grade, audio mix) must be animatable over the export duration. Deliver complete production code, no placeholders.

Requirements:
1. Data model (`timeline/keyframes.ts`): tracks keyed by parameter path (typed union of animatable params), keyframes `{t, value, easing}`; numeric, color (interpolate in OKLab), boolean (step).
2. Easing (`easing.ts`): linear, ease-in/out/in-out (sine, cubic, expo), cubic-bezier (Newton-Raphson solver), step, hold.
3. Evaluation (`interpolate.ts`): binary search per track, cached per frame, zero allocations; engine reads evaluated values each frame.
4. Markers (`markers.ts`): lightning strikes, text in/out, custom labels; loop region in/out; snap to beat grid from the composer.
5. UI (`TimelinePanel`): zoomable tracks, scrubbing with frame-accurate preview, add/move/delete keyframes, copy/paste, multi-select, undo/redo via command pattern, keyboard nudging.

Acceptance criteria:
- Interpolation unit tests for every easing at boundaries (t=0, t=1) and midpoints.
- Scrubbing to frame N shows the same pixels as offline render frame N.
- 1,000 keyframes across 50 tracks evaluate in < 0.5 ms per frame.
````

## FILE: 10-export-pipeline.md

````markdown
# Phase 10 — Export pipeline (real-time + offline frame-perfect)

Context: Cinematic Sky exports the animated scene with its generative soundtrack entirely client-side. Real-time recording breaks in hidden tabs (rAF pauses in background tabs per MDN; Firefox throttles canvas capture to ~1 fps), so an offline renderer is required. Deliver complete production code, one concern per file, no placeholders.

Requirements:
1. `mimeNegotiation.ts` (pure, unit-tested): Offline: `VideoEncoder.isConfigSupported` for `avc1.640028` → `avc1.4D4028` → `avc1.42E028` → `vp09.00.40.08` → `vp8`; `AudioEncoder.isConfigSupported` for `mp4a.40.2` → `opus`. MP4 when H.264 + AAC available; else WebM (VP9/VP8 + Opus). AAC encoding is unavailable in Firefox and on desktop Linux per MDN. Real-time: MediaRecorder `isTypeSupported` chain `video/mp4;codecs=avc1.640028,mp4a.40.2` → `video/mp4;codecs=avc1,mp4a.40.2` → `video/mp4` → `video/webm;codecs=vp9,opus` → `video/webm;codecs=vp8,opus` → `video/webm`. WebCodecs: Chrome 94+, Firefox 130+ desktop only, Safari 26+.
2. `offlineRenderer.ts`: FrameClock steps `frameIndex/fps`; render each frame at export resolution into an OffscreenCanvas; `new VideoFrame(canvas, {timestamp})`; encode with keyframe every 2 s; respect `encodeQueueSize` backpressure (max 8); audio from OfflineAudioContext → AudioData chunks → AudioEncoder; mux with Mediabunny (`Output`, `Mp4OutputFormat` with fast start / `WebMOutputFormat`, `BufferTarget` or `StreamTarget` to a File System Access writable where available). Pin the Mediabunny version and use its current documented API; do not use deprecated mp4-muxer/webm-muxer.
3. `realtimeRecorder.ts`: `canvas.captureStream(fps)` + audio destination stream; finite-state machine idle→arming→recording→finalizing→done/error; countdown; `visibilitychange` → pause with notice or switch to offline.
4. `webmDurationFix.ts`: write EBML Duration for MediaRecorder WebM using the measured duration.
5. Formats: MP4, WebM, GIF (gifenc, ≤ 15 s, ≤ 720 px), PNG sequence ZIP (fflate, streamed), WAV (16/24-bit), poster frame.
6. Settings: 720p/1080p/1440p/2160p (2160p only if max texture ≥ 4096 and offline available); 24/30/60 fps; bitrate auto per YouTube's recommended upload encoding settings (1080p24–30 = 8 Mbps, 1080p48–60 = 12 Mbps, 2160p standard = 35–45 Mbps → 40, 2160p high frame rate = 53–68 Mbps → 60; audio up to 384 kbps stereo) or manual 2–80 Mbps; durations 5/10/15/30/60 s + custom 1–180 s; seamless loop export (first = last frame); bake overlay; include audio; filename template `{title}_{preset}_{ratio}_{res}_{fps}_{date}.{ext}` sanitized.
7. UX: progress + ETA + cancel (AbortController, cleans partial files), preview modal, Download, Share (Web Share Level 2 when `navigator.canShare({files})`; else download), Screen Wake Lock during export, pre-flight memory estimate with warning.
8. Platform hints: 1080×1920, 9:16, MP4 H.264 + AAC stereo is accepted by Reels, TikTok and Shorts; show a "best for upload" badge when output matches.

Acceptance criteria:
- Chromium produces MP4 (offline) with valid `ftyp`/`moov`; Firefox produces playable WebM with correct duration; Safari produces MP4.
- Offline export of a 10 s 1080p30 project has exactly 300 video frames and audio length 10.000 s ±1 frame.
- Hidden tab during offline render does not change output (hash equal to visible render).
- Cancel releases all frames/encoders (no VideoFrame leak warnings).
````

## FILE: 11-presets-projects-storage.md

````markdown
# Phase 11 — Presets, projects, storage

Context: Cinematic Sky stores everything locally in IndexedDB and works offline. Deliver complete production code, one built-in preset per file, no placeholders.

Requirements:
1. `presets/schema.ts`: zod `PresetV3` covering every scene/fx/postfx/audio/camera/overlay parameter; `schemaVersion`; migrations v1→v2→v3; strict parsing (strip unknown keys, clamp numbers, cap strings, reject `__proto__`/`constructor`/`prototype` keys); max 2 MB.
2. 12 built-in presets (original names, no trademarks): Midnight Solitude, Thunder & Downpour, Golden Hour Memory, Neon Alley Rain, Magnetic Tape '95, Sakura Dusk Drift, First Snow Platform, Firefly Summer Field, Misty Dawn Pass, Aurora Overpass, Rooftop Starfall, Ember Festival Night — values per settings-reference.md.
3. `presetService.ts`: CRUD, duplicate, favorites, tags, search, randomize with seed (constrained ranges), auto-thumbnail (256 px render in worker).
4. `storage/db.ts` (idb): stores projects, presets, assets (Blobs), thumbnails, settings, offlineQueue; versioned upgrades.
5. `autosave.ts`: debounced 1.5 s, last 10 snapshots; crash recovery prompt on load.
6. `quota.ts`: `navigator.storage.estimate()`, `persist()` request, QuotaExceededError → evict thumbnails/old snapshots → prompt export.
7. `shareUrl.ts`: fflate deflate + base64url in the URL fragment; ≤ 8,000 chars; larger → backend share link (if configured) or JSON file; decoding goes through zod.
8. `projectIO.ts`: export/import `.cinematicsky.json` (and `.zip` with assets, ≤ 200 entries, ≤ 50 MB uncompressed).
9. Undo/redo (200 steps, slider coalescing); slideshow (multiple images, per-slide preset, transitions crossfade/dip-to-black/wipe/zoom-through/depth-dissolve); batch export queue (sequential, resumable after reload).

Acceptance criteria:
- Fuzzed JSON (fast-check) never crashes the parser; invalid input yields typed errors.
- v1 and v2 fixtures migrate to v3 losslessly.
- Share URL round-trip reproduces identical render hash.
- Simulated quota error triggers eviction then user prompt.
````

## FILE: 12-input-autocrop-scene-anchors.md

````markdown
# Phase 12 — Input, sanitization, auto-crop, Scene Anchors

Context: Cinematic Sky accepts user images and must make every effect work on any photo, not just the default scene. Deliver complete production code, no placeholders.

Requirements:
1. Inputs: drag-drop, paste, file picker, mobile camera (`capture="environment"`), PWA `file_handlers` and `share_target`, URL import only via backend proxy (disabled with explanation when no backend or local-only mode).
2. `sniffMime.ts`: magic bytes for JPEG (FF D8 FF), PNG (89 50 4E 47), WebP (RIFF....WEBP), AVIF/HEIC (ftyp brands avif/heic/heix/mif1), GIF, BMP; ignore declared MIME; SVG rejected by default, optional sandboxed rasterize via `<img>` Blob URL.
3. `limits.ts`: ≤ 50 MB file, ≤ 40 MP decoded (parse header dimensions first), 1×1 minimum, decode timeout 15 s in worker.
4. `decodeImage.ts`: `createImageBitmap(blob, {imageOrientation: 'from-image'})`, downscale to ≤ 4096 px; `heicDecode.ts`: native probe (Safari 17+ decodes HEIC via createImageBitmap), else lazy libheif WASM in worker; request tokens + AbortController so only the latest decode commits; ObjectUrlRegistry with revoke.
5. `autoCrop.ts`: scan top 0–12% / bottom 0–15% rows; per-row luminance variance + edge density; detect uniform bands, status-bar glyph signatures (small high-contrast blobs at both ends), home-indicator pill; snap to band edges; confidence score; cap 20% total auto-crop; manual handles to adjust.
6. `focalPoint.ts`: saliency (gradient energy + depth if available); manual focal point; ratio fit modes cover / blur-fill / letterbox; ratios 9:16, 16:9, 1:1, 4:5, 3:4, 2:3, 2.39:1, 21:9, custom 0.25–4.0.
7. Scene Anchors editor (`AnchorsEditor` + `scene/anchors.ts`): light sources (type, position, direction, cone, Kelvin, intensity, flicker), horizon line, ground plane quad, puddle polygons (feather), foliage emitter polygons (rate), sky mask brush, foreground occlusion brush, water regions, freeze mask; pointer + touch + keyboard editing; normalized coordinates (0–1) so anchors survive crop/ratio changes; persisted per image hash.
8. `anchorSuggest.ts`: with consent, run depth + segmentation and propose horizon, sky mask, occlusion mask, top-3 light candidates (bright compact blobs); accept/reject per suggestion. Reset button restores the default scene.

Acceptance criteria:
- Fixture screenshots (iOS/Android, light/dark) crop within ±4 px of ground truth; photos without bars are not cropped.
- Renamed `.exe` as `.jpg`, polyglot files, 0-byte, truncated JPEG, 16384-px PNG, and SVG with script all handled with typed errors and no crash.
- EXIF-rotated JPEG displays upright.
- Rapidly uploading 5 images shows only the last one.
````

## FILE: 13-settings-a11y-i18n-pwa.md

````markdown
# Phase 13 — Settings, accessibility, i18n, PWA

Context: Cinematic Sky needs a dedicated, persisted Settings panel and full accessibility/offline support. Deliver complete production code, no placeholders.

Requirements:
1. `settings/schema.ts` + `defaults.ts`: sections Performance, Audio, Export, Accessibility, UI, Privacy/Storage, ML, Developer with every setting from settings-reference.md (type, range, default, unit); per-section reset; global reset; search; import/export settings JSON (zod).
2. Accessibility: WCAG 2.2 AA UI; keyboard everything; visible focus; ARIA for icon buttons; sliders with `aria-valuetext` units; live-region announcements; `prefers-reduced-motion` → reduced motion + Photosensitive Safe Mode; `prefers-contrast` → high contrast; font scale 87.5–200%; remappable shortcuts with conflict detection; captions for generated audio events ("thunder", "rain intensifies").
3. i18n: i18next ICU; locales en, ja, es, pt, ko, zh, hi, ar, he; RTL via `dir` + logical CSS properties; locale number/date formats.
4. PWA: vite-plugin-pwa (Workbox) precache app shell + engine + built-in presets; runtime cache for ML models only when enabled; `file_handlers` (image types) and `share_target` (POST multipart images handled by SW → IndexedDB → app); install prompt UI; update-available toast.
5. Haptics via `navigator.vibrate` where supported; toggle.
6. Local-only mode: blocks all network (ML download, backend, URL import) at the API layer with a visible indicator.

Acceptance criteria:
- axe-core scan: zero serious/critical violations on all panels.
- App loads and exports offline after first visit (Playwright offline test).
- Arabic locale mirrors layout correctly.
- Reset per section restores defaults without touching other sections.
````

## FILE: 14-backend-express.md

````markdown
# Phase 14 — Optional backend (Node.js + Express + TypeScript)

Context: Cinematic Sky's frontend works fully offline; this separate `backend/` package adds accounts, cloud projects/presets, a public preset gallery with likes, comments on shared reels, presigned uploads, WebM→MP4 render jobs, share links, an LLM proxy for AI prompts, and a URL-import proxy. Deliver complete production code, one file per controller/service/route/middleware/model, `.env.example` only (never real secrets), no placeholders.

Folder structure (exact):
backend/ → node_modules/, prisma/schema.prisma, src/{config, controllers, middlewares, models, routes, services, utils, redis}/, app.ts, server.ts, .env.example, .gitignore, package.json, README.md.
- config/: env.ts (zod-validated; fail fast), db.ts (Prisma), s3.ts (S3/R2 client), logger.ts (pino with redaction of authorization/cookie/set-cookie), cors.ts (allowlist).
- controllers/: auth, projects, presets, gallery, comments, uploads, renders, shares, ai, importUrl, health (thin: parse → call service → respond).
- middlewares/: security.ts (helmet strict CSP, HSTS, frameguard deny, noSniff, no-referrer), cors.ts, rateLimit.ts (Redis store), validate.ts (zod body/query/params), auth.ts (access cookie JWT verify, `req.user`), requestId.ts, httpLogger.ts (pino-http), bodyLimits.ts (JSON 100 kB), idempotency.ts (Idempotency-Key stored in Redis 24 h), csrf.ts (double-submit header), errorHandler.ts (no stack leaks in production; `{error:{code,message,requestId}}`).
- models/: zod DTOs + repository wrappers per entity (User, Session/RefreshToken family, Project, Preset, PresetLike, Share, Comment, Upload, RenderJob, AuditLog); every query owner-scoped.
- routes/: one router per resource under `/api/v1`.
- services/: authService (argon2id, lockout after 10 failures/15 min), tokenService (access 15 min, refresh 30 d, rotation with reuse detection revoking the family), projectService (optimistic concurrency via version), presetService, galleryService (cursor pagination, like counts cached in Redis), commentService (plain-text sanitize, ≤ 500 chars, profanity hook), uploadService (presigned PUT with content-length-range + content-type; on complete: fetch object head, verify magic bytes, size cap 50 MB, decode-and-re-encode with sharp to strip EXIF and neutralize polyglots, reject SVG), renderService (BullMQ queue `render`, worker spawns FFmpeg with argument array, never shell strings: `-c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart`, timeout 5 min, temp dir per job cleaned up; signed GET URL 10 min), shareService (random 12-char slugs), llmService (server-side API key, per-user quota, prompt length cap, output length cap), urlImportService (SSRF guard: https only, DNS resolve + pin, block private/loopback/link-local/CGNAT/metadata IPv4+IPv6, ≤ 3 redirects re-validated, 10 MB/10 s caps, magic-byte check), sanitizer.
- utils/: asyncHandler, httpErrors, pagination, crypto (timing-safe compare), magicBytes, exifStrip, safeFilename.
- redis/: client.ts, rateLimitStore.ts, cache.ts, queue.ts.
- app.ts: middleware order requestId → httpLogger → security → cors → bodyLimits → cookieParser → rateLimit → csrf → routes → 404 → errorHandler; `app.set('trust proxy', <configured hop count>)`.
- server.ts: listen on PORT, graceful shutdown (SIGTERM/SIGINT: stop accepting, drain worker, close Prisma/Redis, 10 s timeout).
- package.json scripts: dev, build, start, worker, migrate, test, lint.

Endpoint table (implement all): GET /health; POST /auth/register, /auth/login, /auth/refresh, /auth/logout; GET /me; GET/POST /projects; GET/PATCH/DELETE /projects/:id; GET/POST /presets; PATCH/DELETE /presets/:id; GET /gallery/presets; POST/DELETE /gallery/presets/:id/like; POST /uploads/presign; POST /uploads/:id/complete; POST /renders; GET /renders/:id; POST /shares; GET /shares/:slug; GET/POST /shares/:slug/comments; DELETE /comments/:id; POST /ai/prompts; POST /import/url.

Rate limits: global 300/15 min/IP; auth 10/15 min per IP+normalized email; AI 30/h/user; renders 20/day/user; comments 30/h/user.
Cookies: access `HttpOnly; Secure; SameSite=Lax`; refresh `HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth`.
Builder mapping: if the builder has Supabase, implement the same contracts with tables + Row Level Security (`auth.uid() = owner_id`), Storage signed URLs, Edge Functions for LLM proxy/render trigger; on Base44, use entities with owner-only permissions and built-in integrations. The frontend `src/api/` adapter interface stays identical.

Acceptance criteria:
- Supertest suite: 401 on every protected route without cookie; 404 (not 403) when user B requests user A's project; refresh reuse revokes family; SSRF tests for 127.0.0.1, ::1, 169.254.169.254, 10.0.0.0/8, DNS-rebinding hostname, redirect to private IP — all blocked; upload of PHP renamed .jpg rejected; idempotent POST /renders with same key returns the same job.
- No stack traces in production responses; logs contain requestId and no secrets.
- `docker compose up` (Postgres, Redis, API, worker) works from README.
````

## FILE: 15-hardening-red-team.md

````markdown
# Phase 15 — Hardening & red-team audit

Context: Cinematic Sky (client-side engine + optional Express backend) must survive hostile input, flaky devices, and adversarial users. Audit all existing code and implement every remediation below with a regression test each. Deliver complete code changes, no placeholders.

Implement:
1. Images: 50 MB / 40 MP caps from header parse; worker decode with 15 s timeout; corrupt/truncated → typed error.
2. SVG: rejected by default; optional sandboxed rasterize via `<img>` Blob URL; never inline SVG markup; CSP `script-src 'self'; object-src 'none'; base-uri 'none'`.
3. Decompression bombs: pixel caps; ZIP imports ≤ 200 entries, ≤ 50 MB uncompressed with streaming counters.
4. HEIC/EXIF: `imageOrientation: 'from-image'`; native probe then WASM; EXIF stripped on re-export.
5. Leaks: ObjectUrlRegistry; `dispose()` on every engine class; ImageBitmap/VideoFrame `close()`; audio nodes disconnected; listeners via AbortController; mount/unmount 50× test with baseline counts.
6. GPU context loss: restore with re-upload; tier fallback after 3 losses/60 s.
7. Audio: suspended/interrupted handling; iOS silent-switch notice; test tone.
8. MIME: negotiation fallbacks to offline, then PNG sequence + WAV.
9. Races: recording FSM guards double start/stop; preset switch during recording locked or queued; decode request tokens + AbortController.
10. Hidden tab: pause real-time recording with notice or switch to offline.
11. Memory: pre-flight estimate, encoder backpressure (≤ 8 queued frames), streamed muxing to disk where File System Access exists.
12. Storage: QuotaExceededError eviction + prompt.
13. Preset JSON: zod strict, clamps, 2 MB cap, prototype-pollution key rejection.
14. Share URLs: 8,000-char cap.
15. XSS: text nodes only, no `dangerouslySetInnerHTML` (ESLint rule `react/no-danger` as error), server sanitize.
16. Flash safety: shared flash guard (≤ 3 flashes/s per WCAG 2.3.1; Safe Mode ≤ 1 per 2 s).
17. Network: offline queue, exponential backoff with full jitter (500 ms base, 30 s cap, 6 tries), idempotency keys.
18. Backend: auth on all non-public routes, owner-scoped queries (IDOR), Redis rate limits keyed IP+user+route with exact trust-proxy, SSRF guard, server-generated storage keys (no path traversal), env validation, log redaction, dependency audit in CI (`npm audit --omit=dev` fails on high).
19. Boundaries: 0%/100% intensity, zero/negative/NaN/Infinity durations rejected, ratios 0.25 and 4.0, 1×1 and 16384-px images, 0-byte files, 180 s exports.

Acceptance criteria: every item has a named passing test; a summary table maps risk → file → test name in README.
````

## FILE: 16-testing-acceptance.md

````markdown
# Phase 16 — Testing, performance, acceptance

Context: Cinematic Sky is a React/TS PWA with a client-side render/audio/export engine and an optional Express backend. Complete the test suite and CI. Deliver complete test code and configs, no placeholders.

Requirements:
1. Vitest unit tests: auto-crop (fixtures ±4 px), RNG determinism, zod schemas + migrations + fuzzing (fast-check), MIME negotiation with mocked support matrices (Chrome 126+ MP4, Safari MP4, Firefox WebM-only, Linux no-AAC), color math, LUT parser, flash guard, easing/interpolation, scheduler lookahead timing, WebM duration patch, filename sanitizer, share URL codec, SSRF guard, rate-limit keys.
2. Component tests (Testing Library): sliders, mixer, overlay XSS, settings reset, keyboard shortcuts.
3. Playwright e2e on Chromium, WebKit, Firefox: upload → preset → record 5 s → download (file signature check: `ftyp` for MP4, EBML `1A 45 DF A3` for WebM); offline render; reload offline (PWA); keyboard-only; reduced-motion; RTL locale; context-loss recovery; hidden-tab simulation.
4. Visual regression: WebGPU vs WebGL2 SSIM ≥ 0.98 per preset.
5. Performance: CI performance test with CPU throttling 4×: preview ≥ 55 fps average at 1080×1920 with adaptive quality; offline 10 s 1080p30 export ≤ 60 s on reference laptop; bundle budget: initial JS ≤ 250 kB gzip (ML/HEIC/GIF/ZIP lazy).
6. Cross-browser matrix document with fallbacks: renderer (WebGPU/WebGL2/Canvas2D), export (WebCodecs MP4/WebM, MediaRecorder MP4/WebM), HEIC (native/WASM), Share (files/download).
7. Backend: Supertest + Testcontainers (Postgres, Redis); auth, IDOR, SSRF, uploads, idempotency, error shape.
8. CI (GitHub Actions): lint, typecheck, unit, e2e matrix, backend tests, `npm audit`, build artifacts.

Acceptance criteria (release gate): all suites green; coverage ≥ 85% lines for `src/engine`, `src/pipeline`, `src/audio`, `src/presets`, `backend/src/services`; zero axe serious/critical issues; every module acceptance criterion from Phases 01–15 verified by at least one automated test.
````

---

## FILE: settings-reference.md

### A. Global settings (not preset-bound)
| Section | Setting | Control | Range / options | Default | Unit |
|---|---|---|---|---|---|
| Performance | Renderer | select | auto, WebGPU, WebGL2, Canvas2D | auto | — |
| Performance | Render scale | slider | 0.5–1.0 (step 0.05) | auto (1.0 high / 0.75 mid / 0.6 low) | × |
| Performance | DPR cap | slider | 1–3 | 2 | × |
| Performance | Max FPS | select | 30, 60, 120, display | 60 | fps |
| Performance | Particle cap | slider | 1,000–50,000 | tier: 4k/12k/30k | particles |
| Performance | Adaptive quality | toggle | on/off | on | — |
| Performance | Worker rendering | toggle | on/off | on (if supported) | — |
| Performance | Max source size | select | 2048, 4096, 8192 | 4096 | px |
| Performance | Perf overlay | toggle | on/off | off | — |
| Audio | Start muted | toggle | on/off | on | — |
| Audio | Latency hint | select | interactive, balanced, playback | balanced | — |
| Audio | Limiter | toggle | on/off | on | — |
| Audio | Master volume | slider | −60…+6 | −6 | dB |
| Audio | Sample rate | select | auto, 44100, 48000 | auto | Hz |
| Audio | Spatial audio | toggle | on/off | off | — |
| Export | Mode | select | auto, offline, real-time | auto | — |
| Export | Container | select | auto, MP4, WebM | auto | — |
| Export | Resolution | select | 720p, 1080p, 1440p, 2160p | 1080p | — |
| Export | FPS | select | 24, 30, 60 | 30 | fps |
| Export | Bitrate | select/slider | auto or 2–80 | auto | Mbps |
| Export | Duration | select/number | 5, 10, 15, 30, 60, custom 1–180 | 10 | s |
| Export | Seamless loop | toggle | on/off | on | — |
| Export | Bake overlay | toggle | on/off | off | — |
| Export | Include audio | toggle | on/off | on | — |
| Export | Filename template | text | ≤ 120 chars | `{title}_{preset}_{ratio}_{res}_{fps}_{date}` | — |
| Export | Preset change while recording | select | lock, queue | lock | — |
| Accessibility | Reduced motion | select | system, on, off | system | — |
| Accessibility | Photosensitive safe mode | toggle | on/off | off (on if reduced motion) | — |
| Accessibility | High contrast | select | system, on, off | system | — |
| Accessibility | Font scale | slider | 87.5–200 | 100 | % |
| Accessibility | Audio-event captions | toggle | on/off | off | — |
| Accessibility | Shortcuts | key remap | any non-conflicting | defaults (Space, R, C, L, M, F, 1–9, ?) | — |
| UI | Theme | select | system, dark, light, OLED | system | — |
| UI | Language | select | en, ja, es, pt, ko, zh, hi, ar, he | browser | — |
| UI | Layout | select | auto, sidebar, bottom sheet | auto | — |
| UI | Compact mobile | toggle | on/off | auto (<640 px) | — |
| UI | Haptics | toggle | on/off | on | — |
| UI | Tooltips | toggle | on/off | on | — |
| Privacy | Local-only mode | toggle | on/off | off | — |
| Privacy | Persist storage | button | request | — | — |
| Privacy | Clear data | buttons | thumbnails / projects / models / all | — | — |
| ML | Depth estimation | toggle | on/off | off | — |
| ML | Segmentation | toggle | on/off | off | — |
| ML | Model precision | select | auto, quantized (~26 MB), fp16 (~47 MB), fp32 (~94 MB) | auto | — |
| Developer | Seed | number | 0–4294967295 | random on new project | — |
| Developer | Debug overlay | multi-toggle | anchors, masks, depth, particles, GPU timings | off | — |
| Developer | Log level | select | error, warn, info, debug | warn | — |

### B. Preset-bound parameters (range/default + values for 12 presets)
Presets: MS = Midnight Solitude · TD = Thunder & Downpour · GH = Golden Hour Memory · NA = Neon Alley Rain · MT = Magnetic Tape '95 · SD = Sakura Dusk Drift · FS = First Snow Platform · FF = Firefly Summer Field · MD = Misty Dawn Pass · AO = Aurora Overpass · RS = Rooftop Starfall · EF = Ember Festival Night

| Parameter | Control / range / unit | Default | MS | TD | GH | NA | MT | SD | FS | FF | MD | AO | RS | EF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Rain intensity | slider 0–100 % | 60 | 45 | 95 | 0 | 70 | 40 | 0 | 0 | 0 | 10 | 0 | 0 | 0 |
| Wind | slider −100…100 | 15 | 10 | 45 | 5 | 20 | 10 | 25 | 15 | 5 | 8 | 10 | 12 | 18 |
| Lens droplets | slider 0–100 % | 20 | 15 | 50 | 0 | 35 | 10 | 0 | 5 | 0 | 10 | 0 | 0 | 0 |
| Puddle ripples | toggle | on | on | on | off | on | on | off | off | off | off | off | off | off |
| Wetness | slider 0–100 % | 60 | 70 | 100 | 10 | 90 | 60 | 20 | 40 | 0 | 50 | 30 | 20 | 10 |
| Snow | slider 0–100 % | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 55 | 0 | 0 | 15 | 0 | 0 |
| Fog density | slider 0–100 % | 15 | 20 | 30 | 10 | 25 | 15 | 10 | 25 | 10 | 70 | 15 | 5 | 20 |
| Leaves/petals | slider 0–100 % (type) | 20 leaves | 20 leaves | 35 leaves | 25 leaves | 0 | 15 leaves | 70 sakura | 0 | 10 leaves | 15 leaves | 0 | 0 | 0 |
| Fireflies | slider 0–100 % | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 75 | 0 | 0 | 0 | 0 |
| Embers | slider 0–100 % | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 65 |
| Dust motes | slider 0–100 % | 10 | 5 | 0 | 45 | 10 | 20 | 25 | 0 | 15 | 20 | 0 | 5 | 30 |
| God rays | slider 0–100 % | 0 | 0 | 0 | 60 | 0 | 10 | 35 | 0 | 20 | 55 | 0 | 0 | 15 |
| Shooting stars | slider 0–10 /min | 0 | 0.5 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 2 | 6 | 0 |
| Aurora | slider 0–100 % | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 80 | 0 | 0 |
| Stars | slider 0–100 % | 30 | 40 | 0 | 0 | 5 | 20 | 15 | 10 | 60 | 0 | 70 | 90 | 20 |
| Moon phase | slider 0–1 | 0.85 | 0.9 | 0.6 | 0.3 | 0.5 | 0.85 | 0.7 | 0.95 | 1.0 | 0.2 | 0.4 | 0.15 | 0.75 |
| Cloud coverage | slider 0–100 % | 45 | 50 | 95 | 30 | 70 | 45 | 25 | 80 | 10 | 60 | 15 | 5 | 30 |
| Lightning freq | slider 0–12 /min | 2 | 0.5 | 6 | 0 | 1 | 0.5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Lightning distance | slider 0.5–15 km | 5 | 9 | 2.5 | — | 7 | 8 | — | — | — | — | — | — | — |
| Headlight intensity | slider 0–200 % | 100 | 100 | 120 | 40 | 130 | 90 | 70 | 110 | 50 | 60 | 80 | 60 | 70 |
| Light temp | slider 1800–12000 K | 4200 | 4000 | 5200 | 3000 | 6500 | 3600 | 3800 | 5500 | 3200 | 4800 | 6000 | 4500 | 2400 |
| Flicker | select | vintage | vintage | vintage | none | neon | vintage | none | vintage | candle | none | none | none | candle |
| Camera mode | select | breathing | breathing | handheld | slow zoom | pan H | breathing | pan H | slow zoom | orbit | dolly in | pan V | slow zoom | handheld |
| Shake | slider 0–20 px | 0 | 0 | 4 | 0 | 1 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |
| Depth parallax | slider 0–100 % (needs depth) | 30 | 30 | 40 | 35 | 30 | 20 | 40 | 30 | 45 | 50 | 40 | 35 | 35 |
| Grade preset | select | Midnight Lo-Fi | Midnight Lo-Fi | Film Noir* | Golden Hour | Neon Night | Retro Tape | Golden Hour | Midnight Lo-Fi | Golden Hour | Midnight Lo-Fi | Neon Night | Midnight Lo-Fi | Golden Hour |
| Exposure | slider −3…+3 EV | 0 | −0.3 | −0.6 | +0.2 | −0.2 | 0 | +0.1 | +0.3 | −0.2 | +0.2 | −0.1 | −0.4 | −0.1 |
| Saturation | slider 0–200 % | 100 | 85 | 60 | 115 | 135 | 90 | 110 | 80 | 105 | 75 | 120 | 90 | 120 |
| Bloom | slider 0–100 % | 30 | 30 | 25 | 45 | 65 | 25 | 40 | 35 | 55 | 30 | 50 | 40 | 55 |
| Film grain | slider 0–100 % | 20 | 25 | 30 | 15 | 15 | 45 | 15 | 20 | 20 | 15 | 10 | 20 | 25 |
| Vignette | slider 0–100 % | 30 | 40 | 50 | 25 | 30 | 45 | 25 | 30 | 35 | 20 | 30 | 45 | 35 |
| Scanlines/tape | slider 0–100 % | 0 | 0 | 0 | 0 | 10 | 70 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Letterbox 2.39:1 | toggle | off | off | on | off | off | off | off | off | off | on | off | off | off |
| BPM | slider 60–100 | 78 | 74 | 82 | 80 | 88 | 76 | 72 | 70 | 68 | 66 | 75 | 70 | 84 |
| Key / scale | select | F minor | F minor | D minor | A♭ major | C♯ dorian | E♭ major | G major | D major | C lydian | B♭ major | E minor | A minor | D mixolydian |
| Progression | select | ii–V–I | ii–V–I | i–VI–III–VII | I–vi–IV–V | iii–vi–ii–V | ii–V–I | I–vi–IV–V | vi–IV–I–V | I–vi–IV–V | ii–V–I | i–VI–III–VII | vi–IV–I–V | I–vi–IV–V |
| Voicing | select 7/9/11 | 9th | 9th | 7th | 9th | 11th | 7th | 9th | 9th | 11th | 9th | 11th | 9th | 7th |
| Swing | slider 0–75 % | 55 | 58 | 50 | 55 | 62 | 54 | 52 | 50 | 56 | 48 | 52 | 55 | 60 |
| Vinyl crackle | slider 0–100 % | 30 | 35 | 20 | 30 | 25 | 60 | 25 | 30 | 20 | 15 | 20 | 30 | 25 |
| Tape wow/flutter | slider 0–100 % | 20 | 20 | 15 | 20 | 15 | 55 | 20 | 15 | 15 | 10 | 15 | 20 | 15 |
| Muffle LP | slider 400–20000 Hz | 9000 | 8000 | 6500 | 11000 | 10000 | 5500 | 10000 | 9000 | 9500 | 12000 | 11000 | 8500 | 10000 |
| Rain vol | slider −60…+6 dB | −12 | −14 | −6 | −60 | −10 | −16 | −60 | −60 | −60 | −24 | −60 | −60 | −60 |
| Thunder vol | slider −60…+6 dB | −10 | −16 | −4 | −60 | −14 | −18 | −60 | −60 | −60 | −60 | −60 | −60 | −60 |
| Engine rumble vol | slider −60…+6 dB | −24 | −22 | −28 | −30 | −20 | −24 | −60 | −26 | −60 | −60 | −30 | −60 | −60 |
| Wind vol | slider −60…+6 dB | −20 | −22 | −12 | −24 | −24 | −22 | −16 | −14 | −26 | −18 | −16 | −20 | −24 |
| Extra ambience | select | none | none | rain-on-roof | café | city night | rain-on-window | wind chimes | distant train | crickets | none | wind chimes | city night | café murmur |
| Reverb mix | slider 0–100 % | 25 | 30 | 35 | 20 | 30 | 20 | 30 | 40 | 25 | 45 | 50 | 35 | 25 |

*TD uses the Film Noir grade at 40% strength blended over Midnight Lo-Fi to keep color in lightning relights.

---

## FILE: changelog.md

- Name/stack → kept; + strict TS, Zustand, zod, Vite, PWA, i18n, Vitest/Playwright.
- Canvas 2D engine → WebGPU → WebGL2 → Canvas2D tiers; OffscreenCanvas worker; adaptive quality; seeded RNG; pooled typed arrays; context-loss recovery.
- "4K" claim → preview res ≠ export res; 720p–2160p gated by GPU limits.
- Missing default image → procedural fallback scene, never blank.
- Effects hardcoded to motorcycle → Scene Anchors editor + ML auto-suggest.
- Auto-crop → row-variance/edge-density band detector + manual handles + focal point; + 5 ratios + custom.
- Rain → 3 layers + splashes + lens droplets w/ refraction + occlusion.
- Ripples → zone-bound, pooled, rain-coupled.
- Headlight → generic light anchors (Kelvin, cone, flicker types) + wet-road reflections.
- Moon/clouds → phase, draggable, 3-layer clouds veil glow.
- Leaves → foliage-region emitters; + snow, hail, fog, fireflies, sakura, embers, dust, god rays, rainbow, heat haze, shooting stars, aurora, stars.
- Lightning → branching bolts, distance-based thunder delay, manual strike, WCAG 2.3.1 flash guard + safe mode.
- Ken Burns → path editor, orbit, dolly zoom, Perlin shake, audio pulse, depth parallax.
- + 2.5D depth (Depth Anything V2 Small, opt-in), segmentation, DoF/rack focus, depth fog.
- + Motion brush w/ anchors/freeze, seamless loops; + sky replacement; + anime FX (blink, hair sway, breathing, speed lines).
- 5 grades → full post stack (LUT, wheels, bloom, halation, CA, grain, CRT, film, glitch, leaks, letterbox, split compare); "Cyberpunk Neon"/"Vintage VHS" → "Neon Night"/"Retro Tape".
- Audio 5 tracks → composer (keys, scales, progressions, voicings, swing, humanize), FM Rhodes, drums, bass, melody, vinyl, tape, sidechain, convolution reverb, compressor + limiter, meters, 3-band EQ, pan/solo, spatial, 9 extra ambiences, custom music + BPM detect, audio-reactive visuals, offline deterministic render, iOS unlock handling.
- Overlay → fully editable handle/caption/avatar/counts/marquee; platform skins; safe-zone guides; bake toggle; watermark; titles; SRT/VTT; animated text incl. vertical Japanese.
- + Timeline/keyframes, easing, markers, loop region, beat snap.
- Export WebM-only real-time → MIME negotiation (MP4 H.264/AAC where supported), offline WebCodecs + Mediabunny frame-perfect render, WebM duration fix, 24/30/60 fps, bitrate, 5–180 s, seamless loop, GIF, PNG ZIP, WAV, poster, Web Share, wake lock, memory guard, hidden-tab policy.
- 5 presets → 12 original-name presets w/ full params; CRUD, favorites, randomize, thumbnails, JSON v3 + migrations, share URL, undo/redo, autosave, slideshow, batch export.
- AI modal → Midjourney V8.2/Niji 7, Kling 3.0, Veo 3.1, Runway Gen-4.5, MiniMax H3, PixVerse V6, Pika 2.5, Suno v6; Sora removed (API shut down); auto-prompts from scene; data-driven catalog.
- + Settings panel (8 sections, per-section reset); + a11y (WCAG 2.2 AA, reduced motion, shortcuts), i18n incl. RTL, PWA file/share handlers, haptics, local-only mode.
- + Optional Express/TS backend mirroring screenshot tree; auth, gallery, comments, presigned uploads, FFmpeg render queue, share links, LLM proxy, SSRF-guarded URL import; Supabase/Base44 mapping.
- + Hardening table (30+ risks → remediations + tests); + testing/CI/perf budgets/release gate.

---

## Caveats
- Builder limits: only Lovable publishes caps (Knowledge 10k chars, URL prompt 50k); Bolt token ceilings from user error reports; AI Studio Build + Base44 → none found. Master file likely > Lovable Knowledge → paste modules into chat sequentially, keep `01` recap in Knowledge.
- Version facts move fast: AI tool versions from secondary roundups (tech-insider, pinggy, aireiter, datanorth); Pika 2.5 called "current engine… released in early 2026" by aitoolses.com (Sept 2026), still secondary, not confirmed on Pika's site. `promptTemplates.ts` carries `lastVerified` for this reason.
- Safe-zone pixel margins conflict across guides → stored as editable data, default strictest.
- HEIC on Chrome: sources conflict (none vs Chrome 118 macOS/Android) → runtime probe. [heicify](https://www.heicify.com/guides/heic-browser-support) [heiccon](https://heiccon.com/blog/heic-for-web)
- Mediabunny version/date from a third-party PR, API names (Output, Mp4OutputFormat, BufferTarget, CanvasSource) from migration guide/PRs → builder must pin + check current docs. [github](https://github.com/whiskeyo/cs2analyzer/pull/104) [github](https://github.com/Vanilagy/mp4-muxer/blob/main/MIGRATION-GUIDE.md)
- Udio download block confirmed by Udio Help Center ("downloading of audio, video, and stems has been disabled") → Udio not templated.
- Perf budgets (60 fps mid-range Android, ≤ 60 s offline export) = targets, not measured.