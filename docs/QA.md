# Portfolio QA and handover — Phase 4

Verified locally on **2026-09-20**. The existing Field Notes design is retained. The requested header is held while scrolling at desktop, tablet and mobile widths. No commit, push, PR, deployment, DNS, Cloudflare, tunnel or hosting change occurred. This section supersedes the historical Phase 3 report below.

## Exact commands and outcomes

Environment: macOS Darwin 25.6.0 arm64, Node 26.3.0, npm 11.16.0, Next 16.2.9, React 19.2.4, TypeScript 5.9.3, Playwright Core 1.63.0. Chromium is installed Google Chrome **153.0.8010.50**; automated WebKit **26.6**, matching Playwright revision **2359**. This is a local desktop environment, not a physical phone or low-end performance device.

| Command / check | Result and evidence |
| --- | --- |
| `npm ci` | Exit 0 in `/tmp/portfolio-install-YGaYQf`, copied package manifests; working dependencies preserved. 408 packages installed. Native install-script approval warnings for sharp/unrs-resolver recorded, not hidden. [Log](verification/phase-4/install.log) |
| Clean-install production build | Exit 0 with the actual source copied into the isolated npm-ci directory. [Log](verification/phase-4/clean-install-build.log) |
| `npm run lint` | Exit 0. [Log](verification/phase-4/lint.log) |
| `npm run typecheck` | Exit 0. [Log](verification/phase-4/types.log) |
| `npm test` | Exit 0; **13 tests**, zero failures: simulation/choreography plus Markdown attack cases and complete existing-essay preservation. [Log](verification/phase-4/unit.log) |
| `npm run build` | Exit 0; 10 generated static route entries, including existing essays, sitemap, robots and lab. [Log](verification/phase-4/build.log) |
| `npm run preview` | Running local production export on `http://127.0.0.1:4176`; correct content types, clean HTML paths and real 404 responses. No Next runtime server or backend. |
| `LAB_URL=http://127.0.0.1:4176 LAB_SHOTS=docs/verification/phase-4/interactions npm run test:lab:browser` | Exit 0; **33 checks**, no unexpected browser errors. [Report](verification/phase-4/interactions/results.json) |
| `npm run test:production` | Exit 0; **18 checks**, no keyboard occlusions or unexpected production console errors. [Report](verification/phase-4/production/report.json) |
| `npm run test:handover` | Exit 0; **26 Chromium + 26 WebKit checks**, both real WebGL. [Chromium](verification/phase-4/chromium/report.json), [WebKit](verification/phase-4/webkit/report.json), [summary log](verification/phase-4/handover-final.log) |
| Scrollcraft `doctor.mjs` | Exit 0. Node, 490-filter ffmpeg, Chrome, Playwright and workspace pass. Optional libwebp encoder missing; KIE absent and unnecessary. No paid imagery/video tests claimed. [Log](verification/phase-4/scrollcraft-doctor.log) |
| Scrollcraft `shoot.mjs` | Exit 0 for mobile 390×844, desktop 1440×900 and reduced-motion 390×844 against **running Next** at `http://localhost:3000/lab/thinkpad`. No dead-scroll finding; sampled cues clear 4.5:1. Contact sheets actually inspected. |
| `npm audit --json` | **Exit 1: nine pre-existing advisories** (one critical, six high, two moderate). Not a pass. No existing package version changed. [Full audit](verification/phase-4/npm-audit.json) |
| Source/public/export boundary scan | No credential-shaped values, internal design note, test paths or vendored skill references found in inspected text files. This is a scoped heuristic scan, not a secret-scanner certification. [Report](verification/phase-4/public-boundary.json) |

`npm test` emits Node's module-type inference warning when importing native TypeScript; it does not affect the result. No package module convention was changed to silence it.

## Journey and behavior coverage

The homepage disclosure and shared Writing/About links were additionally verified in both engines: [navigation report](verification/phase-4/portfolio-navigation.json).

Homepage → lab → request → stop/predict/new failure → restart and repair → replacement/mount reconnection → remote/local connection → independent sandbox → return home and browser Back all pass. Skipping/revisiting guidance preserves per-chapter settings. Saved requests retain the settings and result from request time after current settings change. Reset during replay cancels stale animation. Full page reload starts a new lesson; no persistent learning history is promised.

