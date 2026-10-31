# Claude Code task dispatch (not active until authentication is configured)

The owner-gated workflow lives at `.github/workflows/claude-dispatch.yml`.
It runs only when **missadhd** manually dispatches a task from GitHub Actions with an issue number, or applies the `claude-ready` label to an existing issue. Other repository visitors cannot start a Claude run through this workflow.

## Required setup by repository owner
1. Review likely Anthropic model/API charges before enabling a paid service. Do not put keys or tokens in issues, comments, chat, or source files.
2. Install [Claude for GitHub](https://github.com/apps/claude) with access to `missadhd/riki-shoresh-arcade` (GitHub account authorization required).
3. In the repository, open Settings → Secrets and variables → Actions → New repository secret. Create `ANTHROPIC_API_KEY` using a key from Anthropic Console. This workflow intentionally supports API key authentication only for now. Anthropic offers an OAuth alternative if the workflow is modified later.
4. Start with a tiny Fix Mode issue (single file, no paid 3D generation). Have the owner apply `claude-ready` or run Claude Arcade task dispatch from the Actions tab with the issue number.
5. Verify the workflow actually creates an independent branch/PR, reads AGENTS.md and COORDINATION.md, runs tests, and records results. Do not call dispatch operational until this pilot passes.

## Guardrails
- Fix Mode and approved Build Mode tasks are authorized; new creative Explore Mode concepts still require Rachel's approval.
- Check all open file claims before editing or merging. The workflow has **no right to override** another active PR, including Claude's testing PR.
- No automatic paid Meshy generation, spending on third-party services, or destructive save changes.
- All game changes remain subject to independent GitHub checks and visual testing.
- Public issue content is untrusted; only the owner may trigger the job.
- The 30-minute workflow timeout and 18-turn Claude limit bound each run, but they do **not** guarantee zero Anthropic charges.
- A GitHub comment alone is not a working autonomous dispatch mechanism.

## Status
- Workflow is prepared but **not verified end-to-end** until owner installs the GitHub App, adds the secret, accepts usage costs and a pilot succeeds.
- Codex remains benched; this workflow is separate from Codex Cloud.
- Shared coordination stays in `COORDINATION.md`, not in chat messages.
