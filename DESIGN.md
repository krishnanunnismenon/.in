---
name: Krishnanunni — Field Notes
description: Concise personal context and small explanations revealed through interaction.
colors:
  paper: "#f8f7f2"
  ink: "#252822"
  muted: "#606459"
  accent: "#344c2d"
  rule: "#d4d7cd"
  wash: "#ecefe5"
  focus: "#8b3527"
  selection: "#d6e4bf"
typography:
  display:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "clamp(32px, 6vw, 40px)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-.025em"
  title:
    fontFamily: "Georgia, 'Times New Roman', serif"
    fontSize: "25px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-.02em"
  introduction:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "17px"
    lineHeight: 1.65
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "15px"
    lineHeight: 1.65
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.5
  navigation:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "13px"
    lineHeight: 1.5
rounded:
  focus: "2px"
spacing:
  compact: "12px"
  inset: "20px"
  separation: "24px"
  mobile-section: "32px"
  section: "40px"
components:
  reading-shell:
    padding: "44px 28px 48px"
  reading-shell-mobile:
    padding: "22px 22px 32px"
  action-link:
    textColor: "{colors.accent}"
  answer-panel:
    backgroundColor: "{colors.wash}"
    padding: "20px"
  answer-panel-mobile:
    backgroundColor: "{colors.wash}"
    padding: "16px"
  section-label:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  navigation:
    textColor: "{colors.muted}"
    typography: "{typography.navigation}"
---

# Design System: Krishnanunni — Field Notes

## Overview

**Creative North Star: "Field Notes"**

A quiet personal site with pale paper, dark ink, green links, serif headings and a compact reading column. Brief first-person context leads to labeled questions and small explanations. The owner selected A — Field Notes on 2026-09-19, with less text and learning through interaction; those choices are settled.

This record preserves the implemented Phase 2 homepage identity and historical static ThinkPad introduction, with the implemented Phase 3 lab patterns appended below. Source CSS is the implementation authority; the frontmatter records its reusable values, not a new token layer to add to the application. `docs/portfolio-redesign.md` owns approval and phase status. Existing blog typography remains its own reading treatment. The new shared header, footer, palette and focus treatment do not authorize redesigning essays.

**Key Characteristics:**

- A narrow reading shell and modest headings.
- Flat rules and pale answer surfaces, without decorative elevation.
- Native disclosures that reveal detail on request.
- Authored geometric diagram icons with adjacent text labels.
- Useful content without JavaScript, canvas or WebGL.

## Colors

Warm paper and dark, slightly green ink provide the base; muted green signals exploration and interaction.

### Primary

- **Accent:** green for action links, active disclosure headings and diagram strokes. Hover adds green and, for ordinary links, an underline.
- **Focus:** rust-colored keyboard outlines, reserved for visible focus rather than decoration.

### Neutral

- **Paper:** the continuous page background.
- **Ink:** primary text and headings.
- **Muted:** supporting descriptions, dates, navigation and section labels; never replace it with low-opacity text.
- **Rule:** thin separators around sections, rows and the lab diagram.
- **Wash:** the homepage connection explanation surface.
- **Selection:** the browser text-selection highlight, paired with ink.

The tiny red pointing-stick mark in the laptop drawing is an asset detail, not a reusable interface color.

## Typography

**Display Font:** Georgia, with Times New Roman and serif fallbacks.
**Body Font:** existing Inter loaded through `next/font/google` into `--font-sans`, followed by platform sans fallbacks.

Georgia gives personal headings an editorial character; Inter keeps controls and supporting explanations compact. There is no new font dependency, mono label style or uppercase display system.

### Hierarchy

- **Display:** homepage introduction and lab question, using the frontmatter display role. The lab heading is limited to (20ch).
- **Title:** work-entry headings use the title role, becoming (23px) at the mobile breakpoint.
- **Introduction:** homepage prose uses the introduction role with a (48ch) maximum, becoming (16px) on mobile. Lab introduction uses (16px), line height (1.65), and (49ch) maximum.
- **Body:** background prose uses the body role. Work descriptions use (15px/1.6) and (52ch); lab answers use (15px/1.7).
- **Label:** restrained section headings use the label role. Navigation and footer use the navigation role. Dates and diagram annotations use smaller supporting text only where the layout requires it.

Do not apply the Georgia heading roles globally to blog articles. Their existing route styles remain authoritative.

## Layout

