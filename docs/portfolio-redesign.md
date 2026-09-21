# Portfolio redesign — Phases 1–3

Audit date: 2026-09-19. Owner: Krishnanunni. Product authority: `../PRODUCT.md`.

## Phase status and approval record

| Phase | Status | Boundary |
| --- | --- | --- |
| 1 — Audit and choose a direction | Complete; **A selected 2026-09-19** | Static comps informed the approved direction |
| 2 — Minimal homepage | Implemented; preserved during Phase 3 | Owner explicitly continued with the replacement Phase 3 brief |
| 3 — ThinkPad scroll experience | **Implemented locally; awaiting owner review** | Scrollcraft workflow, real Three.js scene, independent experiments and lightweight view |
| 4 | Hardening and handover | Owner authorized 2026-09-20. Focused fixes and verification complete locally; hosting details/manual device checks and dependency remediation remain explicit release qualifications. No deployment authorized. |

**Selected direction: A — Field Notes.** Approved on 2026-09-19. Owner’s selection: “Lets go with A - Field Notes, don't use lot of text, make sure the person using the website learns everythign through interaction instead of reading”. Accepted corrections: approximately 620px homepage shell from the Phase 2 brief; short first-person copy; learning through labeled, accessible reveals; essential text stays available without canvas or JavaScript. The original static ThinkPad explanation was Phase 2; the explicitly authorized replacement Phase 3 brief now adds the interactive scene. B is not approved. Existing comps remain historical composition studies rather than finished UI.

Confirmed clarification: beginner first, with technical detail on demand. No additional personal facts were inferred.

## Repository identity and boundaries

- Workspace: `/Users/krishnanunni/Documents/Akhara/krishnanunniPort`.
- Origin: `https://github.com/krishnanunnismenon/.in.git`; branch `main`; audited HEAD `cdb1146`.
- Initial `git status --short`: empty. No uncommitted work at entry. Existing ignored build folders and installed dependencies were retained.
- No applicable ancestor/root/nested AGENTS.md was found before creating the requested root file. No tracked product/design notes, resume, lab, or old preview files were found. README is the create-next-app starter, including an inaccurate Geist reference (the code uses Inter).
- Inspected all files in `src/app`, `src/components`, `src/lib`, both markdown posts, package/lock/config files and public asset inventory. No rejected design was used as visual authority. No old lab logic was available to reuse or test.
- Only `AGENTS.md`, `PRODUCT.md`, this document and `docs/previews/` are authored Phase 1 additions. No production source, essays, package declarations, lockfile, DNS, Cloudflare or remote deployment was changed. No files were reset or deleted, and no commit or push was made.

## Stack and operational audit

| Item | Repository evidence | Consequence |
| --- | --- | --- |
| Next.js / React | Next 16.2.9; React and React DOM 19.2.4 | Retain installed framework versions |
| TypeScript | Strict configuration; lock resolves 5.9.3 | Keep TypeScript and existing aliases |
| Package manager | Committed `package-lock.json`, lockfile v 3; no committed competing lock | Use npm; do not introduce pnpm/yarn/bun locks |
| Installed tree | Direct dependencies resolve correctly; node_modules includes pnpm-layout symlinks and many npm “extraneous” entries | Pre-existing local install drift; no cleanup/reinstall in this phase |
| Styling | Global CSS, component CSS modules and substantial inline styles; Tailwind packages installed but not used by current styles | Keep CSS modules; consolidate only when approved implementation needs it |
| Blog | gray-matter 4.0.3; marked 18.0.5 | Retain local markdown workflow |
| Output | `output: "export"`, `images.unoptimized: true` | Keep static hosting; future lab must be a browser-side island, not a runtime server |
| Fonts | `next/font/google` Inter, Latin subset | Existing font is usable; build can require font download/cache. No font/dependency added in Phase 1 |
| Commands | dev/build/start/lint; no test script | Use lint/types/build and targeted browser checks. `next start` is not the static-export preview command |

Runtime used: Node v 26.3.0, npm 11.16.0. Baseline commands ran against existing dependencies; this was not a fresh-install reproducibility audit.

### Baseline verification and pre-existing failures

| Check | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npx tsc --noEmit` | Passed |
| `npm run build` | Passed; exported homepage, blog index, both post routes, not-found page, icon, robots and sitemap |
| Local dev rendering | Homepage at 1440×900 and 390×844; mobile writing index; article at 390×844 and 1440×900 inspected |
| Live site | `https://krishnanunni.in` redirects to `https://www.krishnanunni.in/` in browser; desktop and 390×844 mobile homepage inspected; same visible copy/layout as local source |
| Existing browser warning | Next reports `personal.png` as LCP without eager loading, despite it being the back of the flipping image. Record as a baseline loading issue; no performance benchmark measured |
| Accessibility defects | Mouse/touch-only photo flip; absent homepage main landmark; low-contrast supporting text; no reduced-motion alternative for flip |
| Tool limitations | Text-fetch tool could not access live homepage, but browser inspection succeeded. LinkedIn profile returned HTTP 999. Local shell networking/binding required local-server permission; these are environment limitations, not site failures |