Both browsers exercised real WebGL, stopped-service and repair behavior, reduced motion, lightweight review, anchors, enlarged text, the sticky header, blog/direct routes, 404, public/contact hrefs and route return. Chromium additionally exercised fast/reverse scroll, all chapter entry/midpoint/exit states, emulated touch swipes over canvas, context loss, intentionally unavailable WebGL, deliberately aborted scene chunk, no-JS output and detailed keyboard/lifecycle assertions. Unsupported-WebGL tests intentionally mock only the support probe; their captures are explicitly fallback, never evidence of 3D rendering.

Every active lab control has an observed consequence. Abandoned legacy flip/hero/contact/elsewhere/now components were confirmed unimported and removed under the Phase 4 cleanup instruction. Real personal assets were retained. The existing essays' source hashes match the pre-Phase-4 snapshot.

## Combined visual review and captures

Initial combined review is retained under `verification/phase-4/before/`. The focused visual batch made the header persistent and gave the lab measured clearance; it did not replace the design. Final confirmation at 1440, 768, 390 and 320px showed no horizontal overflow, clipped model, colliding labels or inaccessible controls. At 320px, short viewports and large text, the scene deliberately unpins so reading remains usable. Ordinary content can naturally pass beneath opaque sticky surfaces while scrolling; focused controls are kept clear.

“Physical” below means the opening whole-laptop composition. “Logical” means software/files separated within the same actual 3D scene; there is no separate invented mode toggle.

| View | Opening / physical composition | Logical / failure state |
| --- | --- | --- |
| Desktop 1440×900 | [Image](verification/phase-4/after/physical-1440.png) | [Image](verification/phase-4/after/logical-failure-1440.png) |
| Tablet 768×844 | [Image](verification/phase-4/after/physical-768.png) | [Image](verification/phase-4/after/logical-failure-768.png) |
| Mobile 390×844 | [Image](verification/phase-4/after/physical-390.png) | [Image](verification/phase-4/chromium/logical-failure.png) |
| Narrow 320×844 | [Image](verification/phase-4/after/physical-320.png) | [Reading-first failure](verification/phase-4/after/logical-failure-320.png) |

- [Mobile contact sheet](verification/phase-4/scroll-mobile/sheet.png), [report](verification/phase-4/scroll-mobile/report.json).
- [Desktop contact sheet](verification/phase-4/scroll-desktop/sheet.png), [report](verification/phase-4/scroll-desktop/report.json).
- [Reduced-motion contact sheet](verification/phase-4/scroll-reduced/sheet.png), [report](verification/phase-4/scroll-reduced/report.json).
- [WebKit actual WebGL failure](verification/phase-4/webkit/logical-failure.png), [stable reduced-motion 3D](verification/phase-4/webkit/reduced-motion.png), [doubled text/header wrapping](verification/phase-4/webkit/text-zoom.png).
- [Lightweight mode](verification/phase-4/webkit/lightweight.png), [failed scene-chunk fallback preserving state](verification/phase-4/production/scene-chunk-failure.png), [actual context-loss fallback](verification/phase-4/interactions/context-loss-fallback.png).

Contact sheets and representative opening, failure, zoom and fallback frames were opened and reviewed. The final nonvisual history/focus fixes preserve the captured composition; final behavioral reports cover those fixes. The real social image, `public/images/thinkpad-lab.png`, is a 598×440 crop captured directly from the production scene box, about 28kB. No fabricated photograph or external work screenshot was introduced.

## Defects discovered and resolved

