# 🧠 BRAINROT RIFT — website

A big, modern, **3D** landing site for the fictional Roblox brainrot collector-tycoon
**BRAINROT RIFT** — *Collect. Fuse. Dominate the Rift.* Built in the 21st.dev
aesthetic: dark glassmorphism, neon gradients, a Three.js hero, a bento feature
grid, an animated Brainrotdex, live-count stats and a seasonal leaderboard.

> Fan-made demo. Not affiliated with Roblox Corporation.

## Live site

Hosted on **GitHub Pages** → `https://treeboy27.github.io/Connect-Buddy-Test/`
(after the feature branch is merged to `main` and Pages source is set to
**GitHub Actions**).

## Tech

- Static HTML / CSS / vanilla JS — no build step
- **Three.js r160** for the 3D hero, **vendored locally** (`assets/js/vendor-three.module.js`) — no CDN dependency
- Responsive, theme-consistent, `prefers-reduced-motion` aware
- Deployed via `.github/workflows/deploy-pages.yml`

## Structure

```
index.html                          landing page
assets/css/styles.css               design system
assets/js/main.js                   interactions + content data
assets/js/scene.js                  Three.js hero scene
assets/js/vendor-three.module.js    vendored Three.js
.github/workflows/deploy-pages.yml  Pages deploy
```

## Built by the Buddy crew

This repo also hosts the **Connect-Buddy** coordination bus (`.buddy/`), used by
two Claude Code agents — **Daniel-Bud** (head) and **Mohammad-bud** — to split
the work through the shared git repo. See [`BUDDY-HANDOFF.md`](./BUDDY-HANDOFF.md)
for the plan, territory split and task board.

## Local preview

```bash
python3 -m http.server 8099
# open http://127.0.0.1:8099
```
