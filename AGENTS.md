# Portfolio working agreement

## Scope and approval

- Repository: `krishnanunnismenon/.in`, personal site `krishnanunni.in`.
- Read `PRODUCT.md` and `docs/portfolio-redesign.md` before work. The latter owns phase status and the explicit design selection record.
- Current scope is Phase 4, explicitly authorized for hardening, verification and handover. A — Field Notes remains approved. Finish the existing portfolio, including the requested persistent header on desktop/mobile; do not redesign it or implement other labs. Stop after handover without publication. Read `docs/thinkpad-scroll-story.md` and `docs/thinkpad-integration.md` for scene/simulation/lifecycle boundaries.
- The previous ThinkPad Lab appearance and old previews are rejected references. Do not reproduce them. Review/test any old logic before reuse.
- Preserve existing essays, frontmatter, slugs and URLs; no editorial changes without approval. Use the owner’s account with the qualifications in PRODUCT.md; do not invent metrics, dates, credentials, attribution or contact details.

## Repository safety and stack

- Check `git status --short` first; preserve uncommitted work. Do not reset, delete files, push, deploy, change DNS or modify Cloudflare.
- Keep Next.js 16.2.9, React 19.2.4, TypeScript, npm and `package-lock.json`. No unrelated upgrades. Explain any necessary dependency change before making it.
- `next.config.ts` uses `output: "export"` and unoptimized images. Keep static-export compatibility. `npm start` and `npm run preview` both serve the built export locally on port 4176; do not use `next start`.
- Preview files belong in `docs/previews/`, never `src/app` or `public`. They must say unapproved/static/nonfunctional and cannot substitute for the future 3D application.

## Commands

- Development: `npm run dev -- --hostname 127.0.0.1 --port 3000`.
- Checks: `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm test`, `npm run test:lab`, `npm run test:lab:browser`; production checks: `node tests/thinkpad/production.mjs`. Browser tools require installed Chrome. Use localhost:3000 for the existing Next dev server’s allowed origin.
- Basic export file preview: `python3 -m http.server 4174 --bind 127.0.0.1 --directory out` (use explicit `.html` URLs; clean-route navigation requires a host that resolves `.html`). For normal navigation use the dev server or the current local export server noted in the audit.
- Design comparison: `python3 -m http.server 4173 --bind 127.0.0.1 --directory docs/previews`.
- The committed lockfile is npm. Existing `node_modules` contains pnpm-layout symlinks and npm reports extraneous packages; do not clean or reinstall merely as an audit side effect.

## Verification expectations

- Separate source observations, rendered observations, assumptions and pre-existing failures. Record actual viewport sizes. Baseline lint, types and static build passed in Phase 1.
- For production changes after approval: check lint/types/build, existing blog index and both post routes, metadata/sitemap/robots, desktop/mobile layout, keyboard/focus, contrast, reduced motion, no-WebGL fallback and direct/deep navigation.
- For the lab: test native scroll/anchors/back, saved per-chapter edits, immutable request outcomes, explicit resets, keyboard focus beneath the bounded stage, reduced motion, lightweight parity, real WebGL and scene failure. Use Scrollcraft’s unmodified harness on the running Next route and inspect contact sheets; publish actual painted signatures. Check production homepage bundle isolation, listener cleanup and idle rendering. No continuous idle animation, drag-only controls or real server/API connection.
- Use meaningful behavioral checks for new logic; do not add tests merely to mirror copy/style edits. Keep baseline defects separate from regressions.
- No real service inventory, storage, backups, uptime, exact topology or hardware specifications may be inferred from an illustrative model.
