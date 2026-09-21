# ThinkPad scroll story

Status: Phase 3 authorized by the owner's supplied replacement brief, 2026-09-19. A — Field Notes remains selected; the homepage is outside this change.

## Brief and authority

Audience: “beginner first, detail on demand.” Desired experience: “learns everything through interaction instead of reading”; short selectable explanations still support accessibility. The source is the owner's account of self-hosting open-source services and music on a ThinkPad with Tailscale. All experiment configuration and the fictional track **Paper Boats** are illustrative, not a deployment inventory or packet capture. No real network calls, audio, telemetry, paid generation or video.

Eight brief topics: (1) object: the ThinkPad as an understandable system; (2) audience: curious beginners; (3) next action: “Follow a song”, with “Explore freely” equally available; (4) assets: approved Field Notes tokens, authored geometry, no supplied accurate laptop model; (5) art direction: deliberately simplified black laptop, paper ground, green logical relationships; (6) journey: request, stop, replace, connect remotely, repair; (7) peak: new request fails after service stops while computer/files survive; (8) constraints: native scrolling, mobile first, Next static export, no homepage changes. These are supplied requirements. Exact meshes, camera positions and flow dimensions are authored implementation decisions within that delegation.

## Grammar and fingerprint

**New grammar: an annotated experiment.** Normal-flow questions beside one persistent, bounded diagram stage, with per-question saved experiments and an independent sandbox at the end. On phones the stage sits above the current question. Chapter anchors form the navigation. The ending is an operable experiment, not a CTA. Bans: full-screen scrollers, invisible/crossfaded reading, compulsory sequence, scroll-triggered mutations, cinematic spacers and marketing chrome.

This is not stock Continuous world (which requires fixed copy/worldflight and a lone spacer), Split stage (two arguments resolving into a winner), or Chaptered editorial (dense title-page reading). Filmic one-shot prevents jumping; Live surface hands simulation state to scroll; Gallery catalogs objects; Typographic poster makes type the imagery; Rhythmic cutlist favors speed. None supports the required separation of reading, scrolling and experimental causality without changing its constraints. The annotated-experiment grammar explicitly prioritizes that separation.

Registry checked before markup: `scrollcraft/FINGERPRINTS.md` was empty; no prior rows to compare. Planned fingerprint: annotated experiment / wrapping chapter anchors / actual laptop-phone composition / seven short natural-flow beats with bounded stage / separate sandbox / stop-service request failure with retained files. No arbitrary length or four-device quota overrides the owner's brief.

## Feeling curve, before the score

- Recognition: familiar phone and laptop, already present.
- Curiosity: a tiny request reaches software, then a stored song.
- Surprise (the one peak): stopping only software breaks a NEW request; the laptop and folder remain.
- Clarity: replacing software leaves the deliberately external folder; reconnecting its mount restores access.
- Relief: the remote phone can reach the same files after a permitted private route is enabled.
- Confidence: inspect a missing mount, repair it, test the explanation.
- Agency: change the independent sandbox and ask another question.

Tell-someone sentence: “It is the site where I stopped the music software and the laptop still worked, but my next song request could not.” Silence before the peak is a settled successful request, not an empty viewport. The peak gets the richest authored layer separation and prediction/action/result space; it needs no artificial scroll padding. The close holds a working sandbox.

## Layer contract

Far: paper, no moving atmosphere. Mid: thin home-boundary rectangle, spatial reference only. Focal: charcoal ThinkPad with hinge, keyboard, red pointing stick and independently powered display; laptop parts remain connected. Near: phone and conceptual response marker. Logical layers: green service tile and pale media folder lift from the host but are explicitly labeled a diagram, not actual internals. Files remain on the host side. HTML labels/questions never sit on top of moving geometry. There are no baked-in instructional words, generated assets or orbit controls.

## Scroll score