No existing compilation, lint or type failure was found. Accessibility/design issues below are pre-existing findings, not introduced regressions. No Lighthouse score, real-device performance result or assistive-technology certification is claimed.

## Source and rendered audit

### Homepage

`src/app/page.tsx` renders Header → Hero → ProfileCard → NowSection → SelectedWork → WritingSection → ElsewhereSection → ContactSection → Footer in a 620px shell with 28px side padding. Its top-level wrapper is a div, not a main landmark. Header and hero use separate “Software Engineer” and “Technical Lead” labels; proposed copy will use the supplied “full-stack developer” and “Team Lead at chargeMOD”.

The live/local rendered page is calm and readable, with a restrained off-white surface and a single column. The opening viewport is dominated by a slogan and 330px portrait; substantive work is below the first screen at both inspected sizes. Section gaps repeat at 64px, header bottom margin is 100px, and photo hint adds another 92px. Minimalism is valuable, but the sequence postpones the reason to explore. No gross horizontal overflow was observed on the inspected homepage. Global `overflow-x: hidden` can conceal defects and should not substitute for layout validation.

`ProfileCard` is the only existing homepage client component. It changes state on a div’s click/hover handlers, with no button semantics, tab stop, keyboard handler or reduced-motion rule. Both image descriptions appear in the accessibility tree even when one face is visually hidden. If retained after selection, it needs a real button and explicit accessible state; replacing it with a small static portrait or omitting it is also reasonable. Both concept homepages currently omit the portrait.

Calculated WCAG contrast against `#fbfbfa`: section labels/dates/footer `#a3a09b` ≈ **2.52:1**; descriptions/header `#8a8782` ≈ **3.46:1**; body secondary `#6f6c67` ≈ **5.05:1**. The first two fail the 4.5:1 threshold for ordinary small text. Hover opacity reductions can lower contrast further. Existing links rely on browser focus behavior; no intentional shared focus treatment exists.

### Writing and content loader

`src/lib/blog.ts` reads local `.md` files synchronously, parses gray-matter and marked, sorts descending by date and returns HTML. `getAllPosts()` parses bodies even when the homepage only needs titles; small scale makes this low urgency. Frontmatter is not schema-validated; missing values silently become empty strings. Unknown posts return null; the route calls `notFound()`.

`/blog/[slug]` uses async params, `generateStaticParams`, per-post title/description and server-rendered article HTML. Both existing article URLs are statically generated. `/blog` and the article have main landmarks and inherit Header/Footer. The first article was visually inspected on desktop and mobile; both articles were read in source and compiled in the build. The second article was not separately browser-tested. No rewrite of wording, dates, summaries, headings or essay claims is authorized.

`marked` output is inserted through `dangerouslySetInnerHTML`. Current input is owner-controlled local content; this audit does not assert an active exploit. Preserve that trust boundary. If a future CMS or untrusted source is added, HTML sanitization and frontmatter validation become required. Post CSS styles headings, code, lists and quotes, but supplies no dedicated prose link treatment, image sizing or table overflow handling. New content types should be checked when introduced.

### Metadata and discovery

Root layout supplies title, description, keyword list and English language. It lacks metadataBase, explicit canonical URLs and Open Graph/Twitter metadata. Blog posts supply their own title/description; blog index inherits homepage metadata. Sitemap lists `/`, `/blog` and both posts. Root/index lastModified is build time, not a content edit date. Robots allows crawling and points at the apex sitemap URL.

Browser redirect to `www` versus apex URLs in sitemap needs an explicit canonical policy later. Do not change DNS/hosting to resolve it. Add `/lab/thinkpad` to metadata/sitemap only when the real route ships. Preview files are outside Next’s app/public trees and carry `noindex,nofollow`; they are not included in the export.

### Assets and existing lab

- `headshot.png` ≈1.2MB; `personal.png` ≈1.1MB. Static export bypasses image optimization, so these are relatively heavy for a 330px display. Preserve originals; consider additional appropriately sized formats after approval.
- `src/app/icon.png` ≈324KB; inspect an optimized replacement if needed later.
- Public SVGs `file`, `globe`, `next`, `vercel`, `window` are starter assets; no homepage references found. No deletion in Phase 1.
- No lab route, Three.js dependency, model asset or guide state machine exists in the audited source. The public model and actual setup cannot be inferred from these files.

## External reference checks

These are reference checks, not independent audits of career or achievement claims.

