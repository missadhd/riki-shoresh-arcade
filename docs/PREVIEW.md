# Preview checks

The live site (`https://missadhd.github.io/riki-shoresh-arcade/`) only updates when changes are merged to `main`.

To review a pull request before it goes live:

1. Open the PR.
2. Wait for the **Preview check (screenshots)** workflow to finish.
3. Download the **preview-screenshots** artifact from that run.
4. Look at `home.png`, `after-house.png`, and `decorate.png` (mobile-sized).

If something looks wrong in a specific room (for example “bedroom ceiling is too dark”), leave a short note on the PR. That gives the AI a clear target to fix.

This workflow does not change game code or saved progress. It only takes screenshots of the PR branch.