| Chapter / question | Objects and opening → midpoint → exit | Scroll-driven change | Explicit action and result | Mobile / reduced motion |
|---|---|---|---|---|
| Opening: A laptop. A server. The same machine. | Phone near complete laptop → gentle establish → settles above first question | Small camera establish only | Follow a song anchor or Explore freely anchor | Portrait-specific camera; stable opening under reduced motion |
| A: Where does a song come from? | Whole laptop/phone → service and folder separate → conceptual response returns; stored file stays | Trace scrubs immutable latest request, or labeled untouched example | Request Paper Boats records snapshot and outcome; optional replay is separate playback | Compact top stage, HTML trace and outcome; reduced motion uses stepped trace |
| B: What stops when the music service stops? | Whole host → separated computer/service/folder → held comparison | Wider logical separation around stopped tile; never auto-stops | Predict, stop service, NEW request fails at service; restart/retry succeeds | Visible labels identify host on, service stopped, file intact; no camera travel in reduced motion |
| C: Can new software use the same files? | Folder on host → mount relationship exposed → folder/service in separated planes | Reveal mount segment; folder anchored to host | Replace example service disconnects mount only, request fails; reconnect/retry restores song | Same short controls and evidence, static exploded layout in reduced motion |
| D: What changes away from home? | Home rectangle contains host → remote phone separated → route drawn across boundary | Camera widens and boundary becomes visible; files remain home | Move phone, local-only failure; enable available Tailscale example, retry; permission/connectivity remain required | Portrait phone moves sideways within safe bounds; static remote composition in reduced motion |
| E: Where did this request stop? | Host/service/folder → visible failed route to missing mount → held diagnostic | Reframe relationship at fault, not a new decorative effect | Request, inspect evidence, reconnect folder, retry; reset bounded example | Evidence before repair, no precision manipulation |
| Sandbox: Your turn. Change one thing. | Coherent overview → same overview → holds | Intentional resolved hold; state changes only by controls | Host/service/display/mount/file/location/connectivity/Tailscale/permission and request/reset | All controls flow in document; lightweight view runs identical logic |

## State and lifecycle contract

Narrative progress is a small external store measured from cached document offsets. Passive scroll schedules one update; ResizeObserver refreshes layout after disclosure/viewport changes. Each frame is deterministic from chapter/progress plus simulation and optional finite replay. No simulation action is dispatched by scroll. Every chapter owns a preset and preserves edits until its Reset example. Sandbox is separate. Requests freeze state and computed evidence. Subsequent edits cannot rewrite recorded outcomes. New requests replace playback tokens; reset/chapter change/mode switch/unmount cancel finite playback. No delay can commit a stale result because results are computed synchronously on explicit requests.

Earliest failure: device disconnected; no remote route; private-route access denied; host unreachable; service unavailable; missing mount; missing file; response. A client failing at connectivity gets no downstream claims. Live object labels explicitly describe the illustrative configuration, separate from request evidence.

## Scrollcraft integration decision

Source `nateherkai/scroll-craft`, commit `0b816225945e45380397d6a0487efa3c98916858`, MIT, copyright 2026 Nate Herk. Complete folder copied unmodified into `.agents/skills/scroll-craft/`, root LICENSE included. Inspected doctor/workspace/shoot scripts and runtime. `mount()` returns layout/read/acts/worlds/clips/lerp with no destroy; anonymous global scroll/resize/focus listeners and recurring RAF loops cannot be reliably torn down by the caller. CSS writes root/body/global reset styles. Neither runtime nor CSS is imported.

**Scrollcraft workflow and verification with a custom native-scroll bridge.** Skill-derived: brief, grammar/fingerprint, feeling curve, layer contract, deliberate peak/end, separate mobile compositions, per-act contact sheets and actual painted-state signature. Project adaptations: server-rendered React chapters, native flow and bounded sticky stage, on-demand R3F real meshes, immutable experiments, approved tokens instead of stock palette, no media-generation pipeline. `sc-ready` is a lifecycle-scoped verification readiness signal only. Actual painted camera/object/marker values populate `data-sc-verify-state` after rendering; only reduced-motion/settled explanation/close holds are marked.

Token roles: canvas→paper, surface→wash, ink→ink, ink-soft→muted, accent→accent, accent-ink→paper. Georgia + existing Inter. Error/pointing-stick detail uses existing rust focus family. No global design changes.

## Verification plan

Pure behavior tests plus real-browser route tests. Scrollcraft shoot on the running Next route: 390×844 first, 1440×900 and reduced motion, six samples per act. Supplement with actual experiment modifications and 320/360/tablet/landscape, anchors/back/reverse/fast scroll, keyboard/text zoom, simulated touch, no-WebGL/chunk failure, repeated navigation/idle checks. Screenshots must identify actual WebGL vs fallback. Physical iOS/Android and assistive technology require later manual verification; browser resizing does not certify them. Retain reports, inspect contact sheets, and record cold feel comparison in QA notes.
