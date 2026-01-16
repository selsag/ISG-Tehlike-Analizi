MUST READ — REPO POLICY

**CRITICAL: DO NOT MERGE ANYTHING INTO `main`.**

Reason:
- `main` is protected by team policy: do not push, merge, or target PRs at `main` without explicit instruction from the repository owner.

Working process:
1. Create feature/fix branches off `local_branch` (or other designated working branches).
2. Open PRs with `base: local_branch` for review and CI previews. DO NOT target `main`.
3. When a fix is ready for production, coordinate with repository owners for a controlled release process (not automatic merging to `main`).

If you see a PR or branch targeting `main`, DO NOT APPROVE or MERGE it — instead, comment and retarget the PR to `local_branch`.

Maintainers: keep this file updated if the policy changes.