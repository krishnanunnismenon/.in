# Scrollcraft source record

- Source: https://github.com/nateherkai/scroll-craft
- Commit: `0b816225945e45380397d6a0487efa3c98916858`
- Retrieved 2026-09-19 using a shallow Git clone into a non-public temporary directory.
- Complete upstream `plugins/nateherk-design/skills/scroll-craft/` copied to `.agents/skills/scroll-craft/` without overwriting an installation. Vendor contents unchanged; upstream root MIT LICENSE copied alongside.
- Copyright (c) 2026 Nate Herk. Preserve `.agents/skills/scroll-craft/LICENSE` with redistribution.
- Read README, SKILL, approved-collection, hero-depth, uniqueness, feel, devices, taste, verify. Inspected doctor/workspace/shoot and engine lifecycle/global CSS before execution/integration.
- Stock runtime and styles are NOT bundled. See `thinkpad-scroll-story.md` for the reviewed lifecycle reason.
- First doctor run: Node 26, full ffmpeg 490 filters, Chrome present; playwright pending install, registry not yet created, optional libwebp and KIE missing. No hard failure. KIE/media encoding/video checks are not applicable to this authored real-time 3D work. No credentials or paid calls used.
- Workspace resolves to repository `scrollcraft/`; `workspace.mjs --ensure` ran from project root.

- Post-install doctor rerun: required checks and Playwright/Chrome pass; optional libwebp encoder and KIE remain missing/non-applicable. No media generation, video decode or credit checks claimed.
- Integrity comparison: all 24 original skill files identical; separate copied root LICENSE identical.
