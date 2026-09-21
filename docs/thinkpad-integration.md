# ThinkPad integration and editing guide

Implemented in Phase 3; hardened and verified in Phase 4. No deployment. Use **Scrollcraft workflow and verification with a custom native-scroll bridge** when describing this integration. The stock Scrollcraft runtime is not mounted or imported.

## Boundaries

- `src/app/lab/thinkpad/page.tsx`: Server Component, route metadata, real-setup attribution, shared header/footer. The client lesson still prerenders all chapters and explanations to HTML.
- `src/components/thinkpad/ThinkPadExperience.tsx`: semantic controls, per-chapter reducer state, finite replay, route-scoped dynamic import with `ssr:false`, error boundary, lightweight view, keyboard focus correction.
- `story.ts`: chapter titles, short introductions and scene captions. Deeper disclosures remain beside their corresponding controls in the experience component. Public personal facts remain in `src/data/portfolio.ts`.
- `simulation.ts`: pure presets, transitions, earliest-observable-failure evaluation and frozen request snapshots. It has no browser, scene or network dependency. Neither mode gets a separate simulator.
- `scroll-bridge.ts`: one native-scroll observer bridge, cached chapter offsets, ResizeObserver for changing content, passive scroll, visibility and preference changes. Teardown removes listeners, observers and scheduled RAF. Only chapter changes reach React; progress notifies the demand renderer outside React.
- `choreography.ts`: deterministic chapter/progress/configuration-to-pose function. Edit mobile and desktop positions here. Reduced motion fixes the composition and steps the trace; it never mutates a scenario. Explicit controls can select the matching chapter when two questions share a viewport.
- `ThinkPadScene.tsx`: actual Three meshes via React Three Fiber. A single priority-one frame handler applies the pose, paints, then writes the verification signature. It caps DPR at 1.5, uses demand rendering, avoids offscreen/hidden paints, and relies on R3F disposal on canvas teardown. No model textures, remote asset fetches, physics, orbit/drag controls or perpetual animations. HTML annotation positions are projected from the same painted points.
- `ThinkPadExperience.module.css` and route CSS: all lab composition. No global stylesheet/runtime changes. At 900px the scene and document form two columns; below that the scene sits above normal-flow questions. At height ≤600px or width ≤350px it unpins. Safe-area top is respected. All important controls have at least 44px target height.

## State semantics

Each chapter owns a preset. Entering/revisiting changes which example is illustrated, not its settings or result. Edits survive chapter navigation; Reset example replaces only that chapter. A full route reload starts a new lesson; no private settings or learning history are persisted to storage. Sandbox is a separate scenario.

Requests complete synchronously in the illustrative evaluator, with monotonic IDs and immutable settings/results. “Replay saved request” is finite illustrative playback, never another request. In lightweight/reduced-motion modes the control becomes “Review saved request” and opens the saved settings instead of offering an invisible animation. New requests, edits, resets, chapter changes, mode changes and unmount cancel its timer token. Scroll in the song chapter traces its latest saved request or an explicitly labeled example. Original media remains associated with the host folder. Current configuration labels are distinct from saved request evidence.

The replacement action intentionally disconnects a mount without deleting host media. This example says nothing about all container data, backups or the owner's real storage layout. Display-off is distinct from host-off. Remote reachability has no alternate public route in this model; connectivity and private access permission precede downstream service/file claims.

## Scrollcraft provenance and adaptations

See `scrollcraft-source.md` for source commit and MIT license, and `thinkpad-scroll-story.md` for the plan written before coding. The complete skill is in `.agents/skills/scroll-craft/`; it is development material and stays out of `public` and the runtime graph. The resolved workspace is `scrollcraft/`; its build brief points to the maintained story document.

Upstream planning grammar/fingerprint/feeling/peak/layer methods and unmodified `shoot.mjs` are used. A project-specific annotated-experiment grammar honors normal-flow reading and independent simulation. Filmic/worldflight defaults, palette, global CSS, paid generation and video are not applicable. Stock `mount()` has no destroy and installs global listeners/RAF, so it was reviewed and rejected for this route lifecycle. Vendor source was not patched.

`html.sc-ready` is added only while the route bridge exists for the unmodified harness. It is removed on teardown. `data-sc-verify-state` records rounded camera, object and marker values after a real paint, plus actual object state. It is not raw scroll progress. `data-sc-verify-hold` marks reduced-motion states, bounded settled explanations, the static mobile opening and the sandbox. Lightweight mode reports its displayed configuration and a deliberate static hold. Reports must distinguish the renderer mode.

## Dependencies

Required new runtime packages: `three@0.186.0`, `@react-three/fiber@9.7.0`. Its registry peer range supports the existing React 19.2.4. Dev-only: `@types/three@0.186.0`, `playwright-core@1.63.0`. Existing Next 16.2.9/React 19.2.4/TypeScript/npm retained; existing lockfile package versions were not upgraded. No GSAP, Lenis, Drei, design system or second animation engine.

The production scene bundle is roughly 906 kB raw / 238 kB gzip in this build, downloaded only after entering the lab. These are local file sizes, not a measured network or device performance score. First-time parsing is the primary remaining device-performance risk; the explicit lightweight view also handles low-power or unsupported devices.

## Commands and evidence

- `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- `npm run test:lab` (Node with native TypeScript stripping; verified on Node 26.3.0).
- `npm run test:lab:browser`, default `LAB_URL=http://localhost:3000`; `LAB_SHOTS` changes output directory.
- `node tests/thinkpad/production.mjs`, default `LAB_URL=http://127.0.0.1:4175`, against the actual static export with clean-route resolution.
- `node .agents/skills/scroll-craft/scripts/doctor.mjs` and `workspace.mjs --ensure`, run from project root.
- `node .agents/skills/scroll-craft/scripts/shoot.mjs --url http://localhost:3000/lab/thinkpad --out docs/verification/phase-3/scrollcraft-desktop --width 1440 --height 900`.
- Mobile: width 390 height 844. Reduced: same plus `--reduced-motion`. These three use the RUNNING NEXT route, not the export server.

The existing Next dev server is bound to localhost:3000. Its dev-origin guard rejected 127.0.0.1 for JS resources in the first attempt; using its configured localhost origin fixed hydration without changing production/domain configuration. The separate existing export preview is 127.0.0.1:4175. See `QA.md` for findings, actual test coverage and physical-device limits.


## Phase 4 navigation and header notes

The shared sticky header measures its height into `--site-header-height`. The lab bridge measures that header and stage together and sets `--lab-clearance`; it unpins the stage when reading space would be too small. Both observers clean up. Focus correction is keyboard-only so it cannot move WebKit pointer targets mid-click.

Use Next `Link` for chapter anchors and preserve `prefetch={false}`. Plain fragment history can have null state; this installed router ignores it after leaving the route, causing a URL/content mismatch on Back. The public anchors and normal document scrolling remain unchanged. Production preview/testing now uses the repository-owned `npm run preview` on port 4176. Read Phase 4 in `QA.md` for superseding results.
