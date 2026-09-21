# Deployment and rollback handover

No deployment, push, PR, DNS, Cloudflare or tunnel change was performed or authorized. This is a runbook for a later explicitly authorized release.

## Verified artifact and current-host boundary

The repository uses Next.js `output: 'export'` with unoptimized images. `npm run build` produces **`out/`**, a static website, including `404.html`, clean-route HTML, Next navigation payloads, JavaScript/CSS, fonts and the actual ThinkPad preview image. There is no API, Server Action, runtime Next server, API key or simulation backend to provision.

The intended public domain remains **krishnanunni.in**; existing sitemap/robots use `https://krishnanunni.in`. The completed lab uses that same origin for its canonical/social URLs. No new redirect or domain change is required by this implementation. A previous apex→www observation is recorded in the audit; confirm the existing host's canonical behavior before a public release, without changing DNS as part of verification.

**Host-specific information pending:** no Pages configuration, tunnel configuration, origin server document root, release directory or hosting workflow exists in this repository. The owner was asked whether the current host is Cloudflare Pages, a Cloudflare Tunnel to an existing server, or another host. Do not mistake the Cloudflare edge for evidence of the origin type. The steps below deliberately do not invent a project name, server path or deployment command.

## Prepare an approved release

1. Resolve the dependency-advisory decision in `QA.md` and finish the listed physical-device/manual checks. Do not treat automated WebKit as an iPhone certification.
2. In a clean, reviewed source checkout, use the verified Node/npm versions from README and run `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`. Keep the lockfile. Google's font hosts must be reachable during a clean build.
3. Start `npm run preview`; verify `/`, `/lab/thinkpad`, `/blog`, both existing articles, `/sitemap.xml`, `/robots.txt`, `/images/thinkpad-lab.png` and a missing URL returning HTTP 404. Run the browser commands in README. Do not use `next start` for this export.
4. Store a versioned copy and checksum manifest of the **complete** `out/` artifact alongside the existing host's previous working release. Record the source revision or reviewed working-tree artifact identity and build environment. Never overwrite the sole previous release.
5. Publish only after explicit release authorization, through the current host's established release mechanism. Retain all `_next` chunks and navigation payloads. Do not upload the repository root, tests, `.agents`, `.impeccable`, `scrollcraft`, `docs/verification`, `.next`, `node_modules`, credentials or `.env` files.

## Match the existing hosting mechanism

- **If Cloudflare Pages is confirmed:** use the existing Pages project and existing domain binding. Its build command must produce `out/`; the publish directory is `out`. Use the project's current Git integration or upload workflow, not a newly invented project. Ensure missing URLs use `404.html`; do not turn the export into a blanket homepage/SPA fallback. Keep the existing redirects and security headers unless separately reviewed and tested. Record the current successful Pages deployment identifier before release.
- **If an existing server behind Cloudflare Tunnel is confirmed:** deploy the static artifact to the already-configured origin's release/document-root mechanism. Keep the tunnel ingress, origin port, TLS and DNS unchanged. The origin must resolve `/blog/post` to its exported `.html` file, serve Next's `.txt` navigation payloads with their actual content, and return `404.html` with HTTP 404 for unknown paths. Test the origin locally before switching the existing release pointer. The local Node preview server is a verification tool, not an instruction to replace the production web server.
- **If another static host is confirmed:** use its established release/rollback mechanism with the same complete artifact and clean-route/404 requirements. Do not migrate providers as a side effect.

These are conditional compatibility requirements, not a claim that a host-specific release was verified. Exact project/origin identifiers must come from the owner or their existing host configuration.

## Confirm after a later authorized release

Use a clean browser session to check the preserved URLs and complete lesson journey. Confirm the canonical URL and social image resolve on the public origin, unknown URLs return 404, and the homepage does not download the scene during initial load, hover or in-view prefetch. Test scene failure and keyboard access. Public validation has not been performed for this new build because it has not been deployed.

Do not add a blanket CSP during release. This phase introduced no CSP or production security-header changes. A future CSP must be tested against fonts, Next scripts, static navigation, WebGL and existing essays, preferably with a report-only stage first.

## Roll back

If the later release fails, stop further changes and restore the previous **complete** artifact using the existing host's atomic release/rollback mechanism. On Pages, restore the recorded previous successful deployment in the existing project. On a server, switch its existing release pointer/document root back to the preserved working artifact. Do not roll back by mixing old HTML with new `_next` chunks, changing DNS, or editing the tunnel.

Verify the homepage, an existing article, direct navigation and missing-route behavior after rollback. Handle cache invalidation only through the owner's established, explicitly authorized process. Keep the failed release and diagnostics for investigation; there is no database or simulation state to migrate or restore.
