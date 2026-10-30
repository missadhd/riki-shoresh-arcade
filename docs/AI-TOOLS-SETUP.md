# AI tooling setup for Riki's Arcade

This repository is a static browser game. Claude Code and Codex each require their own local tool installation; GitHub files cannot install tools on a user's computer.

## Claude Code

In Claude Code, install Superpowers using its plugin manager (check the official Superpowers README for the current plugin source and command). For browser automation, run in a terminal with Node.js installed:

```sh
claude mcp add playwright -- npx @playwright/mcp@latest
```

Verify the MCP server appears in Claude Code and can open the game.

## Codex

Use the Codex skill/plugin installation interface to install Superpowers where available. Configure browser automation using the current Codex MCP settings for your installation. Verify the browser can open the game before relying on it.

## Testing expectations

- Test six Social Detective scenarios, all three choices in each (18 outcomes).
- Verify meaningful, choice-specific character actions visually, not just changed text or expressions.
- Verify replay, next scenario, coin awards, and 390px mobile layout.
- Never claim an unrun test passed. Preserve all localStorage keys and index.html script/style loading order.
- Coordinate edits using AGENTS.md and COORDINATION.md.

The repository's CI smoke tests do not replace manual inspection of animations.
