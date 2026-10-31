# Arcade development modes and automated production plan

Status: approved operating-policy design; production orchestration and third-party 3D generation are **not yet integrated**.

## Decision authority

Rachel owns creative direction. Use the following modes according to request intent, without making her repeat approvals.

### Explore — new major game or creative direction
Research comparable games and educational mechanics, develop competing concepts, score each against learning value, accessibility, fun, fit with sparkle arcade, implementation complexity, and performance. Reject weaker alternatives and present a recommendation. **Ask Rachel to approve the creative concept before implementation.** Exploration should not quietly publish a new game.

### Build — approved game or feature
Approval of the concept authorizes ordinary implementation decisions, targeted 2D or Three.js design, optional external 3D asset generation, optimization, testing, revisions, and publishing. No per-commit approvals. Escalate material changes to approved direction, data-destructive changes, significant spending, credentials, or external account permissions.

### Fix — reported defects or previously requested behavior
A bug report, missing control, regression, layout clipping, incorrect ordering, or already agreed requirement is sufficient authorization to investigate, patch, regression-test, and publish. **Do not request repeated approval.** Check the live user-facing result; do not equate a code edit with success. Escalate only if a major redesign, saved-progress changes, external paid action, or conflicting user decision is required.

## Current priority: Shoreshim first
Ensure the Shoreshim learning game/category is the first clearly visible option in the live arcade's primary learning navigation, including desktop and phone-sized layouts. Determine the actual rendered UI source and ordering logic before editing. Confirm on the deployed site; test keyboard/touch navigation and saved progress. If multiple views differ, align the primary home entry point without hiding Social Skills or other games. This is an authorized **Fix Mode** task, not a proposal needing another approval.

## Future production loop (not yet fully automated)
1. Research and compare concepts (Explore).
2. Rachel approves the creative direction.
3. Write scoped acceptance criteria in a dedicated task/issue and claim files in a PR.
4. Implement with existing Three.js assets first; use Meshy or comparable modeling APIs only if useful, supported, authorized, and within agreed spend.
5. Optimize any generated GLB/GLTF models and textures, preserve origin/licenses, and store in the repo's actual verified asset path (do not assume `public/` exists).
6. Implement using GitHub branches and existing Claude/ChatGPT coordination.
7. Test interactions visually and functionally: complete actions not mere character sliding, replay, rewards, mobile/desktop viewport, performance, and localStorage regression.
8. Correct issues within a bounded iteration budget; disclose unverified portions and publish only per `AGENTS.md` safety/coordination rules.

## Efficiency
Codex can remain unused while its allowance is low. GitHub connector operations do not by themselves spend Codex Cloud task allowance. Local checkout and remote GitHub repo are distinct; do not claim to have written to the user's local machine without an actual local connection.

## Guardrails
- Honor `AGENTS.md` and `COORDINATION.md`, PR file claims, and other assistants' work.
- Preserve all 17 protected saved-progress keys, scripts/styles loading order, and children's privacy.
- No paid external generation without price transparency and authorization.
- No invented visual test results, automated agent dispatch, or Meshy integration claims.
- Record outcomes and limitations in the relevant PR/issue instead of asking Rachel to hand-deliver messages.
