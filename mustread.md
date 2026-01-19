# GitHub Copilot / Agent Guidelines for ISG-Tehlike-Analizi 🚦

## Purpose
This file tells automated agents (and human contributors) how to safely and effectively work with this repository.

## Key rules (short) ✅
- **Never commit secrets.** Do not add real API keys or `.env` contents to the repo.
- **Use branches and PRs.** Agents should prefer feature branches (e.g., `local_branch`, `feature/...`) and open a Pull Request to `main` instead of committing directly to `main`.
- **Studio note:** Google AI Studio's *Save to GitHub → stage and commit all changes* will commit to the configured branch (often `main`). If Studio is used, prefer directing Studio to a non-critical branch or ensure `main` has branch protection.

## Local dev (how to test) 🧪
1. Switch to the working branch (example):
   - `git switch local_branch`
2. Install dependencies:
   - `npm install`
3. Create a local `.env` file (DO NOT commit it) or set a temporary env var:
   - PowerShell (file): `New-Item -Path .env -ItemType File -Force; Set-Content -Path .env -Value "VITE_API_KEY=your_real_key_here"`
   - PowerShell (temp): `$env:VITE_API_KEY="your_real_key_here" && npm run dev`
4. Run dev server: `npm run dev` → open `http://localhost:5173`

## Commit & PR guidance ✍️
- Commit message style: `feat|fix|chore(scope): short description` (e.g., `feat(ai): add image analysis endpoint`).
- Before pushing, run tests/lint locally.
- Open a Pull Request to `main` and ensure CI checks pass before merging.

## Security / Checks 🔒
- `.env` and any `*.local` env files are ignored via `.gitignore`.
- Use GitHub Secrets for production/studio secrets (do not store in code).
- Recommended: enable secret scanning / gitleaks action and branch protection (require PR review and status checks).

## Studio-specific guidance 🤖
- Agents operating inside Studio: **do not** stage or commit `.env` or secrets. If Studio can only commit to `main`, coordinate with repository owners to use a protected workflow (PRs, checks).
- If possible, configure Studio to commit to a `studio` branch; create PRs for human review.

## Contact / Maintainers
- Repo owner / maintainer: `selsag` (GitHub handle)

---
*This file is intended for both automated agents and humans to ensure consistent, safe practices when interacting with the repository.*
