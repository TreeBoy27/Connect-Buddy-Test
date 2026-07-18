# 🧠 BRAINROT RIFT — Buddy Handoff & Playbook

**Head buddy:** Daniel-Bud · **Second buddy:** Mohammad-bud
**Branch:** `claude/roblox-game-website-xybxix`
**Goal:** a big, modern, 3D, 21st.dev-style website for the Roblox brainrot game
**BRAINROT RIFT**, hosted on GitHub Pages.

This file is written so **the work continues even if Daniel-Bud is gone.**
Everything you need — the plan, the territory split, the task board, and the
conventions — is here and in the repo.

---

## ⚠️ IMPORTANT — current blocker (read first)

At handoff time, **this session could not push to GitHub.** Every write path
returned **403**:

- `git push` → `git-receive-pack` **403 Forbidden** (from GitHub origin)
- GitHub MCP `create_branch` / `create_or_update_file` → **403 "Resource not
  accessible by integration"**

Reads (clone/fetch) work fine. This means the **Claude GitHub App installed on
`TreeBoy27/Connect-Buddy-Test` currently has read-only access** — it is missing
`contents: write`. Until a repo admin grants write access, **neither buddy can
push**, so the Connect-Buddy bus (which syncs only through git push) cannot
exchange live messages either.

**How the human fixes it:** open the repository's GitHub App / integration
settings and grant the Claude app **Read and write** access to *Contents* (and
*Workflows*, so the Pages action can be committed), then re-run the buddy.

Once write access is on, everything below is ready to publish with a single push.

---

## ✅ What Daniel-Bud already built (committed locally, ready to push)

```
index.html                     # full single-page site (nav, hero, bento,
                               #   brainrotdex, how-to, stats, leaderboard,
                               #   FAQ, CTA, footer)
assets/css/styles.css          # complete design system (dark glass, neon,
                               #   bento grid, reveal + tilt, fully responsive)
assets/js/main.js              # counters, scroll-reveal, tilt, data injection
assets/js/scene.js             # Three.js 3D hero (wireframe rift + shards)
assets/js/vendor-three.module.js  # Three.js r160, vendored (NO CDN needed)
.github/workflows/deploy-pages.yml # GitHub Pages deploy (runs on push to main)
.nojekyll                      # stop Jekyll from touching assets
```

Verified locally in headless Chromium: 8 brainrot cards render, leaderboard
renders, count-up animations fire, and the 3D hero draws correctly. Only
external font/CDN calls fail in the sandbox — they resolve fine on real Pages,
and Three.js is vendored so the 3D never depends on a CDN.

---

## 🗺️ Territory split (the real guarantee — locks are the backup)

| Owner | Territory | Files |
|-------|-----------|-------|
| **Daniel-Bud** (head) | Global layout, design system, hero + 3D, nav, deploy | `index.html` structure, `styles.css`, `scene.js`, hero wiring in `main.js`, workflow |
| **Mohammad-bud** | Content depth & new sections: extend the Brainrotdex, leaderboard, and add sections (roadmap, media, community). | The `BRAINROTS` / `LEADERS` arrays in `main.js`, new sections in `index.html`, matching styles you append in `styles.css` |

Rule of thumb: **Daniel owns the frame, Mohammad fills it with content.**
If you must touch a shared file (`index.html`, `styles.css`, `main.js`),
**lock the specific thing first** (see below) and keep edits inside your own
sections. Append new CSS at the end of `styles.css` under a comment banner with
your name so diffs never collide.

---

## 📋 Task board (also loaded into the Connect-Buddy bus)

Open tasks for **Mohammad-bud** (claim them with the bus once push works):

1. **Expand the Brainrotdex** — grow the `BRAINROTS` array in `main.js` from 8 to
   ~16 with more Italian-brainrot characters, correct rarities and stat bars.
2. **Roadmap / Seasons section** — add a new `<section id="roadmap">` (timeline of
   Season 1→4) after "How to play". Style it in your CSS banner.
3. **Media / Trailer section** — add a `<section id="media">` with a video
   placeholder (16:9 glass frame) + screenshot gallery grid.
4. **Community band** — add a CTA strip linking Discord / Roblox group (use the
   existing `.cta` styles or extend them).
5. **Testimonials** — a 3-card "what players say" row using the `.card` styles.
6. **Accessibility pass** — check color contrast on `--muted` text, add `aria-label`s
   to icon-only links, confirm keyboard focus states.

Done by Daniel-Bud: hero, 3D, nav, design system, bento features, brainrotdex
scaffold, leaderboard scaffold, stats band, FAQ, CTA, footer, deploy workflow.

---

## 🤝 How to run the Connect-Buddy bus (once push works)

From inside this repo:

```bash
BUD="python3 <path-to-skill>/connect-buddy/scripts/buddy.py"

# Mohammad-bud connects:
$BUD up --name Mohammad-bud
$BUD inbox                       # read Daniel's messages
$BUD tasks                       # see the board
$BUD task-claim --id <id>        # claim before working (exit 3 = taken)
$BUD lock --resource "index.html#section-roadmap"   # lock before editing
# ...make the edit, verify...
$BUD unlock --resource "index.html#section-roadmap"
$BUD task-done --id <id>
$BUD send --to Daniel-Bud --body "Roadmap section shipped"
```

**Golden rules:** never edit a resource you don't hold the lock for; check
`inbox` between tasks; announce any interface change (renamed id, moved section)
so the other buddy doesn't break.

---

## 🚀 Deploying to GitHub Pages

1. Merge `claude/roblox-game-website-xybxix` → `main` (or push the site to `main`).
2. In repo **Settings → Pages**, set **Source: GitHub Actions**.
3. The workflow `.github/workflows/deploy-pages.yml` runs on push to `main` and
   publishes the site. The live URL will be
   `https://treeboy27.github.io/Connect-Buddy-Test/`.
4. The site uses **relative paths** so it works under that sub-path automatically.

— Daniel-Bud, head buddy 🧠
