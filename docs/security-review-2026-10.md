# Client-side security and data exposure review — 2026-10-30

## Scope
Static-site review of `index.html`, `manifest.webmanifest`, `service-worker.js`, and targeted searches in `assets/scripts/01-game.js` and `assets/scripts/13-game.js`. This is **not** a complete repository-wide penetration test or a live network-traffic audit.

## Findings
- **Saved game state is local browser data.** Coins, progress, and dollhouse data are stored using `localStorage`. This is not a secure location for passwords, real names, medical records, private documents, or other sensitive information. Any JavaScript executing on the same origin can read it, and users of the same browser profile may access it.
- **Static client assets are public.** GitHub Pages/Netlify-hosted HTML, JavaScript, CSS, and published assets can be downloaded by anyone. No credentials, private student records, or secrets should ever be committed into these files.
- **No obvious hard-coded credential or outbound telemetry endpoint was identified** in the sampled files. The words “secret” and “token” occur in game code and are not, by themselves, evidence of exposed credentials. This is **not** a guarantee that no secret exists elsewhere.
- **Dynamic HTML insertion needs a separate injection review.** `01-game.js` and `13-game.js` contain numerous `innerHTML` assignments. Some user-provided root text uses HTML escaping, but every path accepting user input, imported data, or URL values should be reviewed for DOM-based XSS.
- **Service worker** caches same-origin scripts/styles and offline shell. Its fetch handler ignores cross-origin requests; it does not itself demonstrate exfiltration. Browser cache can retain previously loaded assets.
- **External dependencies:** Google Fonts is loaded from an external origin. External resources can receive normal network metadata (e.g. IP address). A privacy review should enumerate all remote libraries, fonts, and requests.
- **Security headers:** Static hosting configuration and deployed HTTP response headers were not verified. Check CSP, Referrer-Policy, X-Content-Type-Options, and frame protections at the hosting layer.

## Recommendations
1. Do not enter personal or student-identifying data into the game until storage, telemetry, and privacy behavior are verified.
2. Run a repository-wide secret scan (e.g. Gitleaks) and dependency scan in CI.
3. Audit all dynamic HTML rendering and user-input handling; prefer `textContent` for untrusted strings.
4. Inspect live network requests and deployed security headers, including third-party resources, on both hosting domains.
5. Preserve existing localStorage keys and data formats when making fixes.

## Outcome
**No confirmed data leak in the sampled files. No claim of complete security or absence of leaks.**