The shared shell has a maximum outer width of (620px), including padding under global border-box sizing. Its desktop content measure is therefore (564px). It is centered, with the shell padding recorded in frontmatter. At widths of (480px) and below, use the mobile shell padding; the page stays a single normal-flow column.

The header and footer wrap naturally. Header navigation uses a (22px) gap, reduced to (18px) on mobile. Homepage introduction begins (52px) below the header on desktop and (38px) on mobile. Work and writing sections use (40px) top spacing, reduced to (32px) on mobile. About uses (42px), reduced to (34px). Footer top spacing is (52px), reduced to (40px).

The homepage charging explanation is a three-column sequence. At widths of (350px) and below, it becomes one column and its small connecting arrows turn downward. The lab diagram stays a compact three-part row: device, request/response, ThinkPad. Its middle column changes from (1.3fr) to (1.25fr) at the mobile breakpoint; the surrounding columns remain (1fr).

Lab composition is isolated in `src/app/lab/thinkpad/ThinkPad.module.css`. It shares the reading shell and palette but defines its own figure, question rows and explanation spacing. Do not spread lab selectors into the homepage or global prose.

## Elevation & Depth

There are no shadows, gradients, glass panels or floating cards in the implemented system. Depth comes from thin rules, whitespace and the wash behind the expanded homepage explanation. The lab diagram is bounded by rules and remains part of the document flow.

## Shapes

Content surfaces are square and flat. The small radius in the frontmatter belongs to focus outlines; it is not a card-radius system. Rules are (1px). Diagram icons use deliberately reduced geometry and (1.5px) strokes. The phone outline has a small curved corner within the illustration, which does not establish a new container style.

The authored inline SVG phone, laptop, exchange and link arrows are decorative alongside visible labels and carry `aria-hidden`. No new raster asset or personal photograph is part of Phase 2; do not infer photography provenance requirements from unused existing files.

## Components

### Navigation and footer

A small linked name faces Writing and About links. About points to the homepage anchor even from inner pages. Navigation wraps instead of introducing a mobile menu. Hover provides an underline and accent color. There is no custom active-route indicator. The footer carries the approved email and social links, separated from content by a rule.

### Action links

Actions are text links, not filled buttons. The homepage exploration link has a (44px) minimum height, a small arrow, an underline and accent text. Work-title links have a separate arrow aligned at the far edge. Preserve the explicit destination and a visible label; do not turn whole sections into ambiguous click targets.

### Homepage disclosure

The charging explanation uses native `details` and `summary`, closed initially. Its summary has a (44px) minimum height and (12px) vertical padding. The open answer sits on wash with the frontmatter inset. An ordered sequence explains Charger → Service → App, followed by concise context and a visible simplified-example note. No custom client state or animation is involved.

### Writing rows

Each full row links to an existing post and separates title from date with a flexible gap. The date does not shrink. Rows have (16px) vertical padding and a bottom rule. Hover changes link color and underlines the title. Writing titles, dates, slugs and bodies come from the existing local markdown workflow without editorial changes.

### ThinkPad introduction and question rows

A server-rendered figure explains request and response with text and small line drawings; its caption explicitly identifies a simplified example. Three independent native disclosures explain music, services and remote access. Open summaries use accent color. Questions have generous (19px) vertical padding; answer content is indented (18px) and remains in normal flow. Multiple answers may stay open together.

The `music`, `services` and `access` IDs provide fragment destinations. Navigating to one is not a custom selection-state or guided-tour system. Native disclosure behavior and the text remain available without JavaScript or WebGL.

### Keyboard, focus and motion

A skip link appears when focused and targets `main-content`. Each page main uses `tabIndex={-1}` so the skip destination can receive focus without adding a tab stop. Links, buttons if later introduced, and summaries receive a (2px) focus outline with (5px) offset. Anchored sections, main elements and details have (24px) scroll margin. Retain native keyboard operation and disclosure markers.

No continuous or entrance animation is implemented. The reduced-motion media rule disables animations and transitions and sets automatic scroll behavior for all elements and pseudo-elements. Do not introduce a hidden motion dependency into diagrams or explanations.

### Content and future interaction boundaries

`src/data/portfolio.ts` holds approved public portfolio facts. Illustrative lesson data and scene state must stay separate from it. The diagrams establish conceptual relationships, not actual server inventory, topology, uptime, backup arrangements or hardware specifications.