1. Header previously scrolled out of view. Shared sticky positioning now preserves the same horizontal placement; measured header/stage height clears navigation and focus. Enlarged/short views unpin the stage when necessary.
2. Homepage relied on route separation alone. Both lab links now use `prefetch={false}`. Fresh, in-view, hover and focus requests were recorded in **both** engines; none downloaded the scene bundle or lab route data before intentional navigation.
3. Plain fragment links produced null history state. The installed Next router ignores those entries when returning from another route; a lab URL could display home content. Reproduced in [initial failure](verification/phase-4/browser-back-initial-failure.json), fixed with standard Next chapter links, and full leave/Back journey passes in both engines. No scroll interception or private router-state mutation was added.
4. Keyboard focus correction also reacted to WebKit refocusing main during pointer clicks, moving the target before click completion. [Initial failure](verification/phase-4/webkit-focus-initial-failure.json) is retained. Correction is now limited to keyboard-visible actionable elements; both browsers complete the journey and Chromium's forward/reverse keyboard sweep has zero occlusions.
5. Marked does not sanitize raw HTML. `renderMarkdown` now uses an explicit HTML/attribute/scheme allowlist, removes executable/embedded content and disallows protocol-relative URLs. Existing authored essay content is unchanged; only equivalent quote entity serialization differs. Sources: [Marked's warning](https://marked.js.org/), [sanitize-html documentation](https://github.com/apostrophecms/sanitize-html). Sanitization is build-only; the library is absent from browser bundles.
6. Internal design commentary was embedded in root HTML; removed. Default 404 offered no portfolio navigation; replaced with existing-shell Home/Writing links. Lab social metadata now references a real exported image.

The first WebKit attempt used an older cached revision 2272 with the current driver and stalled. It was stopped, revision 2359 was downloaded using the installed Playwright CLI, and the full suite then ran. That stalled attempt is not counted as browser support.

## Performance and lifecycle observations

Measured with Playwright Core 1.63.0 on the environment above against the local production export. The unchanged scene chunk is **905722 bytes raw / 237901 bytes gzip**, measured from the built file using Node `gzipSync`. It is fetched only after intentional lab navigation. Browser resource durations/transfer sizes are recorded in the Chromium/WebKit reports; localhost delivery is not a public-network or mobile performance benchmark.

Demand-rendered frame counters stop when idle in both engines. Chromium's three repeated lab→home navigations return monitored listener counts to baseline: document resize 1, scroll 1, focusin 3, window popstate 1. Canvas and the route's sc-ready class are removed. This establishes the tested lifecycle behavior, not an unlimited GPU-memory or battery guarantee.

No Lighthouse, accessibility score, FPS, physical-device memory or thermal claim is made. No second scroll engine, continuous decorative animation, asset fetch, audio stream or real server access was introduced.

## Content, URLs and security qualifications

- Public GitHub profile and ArunJuke references remain reachable on review; ArunJuke stays described as an adaptation. LinkedIn and the public homepage fetch could not be independently verified by the web tool in this pass; their intended existing hrefs are retained, not replaced. Email target is checked; no email was sent and mailbox delivery was not tested.
- `/blog`, both original article slugs, sitemap and robots pass on the production export. Unknown routes return a real 404 and usable navigation. No essay, promotion date, credential, mentoring count or detailed award claim was invented.
- Native fragment IDs are the only URL-driven lesson state. Neither query strings nor local storage are parsed into simulation settings. Request records are created internally; no optional external state parser needs trusting.
- Markdown/body sanitization does not make arbitrary frontmatter or an untrusted CMS safe. Content is still local, reviewed source. No arbitrary upload endpoint exists.
- No global CSP or production header change was introduced. The local preview adds only MIME handling, no-store and nosniff for its own responses.
- npm advisories affect unchanged Next/build dependencies: Next (critical), sharp/postcss/nanoid/js-yaml/browserslist/brace-expansion (high), baseline-browser-mapping and @tailwindcss/postcss (moderate). The export does not run a Next server, Server Actions or image-optimization endpoint, but that is not a blanket security clearance. Scope a dependency remediation/exception decision before publication; do not run audit-fix blindly or claim a clean audit.

## Still manual / owner confirmation

- **Existing hosting mechanism:** requested from the owner, absent from repository configuration. DEPLOYMENT.md gives verified artifact/rollback requirements and conditional host guidance; exact host/project/origin steps await this answer. No host was guessed or changed.
- **Physical iOS Safari / Android Chrome:** actual swipe, URL-bar changes, pinch zoom, orientation, low-power context recovery. Automated WebKit and viewport changes are not substitutes.
- **Assistive technology:** VoiceOver/TalkBack/NVDA announcement/order and touch exploration. Automated keyboard and semantic inspection are not screen-reader certification.
- **Real low-end hardware:** initial scene parse, long navigation sessions, GPU/memory and battery behavior.
- **Release security decision:** nine inherited npm advisories remain; existing framework pins were preserved. No deployment is approved by completing the implementation.

Real Three.js is verified in both Chromium and WebKit, so an untested-renderer blocker does **not** remain. Implementation and local handover checks are complete; the qualifications above must remain visible instead of being called passed.

---

# Historical Phase 3 verification

Phase 3 is implemented locally and stops for owner review. Phase 4 is not started. No commit, push, publish, deployment, DNS or Cloudflare changes. Homepage/root layout/global CSS and both essays retain their Phase 2 hashes. Existing uncommitted work remains present.

## Evidence index

All paths below are relative to this document. Screenshots are actual rendered output, not static comps. Final Scrollcraft passes use the running Next route `http://localhost:3000/lab/thinkpad`.

- [Mobile contact sheet, 390×844](verification/phase-3/delivery-mobile/sheet.png), [machine report](verification/phase-3/delivery-mobile/report.json).
- [Desktop contact sheet, 1440×900](verification/phase-3/delivery-desktop/sheet.png), [machine report](verification/phase-3/delivery-desktop/report.json).
- [Reduced-motion contact sheet, 390×844](verification/phase-3/delivery-reduced/sheet.png), [machine report](verification/phase-3/delivery-reduced/report.json).
- [Production mobile opening](verification/phase-3/production/lab-mobile.png), [desktop opening](verification/phase-3/production/lab-desktop.png).
- [Modified stop-service result](verification/phase-3/review-interactions/mobile-peak-failed.png), [reduced-motion experiment](verification/phase-3/review-interactions/reduced-peak.png).
- [320px](verification/phase-3/review-interactions/viewport-320x640.png), [360px](verification/phase-3/review-interactions/viewport-360x640.png), [tablet](verification/phase-3/review-interactions/viewport-768x1024.png), [landscape](verification/phase-3/review-interactions/viewport-844x390.png), [text enlargement](verification/phase-3/review-interactions/text-enlargement.png).
- [Forced context-loss fallback](verification/phase-3/review-interactions/context-loss-fallback.png), [failed scene-chunk fallback](verification/phase-3/production/scene-chunk-failure.png). These are explicitly fallback screenshots, not claimed as 3D.
- [Interaction checks](verification/phase-3/review-interactions/results.json), [chapter entry/midpoint/exit records](verification/phase-3/review-interactions/chapter-positions.json), [production isolation/lifecycle checks](verification/phase-3/production/report.json).

Contact sheets and individual problem frames were opened and inspected. All delivery harness samples reported actual painted camera/object signatures, not loading/fallback signatures. Mobile/desktop/reduced each completed with no console errors or failed requests. No dead-scroll finding; sampled primary copy clears 4.5:1. This does not certify all accessibility or all devices. The untouched harness does not click experiments; modified-state evidence and behavior tests supplement it.

## Verified

- Lint: pass, excluding unchanged third-party skill source. TypeScript: pass. Production static export: pass; existing blog URLs/sitemap/robots included.
- Ten pure tests: immutable snapshots; stopping/restarting software; mount replacement and retained host file; earliest observable failure; remote route/permission/connectivity; isolated resets; display/host distinction; all 256 binary configurations; deterministic fast/reverse choreography; stable reduced-motion camera/layers; saved phone-location tracing; store unsubscribe.
- Browser interactions on development and production: song request; predicted/stopped service with NEW failure; restart/retry; old outcome survives edits; reset during finite replay; replacement/reconnection; away/home control labels; unavailable/permitted remote route; inspect/repair bounded fault; independent sandbox; 3D/lightweight result parity; display-off; permission and earlier connectivity failures; saved chapter edits after fast/reverse jumps; anchors, direct reload and browser Back.
- All seven beats sampled at entry/midpoint/exit. State changes inspected separately. Layouts checked at 390×844 first, then 320×640,360×640,768×1024,844×390 and 1440×900. No horizontal overflow. Short/narrow stages unpin; normal-flow controls remain reachable.
- Emulated touch swipe across canvas moves the document. No wheel/touch interception or pointer-lock controls. Forward and reverse keyboard sweep checks the actual topmost element over focus, not just whether a focus outline exists.
- In lightweight and reduced-motion modes, “Review saved request” opens saved settings; it does not offer an invisible replay.
- Enlarged text checked at 200% via test CSS; no horizontal overflow. This is not an OS/browser pinch-zoom certification.
- Unsupported WebGL, actual context loss and deliberately aborted dynamic scene chunk all leave working controls and useful output. Modified configuration and saved request survive context loss/import failure.
- No-JavaScript HTML contains every question and optional explanation; script-dependent buttons are disabled until hydration. No server calls or audio playback.
- Production homepage initial requests do not include the scene bundle and no canvas is mounted there. Existing blog routes, sitemap and robots return 200. Homepage content/layout/global CSS and essays are unchanged by hashes.
- On-demand frame counter stops when idle. Three repeated lab→home navigations return monitored global listener counts to the homepage baseline: document resize 1, document scroll 1, window popstate 1. Canvas and sc-ready are removed after departure. No unexpected production console errors.
- Final production scene bundle: 905722 raw bytes / 237901 gzip bytes. This is a file-size observation; no device performance score is claimed.

## Findings and fixes retained

1. **Initial local preview did not hydrate at 127.0.0.1:3000.** The already-running Next server allowed localhost and rejected the alternate dev-resource origin. Using localhost fixed it without global/config/domain changes. `mobile-first.png` records the initial pre-hydration diagram and is not a 3D success capture.
2. **Sticky occlusion confused the harness contrast sampling.** In the first `scrollcraft-mobile/report.json`, copy already covered by the stage was graded against the covering laptop pixels. Visible copy sat on paper. We made each cue's actual paper background explicit and reran the untouched harness; subsequent sheets/report confirm the real reading surface and clear contrast. No essential text was hidden, opacity-reduced or removed from grading. Supplementary computed rendered contrast: heading 13.93:1, annotation 5.65:1, text action 8.83:1 and primary button 8.83:1. See `verification/phase-3/production/rendered-contrast.json`.
3. **Reverse Tab could hide focused controls under the mobile scene.** `production/keyboard-initial-failure.json` retains the actual occlusions. The scoped focus handler now scrolls only covered reading controls beneath the sticky sibling. Final `production/report.json` records zero keyboard occlusions and unchanged listener counts.
4. **Remote-location button originally described the current direction incorrectly.** Corrected to “Bring phone home” while away and “Take phone away” while home, with a browser assertion. The request simulation itself was already correct.
5. **Object meaning needed stronger visual cues.** The initial scene had insufficient logical separation at phone size. The software lift was increased, projected HTML Software/Files labels added, and the rectangle labeled Home network. Files remain on the laptop side. No decorative animation or extra scroll distance was introduced.

Early captures remain as development evidence; `delivery-*` supersede their appearance. Runtime paths never reference verification files. They remain outside browser assets.

## Feel check

Intended: recognition → curiosity → surprise → clarity → relief → confidence → agency. Qualitative live-scroll observation: familiarity → attention → clear separation → procedure → distance → diagnosis → control. This is an author review, not user research or a measured emotional result.

The main discrepancy was clarity rather than surprise at the peak. The earlier unlabelled layers read as colored pieces; larger software separation and direct labels improve the distinction. The deliberate stop/request action supplies the contrast. It is intentionally not auto-triggered for a more dramatic contact sheet. The successful song passage stays quiet before it. The sandbox resolves into a held usable surface instead of fading into an empty CTA. It naturally takes more document room for eight controls; no filler was added merely to make the peak the longest section. Emotional strength and beginner comprehension remain points for owner/real-visitor review.

## Pre-existing findings and non-applicable tools

- npm audit reports nine advisories in unchanged pre-existing packages: Next (critical); sharp, postcss, nanoid, js-yaml, browserslist, brace-expansion (high); baseline-browser-mapping and @tailwindcss/postcss (moderate). All old lockfile package versions were compared against HEAD and remain unchanged. No unrelated audit-fix or framework upgrade was performed. Review these before deployment in Phase 4.
- Node's native TypeScript test imports emit a module-type inference warning; tests pass. The app's module/package conventions were preserved.
- Scrollcraft doctor: Node 26.3.0, full ffmpeg 490 filters, installed Chrome, Playwright resolution and workspace pass. Optional libwebp encoder missing. KIE key absent and not needed/authorized. No paid-media, video decoding, encoding or credit check claimed.
- Existing browser-extension Locator warnings/hydration attribute injection observed in the user's separate dev-browser logs are not reproduced in clean headless production contexts. Clean verification reports are kept separately.

## Phase 4 manual / follow-up checklist

- Owner reviews the actual opening, stop-service peak, reading density and sandbox before any further phase.
- Physical iOS Safari and Android Chrome: normal swipe over canvas, URL-bar expansion, orientation changes, pinch zoom, low-power behavior and context recovery. Desktop responsive resizing and emulated touch do not establish device support.
- VoiceOver/TalkBack/NVDA: landmarks/heading order, live request announcements, native disclosure/radio/checkbox behavior, focus recovery and user-selected text size.
- Real low-end hardware: initial dynamic scene parse, memory/resource cleanup after many navigations, visibility/offscreen behavior, thermal/low-battery conditions. No invented Lighthouse/FPS score.
- Confirm whether a wider beginner sample identifies software/files from the labels and understands that each chapter has a separate saved example. Review current-vs-recorded-state language when editing after a request.
- Review pre-existing dependency security advisories while respecting the existing-stack constraint; obtain a separate scoped upgrade decision if needed.
- Recheck all scroll/action/fallback tests after any changes, then only discuss deployment if explicitly requested. No deployment is authorized by this handoff.