| Reference | Observed evidence | Allowed use / limit |
| --- | --- | --- |
| [GitHub profile](https://github.com/krishnanunnismenon) | Accessible; lists PromptWars and ArunJuke; ArunJuke summary names rebranding | Supports account and project linkage; does not prove original authorship |
| [LinkedIn profile](https://www.linkedin.com/in/krishnanunnii/) | Text fetch HTTP 999 | Current role/history rely on the owner’s supplied account |
| [PromptWars repository](https://github.com/krishnanunnismenon/promptwars) | README identifies Still Here / Anchor, Gemini-based features and a PromptWars hackathon submission | Supports a brief project reference; no independent runtime, clinical or safety verification was performed |
| [LinkedIn activity](https://www.linkedin.com/feed/update/urn:li:activity:7491463773229076480/) | Owner describes Gemini API, heavy AI assistance and First Runner-Up | Award is supported as a public self-reported account, not independently checked against organizer results; do not infer exact event dates from relative timestamps |

Do not promote README claims about real-time behavior, safeguards, coverage or accessibility into verified portfolio outcomes. Neither visual proposal needs award detail to work.

## Content migration map — proposed, not executed

| Existing item | Proposed destination/action | Reason and condition |
| --- | --- | --- |
| Header title, hero slogan, “Technical Lead” specialization | Plain personal introduction; “full-stack developer” / “Team Lead at chargeMOD” | Replace generic/overbroad positioning with supplied facts after approval |
| Large flipping portrait | Optional small static image in About, or omit from homepage | Earlier access to work; not a requirement to retain the component |
| Now / “owning the full stack” | Brief chargeMOD context, with precise contribution list in About if wanted | Avoid implying sole ownership of charging infrastructure |
| SelectedWork technology list | One prominent ThinkPad invitation; short chargeMOD context | Explain something before listing tools |
| `eleven-hack` | Hold from proposed featured content pending identity/contribution confirmation | Current description is too generic to support an explanatory story; no source or repo deletion |
| ArunJuke | Possible detail inside Music: adaptation of an existing open-source client connected to own server | Name upstream/license and actual changes before a detailed claim; no original Flutter build claim |
| Still Here / Anchor | Optional later brief project note with repo/source links and hackathon-prototype framing | Public references checked; detailed award and outcome claims omitted from current comps |
| Existing two essays | Same `/blog` routes, same markdown/frontmatter; titles retained on both comps | Editorial content remains the owner’s |
| Elsewhere and Contact | Compact footer with the same email/GitHub/LinkedIn | Preserve intentionally published contact details |
| Education and learning | Short About section if wanted | No invented graduation year |
| Mentoring/workshops | Hold detailed mentoring/event counts for confirmation; exclude undelivered workshops | Prevent scope and delivery inflation |
| New ThinkPad experience | `/lab/thinkpad` | First deeper interactive explanation; illustrative vs actual distinctions visible |

Suggested longer chargeMOD copy, for later review: “At chargeMOD, I work across the React console, APIs, membership logic and charging integrations. I led our UBEC/Beckn integration by reworking a supplied OCPI adapter through testing, certification activities, UAT and production setup.” Do not publish internal partner or certification details without confirmation.

## Two visual proposals

Open [the local comparison](http://127.0.0.1:4173/index.html), or serve `docs/previews/` using the command in AGENTS.md. The comparison has desktop (1200px) and mobile (390px) compositions for both homepages and both lab openings, plus full-preview links. The files are independent of the production application and can also be opened locally.

**Fidelity:** responsive HTML/CSS compositions with geometric SVG model studies. They are explicitly **unapproved, static and nonfunctional**; lab buttons are disabled. Comparison controls and preview-to-preview navigation work. They do not implement a renderer, guide state, audio, camera controls, networking, real data or any eventual 3D experience. No old preview/code supplied the design. Both use the same new simplified object study to compare the surrounding experience fairly.

### A — Field notes (recommended)

**Thesis:** a personal reading page opens into an annotated explanation. The illustration supports a sentence the visitor can understand. The homepage is Read; the lab mixes Read with Experience.

**Visual grammar:** a narrow continuous reading column, literary heading treatment, ordinary readable body type, open margins, restrained rules and annotations that connect directly to the subject. The proposed pale surface supports sustained reading and a dark laptop silhouette; muted green identifies the explanatory path. Georgia/system sans in these comps are available stand-ins, not an imposed font purchase or final brand token. Contrast and hierarchy matter more than the particular hue.

**Homepage copy:** “I’m Krishnanunni.” / “I build software at chargeMOD, where I’m a Team Lead. At home, I run open-source services on a ThinkPad.” / “This is a place to share what I’m working on—and explain how it works.” Feature: “A laptop, a little server.” / “My music lives on my ThinkPad. Follow a song from the server to a listener, then look around.” Action: “Explore the ThinkPad”. Existing essay titles and contact follow.

**Homepage composition:** desktop uses a 780px maximum outer column, with the small laptop beside the invitation; mobile uses 23px margins, stacks prose and invitation, and removes the decorative thumbnail to reach the link sooner. No large portrait, marketing slogan or credential grid.

**ThinkPad opening copy:** “A laptop, a little server.” / “I use a ThinkPad to run open-source services and host my music. Here’s a small tour of what that means.” Actions: **Follow a song** and **Explore freely**. Reassurance: “You don’t need to know what a server is. We’ll start with pressing play.”

**Lab composition:** desktop places a short introduction at left and annotated laptop at right, then guide text in the ordinary page flow. Mobile puts both actions before the model, then labeled topics and explanation beneath it. No sticky page-sized canvas or nested text scroller. The text always remains readable independently of the object.

**Signature interaction, proposed:** pressing “Follow a song” traces one request from a player to the ThinkPad, then the response back. Three manually advanced stops explain client, server and remote access. Each step changes one annotated relationship. The line moves once only on the visitor’s action; reduced motion reveals the complete path instantly. In free exploration, labeled topic buttons open the same explanations without sequencing. A Tailscale explanation must distinguish private device access from public sharing and avoid implying a guaranteed direct connection or measured speed.

**Trade-off:** excellent continuity with writing and beginner comprehension, but less immediate spectacle. Can feel like an illustrated article if the interaction merely decorates text; each action must reveal a relationship the static text alone does not show.

### B — Object room

**Thesis:** the homepage is a short index of things the owner can explain. The lab becomes a quiet room occupied by one object, with selected explanations below it. Homepage is Read/Experience; lab is Experience.

**Visual grammar:** asymmetric desktop identity/index columns, simple sans typography and large separation between a few meaningful entries. The lab changes scale and luminance: a dark stage with a large matte laptop, visible labeled selection points and a grounded caption area. The pale display is a working surface, not a glow effect. Neutral homepage and dark object backdrop establish a transition of space; these are provisional choices, not a required dark theme.

**Homepage copy:** “Krishnanunni” / “Full-stack developer. Team Lead at chargeMOD.” / “I like making useful things—and making them easier to understand.” Index: “A few things I can show you around.” Feature: “The laptop that serves my music” / “A small, explorable look at self-hosting.” Secondary context: “Connecting EV charging systems” / “At chargeMOD, I work on APIs, membership logic and charging integrations.” This second item is explanatory text, not a link to an unbuilt case study. The preview’s “no case-study link yet” note is review context; production copy should omit it.

**Homepage composition:** desktop uses a 260px personal column beside an open work/writing index. Mobile reorders into identity → short invitation → ThinkPad → chargeMOD → writing → contact. Larger clickable text and fewer nested content units make the index easy to skim. The longer mobile homepage is a deliberate trade-off relative to A.

**ThinkPad opening copy:** “Meet my ThinkPad.” / “A laptop running open-source services and my music. Pick something to see what it does.” Actions: **Take the short tour** and **Explore freely**. Reassurance: “Three stops. Leave the tour whenever you like.”

**Lab composition:** desktop gives most horizontal space to the laptop; the introduction/actions occupy a quiet side column and the explanation spans the bottom. On mobile, introduction and both actions precede a compact model, with the explanation in normal flow. Topic buttons duplicate hotspots so users never have to drag or hit a small point.

**Signature interaction, proposed:** select Music, Services or Access. The object turns only enough to frame the selected topic; its screen/nearby schematic changes and a stable caption explains the relationship. A subtle selected state connects topic, model and text. A manual three-stop tour uses the same selections. Motion is short and user-triggered, with immediate transitions under reduced motion; there is no orbiting idle model or boot sequence.

**Trade-off:** makes the laptop memorable and rewards curiosity, but requires stronger 3D art direction and selection feedback. Hotspots must not suggest that software/networking literally lives in a particular physical part of the laptop. Text labels and equivalent buttons carry meaning, not arbitrary geometric placement.

### Recommendation and durable decisions

Recommend **A** because the owner’s priority is understanding, the audience is beginner first, and the existing essays already support a reading-led identity. B is materially different in homepage topology, spatial hierarchy, entry behavior and explanation placement; it is not just a palette swap. Either keeps a minimal home and permits a more expressive inner page.

Choose the relationship between reading and exploration first. Final font, palette and camera geometry are revisable within the chosen direction. No DESIGN.md with supposedly approved tokens is written before selection.

## Proposed routes and component boundaries

All names below are a plan, not implemented files.

| Route | Plan |
| --- | --- |
| `/` | Server-rendered personal introduction, ThinkPad entry, concise current-work context, existing writing list and published contact links. Optional About anchor, not a new route by default |
| `/blog` | Preserve route and loader; adjust only shared shell/contrast when approved |
| `/blog/[slug]` | Preserve both existing URLs, article body/frontmatter and metadata behavior; improve shared reading styles without editorial changes |
| `/lab/thinkpad` | New static-exported page with indexable intro, textual explanation and a small client-side interactive island |
| `/lab` | Not required for a single experience; add only when multiple experiences justify an index |
| Future work explanations | No speculative routes, links or “coming soon” cards shipped before real content exists |

Possible organization: `src/components/site/{SiteHeader,SiteFooter,ReadingShell}`, `src/components/home/{Introduction,ExperienceEntry,WritingList}`, `src/components/lab/thinkpad/{ThinkPadExperience,ThinkPadScene,GuideControls,TopicButtons,Explanation,SceneFallback}`, plus a typed `lessons.ts` and a small pure transition module. Keep article loader server-side. Keep canvas/renderer imports out of the homepage and shared layout. Existing components can be adapted or replaced; the selected direction determines which.

### Shared experience behavior for later phases

- Initial state has readable intro, model poster/fallback, three named topics and both guide/free-explore actions. No mandatory tutorial or load gate.
- Guide: three short steps; next/back, exit to explore, restart. Free exploration is available immediately, without completion prerequisites. Preserve selected topic when leaving the guide unless the user intentionally resets.
- Topic selection updates a visible heading and explanation; keyboard controls have clear focus and stable reading order. “More detail” is optional and should not be required for the basic lesson.
- Renderer loading, load failure, no WebGL, context loss and reduced motion all retain the same explanation and topic controls. No renderer failure may blank the page. Render on demand/interaction, stop when hidden, and avoid continuous decorative animation.
- Artistic geometry: recognizable black shell, deliberately reduced keyboard forms, a red pointing-stick accent and a simple display. No exact ThinkPad model/spec claim, photorealistic ports, fabricated internals or unnecessary mechanical detail. No live dashboard, uptime, backups, addresses, credentials or playback from a real server.
- Direct links to topics should have a readable default and not require a boot/tour. Decide URL-state behavior in Phase 2; do not make speculative server routes.

### Dependencies and validation plan

No dependency was added. The current stack has no 3D renderer. When the selected design reaches actual 3D implementation, a renderer such as Three.js would be justified for camera/mesh work; a React wrapper is optional, not automatic. Compare compatibility, loading cost and maintenance before proposing an exact dependency/version. Keep any new renderer lazy and restricted to `/lab/thinkpad`; preserve static export and do not upgrade Next/React incidentally. The SVG studies here are not an alternative implementation of the requested 3D experience.

Later acceptance checks: baseline lint/types/build, unchanged essay hashes/content, exported routes and metadata, 320/390px mobile and wide desktop, keyboard-only guide and exploration, normal scrolling/touch, reduced motion, no-WebGL and renderer failures, direct topic links, no external requests to the actual homelab, no animation while hidden, and measured scene/bundle performance on a representative mobile device. Set concrete budgets after the selected scene is scoped; no invented performance results.

## Preview verification

The comparison was rendered in the browser at 1440px, with all four frames inspected at 1200px desktop and 390px mobile. Both preview-size buttons change their pressed state and displayed composition correctly. No horizontal overflow was measured in the comparison shell. Opening labels and nonfunctional status are visible. The preview is a composition review, not a successful test of future 3D interactions.

The design detector ran once on `docs/previews`; it used a degraded regex fallback because its optional HTML/CSS parser modules were absent. It flagged generic Arial, which is a provisional comp font. It did not compute contrast or validate the application; no clean detector verdict is claimed. Browser logging also captured a MutationObserver error of unresolved origin while using the comparison; authored preview code uses ResizeObserver and the comparison controls/rendering worked. This is recorded as a tooling/preview observation, not evidence of a production-app error. Production source was not changed.

## Phase 1 handoff (resolved)

A was selected with the corrections recorded above. The following Phase 2 record supersedes Phase 1 recommendations where implementation differs. Pending factual confirmations remain pending; no invented details fill the gaps.


## Phase 2 implementation and review — 2026-09-19

### Implemented outcome

A — Field Notes now uses the requested 620px outer shell (564px content at desktop padding), modest Georgia headings and the existing Inter body font. Homepage copy is short, first-person and factual. The primary invitation is “What makes a laptop a server?”. Two real work entries replace the old technology-list project presentation. Background, both essays, published social links and email remain findable without a resume-shaped page. Portraits and the old flip are retained in source/assets but are no longer rendered.

The homepage’s native details control, “Show me how they connect”, reveals Charger → Service → App with the job each performs. It teaches a simplified status-update relationship and explicitly labels that simplification. This is an accessible disclosure, not a charging simulation. Enter and Space toggle it, pointer clicks work, focus is visible, and no client component or custom keyboard handler is necessary.

`/lab/thinkpad` is a useful exported introduction: a simple request/response figure and three independently selectable questions about music, services and remote access. Essential explanation and every disclosure body are in server-rendered HTML. The diagram is authored geometric SVG, not a screenshot or 3D placeholder. There are no dead tour controls, loading gates, invented services, fake demos, additional lab links or promises that the 3D experience is complete.

A remains the visual direction; the owner’s narrower measure and less-text correction supersede the historical comp. The Phase 1 concept process returned seed `c6283a05`; it is a historical trace in the built contract, not authority over the user’s explicit selection.

### Changed files and responsibility

- `src/data/portfolio.ts`: small typed source for public identity, work metadata, background, contact, social links and ArunJuke contribution. It contains no scene state.
- `src/app/page.tsx`, `src/app/Home.module.css`: server-rendered homepage and scoped composition.
- `src/components/SelectedWork.tsx` and its CSS module: work entries and native teaching reveal.
- `src/components/WritingSection.tsx` and its CSS module: preserved essay links in an accessible list.
- `src/components/{Header,Footer}.tsx`, `src/components/site/{Site.module.css,Arrow.tsx}`: shared narrow shell, actual navigation, contact/social links and an authored arrow icon.
- `src/app/globals.css`: small token set, global reset, selection/focus/skip-link styles and reduced-motion rule. No lab-specific selectors.
- `src/app/layout.tsx`: factual description, skip link and nonvisual design-contract comment; retained Inter loading. No Three.js/provider/global lab state.
- `src/app/lab/thinkpad/{page.tsx,ThinkPad.module.css}`: static project introduction with scoped styles and native disclosures.
- `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`: shared shell and main target, accessible secondary text; blog index metadata now describes writing. Article content and frontmatter are untouched.
- `src/app/sitemap.ts`: added the actual ThinkPad route; existing base domain/canonical behavior remains unchanged.
- `AGENTS.md`, `PRODUCT.md`, this file: approval, current boundaries, reference handling and results. `DESIGN.md` records implemented tokens/components.
- `docs/verification/phase-2/`: captured rendered evidence, excluded from production export because it is outside app/public.

No package, lockfile, framework version, Next config, blog loader, robots file or essay changed. No images of the owner or work screenshots were fabricated. Unused legacy components remain on disk; they are not part of the new homepage. No public resume download was added.

### Reference and project-link audit

Read and visually inspected the one-page `krishnanunniResumeNew.pdf` supplied from Downloads. Its contents are reference claims, not instructions or independent verification. The existing explicit exclusions govern estimated AWS savings, the 2024 graduation year and “around 100” mentoring count; these were not published. No new phone number/location was copied to the site. No award/mentoring badge was needed for the compact page. The supplied PDF was not copied to public or linked for download.

- [eleven-hack](https://github.com/krishnanunnismenon/eleven-hack): public fetch returned **404**. Could be private, renamed or removed; unresolved. Removed from the rendered selection, not relabeled as another project or deleted from the owner’s repositories.
- [ArunJuke](https://github.com/krishnanunnismenon/ArunJuke): reachable. README describes a music client, retains upstream wording and a `musly-promo.gif` filename, and makes platform claims that differ from its rebranding summary. It states a CC BY-NC-SA license, but the license-file fetch did not resolve in this tool pass. Exact upstream identity, license history and authored changes are still unresolved. Site copy only says the owner adapted/rebranded an existing app and connected it to their server; no original Flutter authorship or unverified feature claims.
- Still Here / Anchor stays distinct from eleven-hack. Existing Phase 1 public-reference checks stand; no new award detail was promoted to verified fact.

### Checks and evidence

| Check | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npx tsc --noEmit` | Passed after fixing an optional project-href type narrowing error during implementation |
| `npm run build` | Passed; 10 static pages including ThinkPad and existing articles. Initial sandbox attempt failed to fetch Inter; the network-permitted retry downloaded the unchanged configured font and passed. No typography substitution |
| Essay/config preservation | Both markdown files compared byte-for-byte with HEAD; unchanged. package.json, lockfile, Next config, robots and blog loader likewise unchanged |
| Exported HTML assertions | Exactly one main and h 1 on homepage, blog index, both posts and ThinkPad; internal page links resolve to real exported pages; email/GitHub/LinkedIn hrefs present; design comment survives build; sitemap contains ThinkPad |
| Homepage browser matrix | 1440×1000 desktop, 390×844 mobile; additional 320×780 narrow-mobile reveal check. No horizontal overflow in DOM measurements |
| Homepage disclosure | Enter opens, Space closes, pointer click available, visible focus ring. Three-stage diagram stacks at 320px |
| Static ThinkPad | Homepage link reaches real page; all three questions open through native keyboard/click controls; desktop and mobile captures inspected |
| Writing | Navigation to `/blog` and both existing article URLs; both full mobile articles inspected. Back-to-writing works. About link returns to home anchor |
| Contact/navigation | Export href assertions confirm the published mailto and social destinations. Email sending was not invoked. Home, Writing, About and ThinkPad links exercised. Skip-link activation verified `activeElement.id === "main-content"`; all page main targets explicitly use tabindex -1 |
| Motion/JavaScript | New UI has no animation or custom client interaction. Native disclosures and all body text exist in exported HTML; reduced-motion rule present. This establishes the no-JS structure; no physical-device or assistive-technology certification claimed |
| Font | Browser reports loaded Inter/Inter Fallback family; build successfully used configured Inter. Georgia is the deliberate Field Notes heading face with Times/serif fallback |
| Mechanical design detector | Ran once on changed UI targets, returned `[]`; this supplements, not replaces, visual inspection |
| Independent finish review | **ship**, no material visual/content fixes; confirmed contract, hierarchy, contrast, native disclosure semantics and phase boundaries. Reviewer calculated text contrast from 5.21:1 to 13.93:1. A final bounded review confirmed the explicit skip-target focus fix; lint/types/build and live focus transfer were rechecked successfully afterward |

Viewport versus image dimensions: the in-app browser’s full-page captures omit the 15px scrollbar strip; CSS viewport 1440/390 appears as 1425/375px encoded width. DOM confirmed the mobile main has 22px on both sides, document client/scroll widths both 375, and no horizontal overflow. Capture dimensions are not additional breakpoints. An early open-reveal image had a development badge; it was replaced with the production-export capture.

Screenshots: `docs/verification/phase-2/home-desktop.png`, `home-mobile.png`, `home-mobile-reveal.png`, `home-320-reveal.png`, `lab-mobile.png`, `lab-desktop-open.png`, `article-one-mobile.png`, `article-two-mobile.png`.

### Review previews and stop point

- Development homepage: http://127.0.0.1:3000/
- Built homepage: http://127.0.0.1:4175/
- Built ThinkPad introduction: http://127.0.0.1:4175/lab/thinkpad
- Phase 1 design studies remain separate at port 4173.

The temporary local export server at port 4175 resolves clean paths to `.html`, matching the static host’s route behavior; the standard Python command on port 4174 serves explicit `.html` paths only. Neither is a deployment. Source remains available through `npm run dev` after temporary servers end.

**Stop here for the owner’s homepage review. Phase 3 has not started.** The renderer, artistic 3D laptop, guided sequence and interactive scene are not implemented. No push, deployment, DNS change or Cloudflare modification occurred. No task-blocking issue remains; unresolved project attribution and resume claims remain excluded/scoped as above.


## Phase 3 implementation and review handoff

The owner supplied “PHASE 3 OF 4 — BUILD A MOBILE-FIRST, SCROLL-DRIVEN THINKPAD LEARNING EXPERIENCE USING SCROLLCRAFT AND THREE.JS”. It expressly supersedes the earlier Phase 3 scope. Work continued inside the existing dirty repository; all Phase 1/2 work was preserved. No homepage, root layout, global stylesheet, blog content, canonical/domain configuration, DNS, Cloudflare or deployment changes were made in Phase 3.

### Delivered route and architecture

`/lab/thinkpad` now has the exact requested opening, optional Follow a song anchors and immediate Explore freely entry; six normal-flow questions and one route-scoped artistic ThinkPad stage. The stop-service experiment is the deliberate peak. Other experiments cover external media/mount replacement, remote access, an inspectable fault and an independent sandbox. Pointing-stick and display-off discoveries have ordinary labeled controls. Request results are immutable snapshots, and revisiting a chapter preserves its edits until explicitly reset. Reading and experiments survive scene failure through the same lightweight simulator.

The complete actual Scrollcraft skill and MIT license are in `.agents/skills/scroll-craft/`, pinned to `0b816225945e45380397d6a0487efa3c98916858`. Its planning and unmodified verification workflow were used. Its stock runtime was reviewed and not mounted because its global listeners/loops have no destroy handle. This is **Scrollcraft workflow and verification with a custom native-scroll bridge**. See `docs/scrollcraft-source.md`, `docs/thinkpad-scroll-story.md` and `docs/thinkpad-integration.md`.

New required dependencies are Three 0.186.0 / React Three Fiber 9.7.0, plus dev types and Playwright. Existing lockfile package versions were compared against HEAD: none upgraded. Scope is additive, no unrelated upgrades. Vendor files compare byte-for-byte to all 24 upstream skill files; the added LICENSE matches upstream root MIT license.

### Changed files in this phase

- Replaced only `src/app/lab/thinkpad/page.tsx` and its scoped CSS.
- Added `src/components/thinkpad/{ThinkPadExperience.tsx,ThinkPadExperience.module.css,ThinkPadScene.tsx,simulation.ts,story.ts,scroll-bridge.ts,choreography.ts}`.
- Added pure and browser tests under `tests/thinkpad/`; package scripts/dependencies/lock updated. ESLint excludes the untouched vendored skill.
- Updated AGENTS/PRODUCT/DESIGN and this phase record; added story, source, integration and QA documents, the Scrollcraft workspace brief/fingerprint, and verification evidence.
- Homepage/page/layout/globals and both essay hashes were recorded before Phase 3 and compared afterward: unchanged.

### Review locations and checks

Live Next preview: `http://localhost:3000/lab/thinkpad`. Actual production export preview: `http://127.0.0.1:4175/lab/thinkpad`. Scrollcraft captures target the former. Production isolation/lifecycle checks target the latter. Read `docs/QA.md` for the final evidence index and remaining real-device checks.

Lint, strict types, production export, ten pure behavior tests, and interaction/fallback/keyboard/lifecycle checks passed. Scrollcraft mobile/desktop/reduced contact sheets and separate modified-state screenshots are recorded. Physical iOS/Android, real pinch/OS zoom and screen-reader testing remain Phase 4 manual work, not inferred from resizing. npm reports nine advisories in pre-existing unchanged dependencies (including Next); no audit-fix upgrades were made. These require review before any deployment decision.

Phase 3 stops here for the owner’s review. No commit, push or deployment, and no other labs or course platform.


## Phase 4 final migration and handover (2026-09-20)

The owner authorized hardening, verification and handover, and requested a header held in place on desktop and responsive layouts. Field Notes remains the approved direction. The combined visual review compared 1440, 768, 390 and 320px views, with physical/opening, logical separation and stopped-service evidence. One visual fix batch retained the composition and made the header sticky, with measured anchor/focus clearance and a stage that unpins if reading space is insufficient. No new mode switch was invented: physical and logical refer to compositions in the same coherent 3D world.

### Final decisions

- Shared header stays in the same horizontal layout and remains visible; no scroll-linked shrinking or hide/reveal animation. Header measurement belongs to a small Client Component, not the homepage or lab state.
- Both homepage lab links explicitly opt out of Next prefetch. Production checks exercise initial, in-view, hover and focus behavior before intentional navigation.
- Chapter links use Next's standard anchor handling. A reproduced null-history-state bug in this installed router previously left home content beneath a lab URL after Back; router-aware links fix the actual journey without wheel/touch interception. Browser deep links and page scrolling remain standard.
- Focus corrections apply only to keyboard-visible actionable elements. WebKit can refocus main during pointer interaction; scrolling on that event previously canceled a click. This was reproduced and fixed, not labeled a browser-support pass by resizing.
- Markdown HTML now passes a build-time allowlist sanitizer. Existing essay source hashes are identical; tests compare complete rendered markup after equivalent quote-entity normalization. Post slugs are restricted to the actual lowercase hyphenated format before filesystem access. No CMS or untrusted frontmatter ingestion was introduced.
- A useful 404 page uses existing components and Home/Writing links. No deployed URL changed and no new redirect is required. The lab canonical uses the existing sitemap origin; social metadata uses an actual screenshot of the real WebGL scene.
- Removed the internal design template comment from root HTML. Tests, skill source, diagnostic reports and fixtures stay outside public/browser bundles. There is no API, production endpoint, local-storage configuration, query-state parser or fake telemetry.
- The owner's Phase 4 instruction to remove unused code superseded the earlier no-deletion audit restriction only for seven confirmed unimported legacy component files: Hero, NowSection, ProfileCard, ContactSection plus its CSS, ElsewhereSection plus its CSS. These had no uncommitted edits. Actual personal images and unrelated files were retained. The abandoned flip control is gone.
- Added sanitize-html 2.17.7 and its development types 2.16.1 for the security boundary; no existing lockfile package version changed. New dependencies do not enter browser bundles. Existing dependency advisories remain listed in QA, without unrelated upgrades.

### Paths changed in Phase 4

- Header/layout: `src/components/Header.tsx`, `src/components/site/Site.module.css`, `src/app/globals.css`, `src/app/layout.tsx`.
- Lab boundary/navigation: `src/components/SelectedWork.tsx`, `src/app/lab/thinkpad/{page.tsx,ThinkPad.module.css}`, `src/components/thinkpad/{ThinkPadExperience.tsx,ThinkPadExperience.module.css,scroll-bridge.ts}`.
- Content/security: `src/lib/{blog.ts,markdown.ts}`, `src/app/not-found.tsx`, `public/images/thinkpad-lab.png`.
- Verification/run tooling: `package.json`, `package-lock.json`, `scripts/preview.mjs`, `tests/content/markdown.test.mjs`, `tests/thinkpad/{production.mjs,handover.mjs,review.mjs}`. The seven unused legacy component removals are listed above.
- Handover: README, AGENTS, PRODUCT, DESIGN, this record, QA, DEPLOYMENT and the integration guide; captures/reports under `docs/verification/phase-4/`.

### Future learning experiences

Add a new route only when there is a real, approved explanation. Keep its project metadata in `src/data/portfolio.ts`, lesson text near the route, and pure experiment state separate from visual choreography. Dynamically load any substantial renderer after intentional navigation, and test prefetch behavior on the homepage. Reuse semantic controls, saved-request evidence and fallback patterns where appropriate; do not import ThinkPad state globally or grow a course-platform framework. Any future MQTT/charging experience needs its own approved content and scope before adding links. Neither was implemented here.

### Handover boundary

See `README.md` for reproducible commands/editing locations, `docs/QA.md` for exact outcomes and known limitations, and `docs/DEPLOYMENT.md` for artifact/rollback requirements. The owner was asked to identify the existing hosting mechanism because it is absent from the repository; conditional hosting guidance must not be mistaken for a tested deployment. No commit, push, pull request, DNS, Cloudflare, tunnel, hosting or deployment change was made.