The Phase 2 introduction described above is a historical implementation record. Phase 3 was subsequently explicitly authorized and replaces only the lab introduction with the implemented patterns below. Keep renderer imports out of shared layout and the homepage. There is no real server connection.

## Do's and Don'ts

### Do:

- **Do** preserve the selected Field Notes direction and compact reading shell.
- **Do** offer short, accessible explanations through clearly labeled native disclosures.
- **Do** keep essential text useful without JavaScript, motion or canvas.
- **Do** preserve the shared visible focus treatment and natural document flow.
- **Do** keep public facts separate from illustrative models and future scene state.
- **Do** retain the existing essays, slugs and their route-specific typography.

### Don't:

- **Don't** reopen the selected direction or reproduce the rejected old ThinkPad appearance.
- **Don't** add giant marketing headlines, bento dashboards, glass panels, mandatory terminals or boot sequences.
- **Don't** add continuous decorative animation, drag-only controls or unlabeled hotspots.
- **Don't** imply that the authored diagram is a 3D scene or a live view of the owner's server.
- **Don't** invent metrics, credentials, service inventory or exact hardware from visual references.


## Phase 3 implemented lab patterns

The approved palette, Inter/Georgia pairing and homepage measure remain unchanged. The lab uses a route-scoped outer width of 1224px with 40px desktop gutters and a 1.3:1 scene/reading split above 900px. Reading stays in normal document flow; no copy fades or overlays. Mobile gutters are 22px (18px at ≤350px). Its compact stage is bounded by the lesson, around 25svh for the image plus labels/controls. It unpins at ≤600px high or ≤350px wide. Focus moving backward into covered content is brought below the sticky stage without changing the experiment. Normal swipes and pinch gestures remain native.

The authored ThinkPad geometry has a charcoal shell, hinge, keyboard, pointing stick and separate display state. Green software and pale file geometry are labeled logical layers, not physical internals. The phone and thin home boundary anchor location. Soft directional lighting adds form; there are no interface shadows, glass surfaces, cinematic overlays or decorative motion. No third-party model/image assets were used. This is an artistic interpretation, not hardware documentation.

New lab controls are square, restrained outlined buttons with a 2px radius,13px Inter text,44px minimum height; the request action uses accent green and paper text. Wash panels hold request evidence. Native radio predictions, checkboxes and disclosures keep ordinary keyboard/touch behavior. Error state uses the existing rust family and visible words; color alone never carries the outcome. Pointing-stick explanation and display power have ordinary labeled controls. Headings 28px mobile/32px desktop remain Georgia; the opening is 30–40px.

Scroll reframes and separates the logical layers and traces a saved request. Explicit controls own simulation state. No completed lesson badges or forced progression. Reduced motion uses stable chapter compositions and stepped tracing. Lightweight view uses the same reducer and results, shown as an HTML relationship diagram. Loading, unsupported WebGL, context loss and failed scene imports preserve usable reading/controls. Technical explanations expand inline.

The normal-flow close is an independent sandbox followed by a concise real-setup attribution. No additional lab links or simulations. See `docs/thinkpad-integration.md` for editing guidance and `docs/QA.md` for verified states, screenshots and remaining Phase 4 checks.


## Phase 4 refinements (2026-09-20)

Field Notes, existing font families, palette and homepage measure are unchanged. The shared header is now sticky at the top, on opaque paper, with the same horizontal positions and visible links at every width. It has 8px block padding plus the safe-area inset and at least 44px link targets. It does not hide, shrink or animate while scrolling. A small route-independent ResizeObserver measures its actual height, including wrapping/enlarged text, for focus and anchor clearance. No lab state enters this component.

The lab stage sits below the header (an extra 16px on desktop). Actual measured stage/header height controls chapter clearance. On mobile, if their combined height exceeds 60% of the viewport, the stage unpins; the existing narrow/short viewport rules also remain. On desktop it unpins only when less than 60px would remain below it. Keyboard focus is moved into view only when covered, with immediate motion.

The 404 page uses the existing shell, typography, header/footer and ordinary Home/Writing links. The lab social image is a real screenshot of the implemented WebGL scene, `public/images/thinkpad-lab.png`, captured from the production export at 1440×900 on 2026-09-20. It is not a generated photo, exact hardware rendering, or live server view. The approved geometry and materials are unchanged.

Final physical and separated logical compositions, failure states, tablet and narrow screens are indexed in `docs/QA.md`. No new visual direction or additional simulation was introduced.
