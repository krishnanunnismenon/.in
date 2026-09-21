# Krishnanunni — Field Notes

A narrow personal homepage, two authored essays, and an interactive ThinkPad lesson at `/lab/thinkpad`. Next.js statically exports the site; the simulation runs entirely in the browser. No API key, backend, account, audio stream, or connection to the real homelab is required.

## Install and run

Use npm and the committed `package-lock.json`. Verified with Node **26.3.0** and npm **11.16.0** on macOS arm64. Native TypeScript tests require a Node version with TypeScript stripping; use the verified version when reproducing the handover.

```sh
npm ci
npm run dev -- --hostname localhost --port 3000
```

The dev URL is `http://localhost:3000`. The existing Inter font is fetched by `next/font/google` during a clean build; allow access to Google's font hosts. Do not silently replace the font if that fetch fails.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

The production export is `out/`. `npm run preview` serves it at **http://127.0.0.1:4176** with clean routes, proper 404 responses and no directory listing. Use `PORT=4177 npm run preview` to select another local port. This is a local review server, not a deployment. `npm start` is an alias for this same export-preview command. `next start` is incompatible with `output: 'export'` and is not used.

## Browser verification

With the production preview running:

```sh
LAB_URL=http://127.0.0.1:4176 LAB_SHOTS=docs/verification/phase-4/interactions npm run test:lab:browser
npm run test:production
npm run test:handover
```

The scripts use installed Google Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`. The handover suite also uses Playwright WebKit. Install the matching runtime with `node node_modules/playwright-core/cli.js install webkit` when needed; set `WEBKIT_EXECUTABLE` only for a compatible runtime outside the expected cache. Do not substitute an older cached revision. Automated WebKit is not a physical iPhone test. The suite reports launch failures instead of treating unavailable WebKit as a pass. No browser packages are downloaded by these test scripts.

- `npm test`: simulation, choreography, immutable request records, and Markdown security/content preservation.
- `test:lab:browser`: experiments, reverse/fast scroll, anchors, emulated touch, responsive layouts, fallback, context loss, no-JS and reduced motion.
- `test:production`: scene isolation, keyboard occlusion, listener cleanup, saved state after failed scene loading.
- `test:handover`: Chromium/WebKit journeys, homepage hover/focus/in-view requests, sticky header, direct routes and metadata.

Scrollcraft's unmodified capture harness runs against the **Next dev route**, separately from production verification:

```sh
node .agents/skills/scroll-craft/scripts/doctor.mjs
node .agents/skills/scroll-craft/scripts/shoot.mjs --url http://localhost:3000/lab/thinkpad --out docs/verification/phase-4/scroll-mobile --width 390 --height 844
```

Use 1440×900 for desktop and add `--reduced-motion` for the stable-state capture. No paid generation, KIE credentials or video encoding are needed.

## Editing

| Content or behavior | Location |
| --- | --- |
| Public facts, contact, ordinary project metadata | `src/data/portfolio.ts` |
| Homepage structure / scoped styles | `src/app/page.tsx`, `src/app/Home.module.css` |
| Shared header, footer, reading shell | `src/components/Header.tsx`, `Footer.tsx`, `site/Site.module.css` |
| Shared palette, focus, type variables | `src/app/globals.css`, documented in `DESIGN.md` |
| Essays, frontmatter and slugs | `content/posts/*.md`; preserve existing URLs and authored wording |
| Markdown loading / sanitization | `src/lib/blog.ts`, `src/lib/markdown.ts` |
| Lab chapters and short explanations | `src/components/thinkpad/story.ts`, `ThinkPadExperience.tsx` |
| Simulation / saved request results | `src/components/thinkpad/simulation.ts` |
| Mobile/desktop camera and object positions | `src/components/thinkpad/choreography.ts` |
| Actual meshes, lighting, demand rendering | `src/components/thinkpad/ThinkPadScene.tsx` |
| Native scroll and cleanup | `src/components/thinkpad/scroll-bridge.ts` |
| Lab metadata / social preview | `src/app/lab/thinkpad/page.tsx`, `public/images/thinkpad-lab.png` |

The header remains visible while scrolling. Its measured height clears anchors and keyboard focus; the mobile scene unpins when insufficient reading space remains. The homepage never imports the renderer. Lab links explicitly disable prefetch; the dynamic scene loads after intentional navigation.

The lesson has separate scenario state per chapter and a separate sandbox. Scroll changes presentation, never experiment results. Full route reload starts a new session. There is no local-storage or query-string configuration to deserialize. Native hash links identify chapters; arbitrary fragments cannot set simulation state.

Markdown is rendered and sanitized at build time. Scripts, event handlers, embedded frames, active CSS and unsafe URL schemes are stripped; the two current essays render identically after equivalent quote-entity normalization. Keep Markdown/frontmatter authored and reviewed. This is not an untrusted-upload or CMS ingestion pipeline.

## Handover and publication

Read [QA](docs/QA.md) for exact results and limitations, [integration](docs/thinkpad-integration.md) for scene editing, [migration decisions](docs/portfolio-redesign.md), and [deployment/rollback](docs/DEPLOYMENT.md). The actual Scrollcraft skill and MIT license are retained under `.agents/skills/scroll-craft`; its source commit is recorded in [provenance](docs/scrollcraft-source.md). Integration is **Scrollcraft workflow and verification with a custom native-scroll bridge**.

Only `out/` is a website artifact. Do not serve the repository root. Internal design notes, tests, vendored skills and verification captures are intentionally outside `public/` and browser bundles. No source archive is required; if making one, exclude `node_modules`, `.next`, `out`, `.git`, credentials, local environment files, caches, and bulky `docs/verification` captures. Preserve the working lockfile and vendor license. Capture evidence can be shared separately.

Publication is not authorized by this handover. No automatic commit, push, PR, DNS, tunnel, hosting or deployment change is part of these commands.
