/* ============================================================
   BRAINROT RIFT — main.js
   UI interactions, content injection, scroll choreography.
   Territory: Daniel-Bud owns hero/nav/global wiring.
   (Mohammad-bud: Brainrotdex data + leaderboard are flagged below
    so you can extend them without touching the wiring.)
   ============================================================ */
(() => {
  "use strict";

  /* ---------- nav: scrolled state + mobile menu ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");
  burger?.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open"))
  );

  /* ---------- year ---------- */
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- "coming soon" guard for placeholder links ---------- */
  document.querySelectorAll("[data-soon]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      el.dataset.label ??= el.textContent;
      el.textContent = "Coming soon ✨";
      setTimeout(() => (el.textContent = el.dataset.label), 1400);
    })
  );

  /* =========================================================
     BRAINROTDEX DATA  — Mohammad-bud: safe to expand this array.
     Each entry: { name, sprite(emoji), rarity, tag, stats:{label:pct} }
     ========================================================= */
  const BRAINROTS = [
    { name: "Tralalero Tralala", sprite: "🦈", rarity: "legendary", tag: "Three-legged shark in Nikes",
      stats: { Cash: 92, Speed: 78, Chaos: 88 } },
    { name: "Tung Tung Tung Sahur", sprite: "🥁", rarity: "epic", tag: "The 3 a.m. drum demon",
      stats: { Cash: 70, Speed: 60, Chaos: 95 } },
    { name: "Bombardiro Crocodilo", sprite: "🐊", rarity: "mythic", tag: "Crocodile bomber jet",
      stats: { Cash: 99, Speed: 84, Chaos: 99 } },
    { name: "Lirilì Larilà", sprite: "🌵", rarity: "rare", tag: "Time-bending cactus elephant",
      stats: { Cash: 55, Speed: 90, Chaos: 64 } },
    { name: "Boneca Ambalabu", sprite: "🐸", rarity: "epic", tag: "Tyre-frog hybrid",
      stats: { Cash: 66, Speed: 72, Chaos: 80 } },
    { name: "Chimpanzini Bananini", sprite: "🍌", rarity: "rare", tag: "Banana-suited chimp",
      stats: { Cash: 60, Speed: 68, Chaos: 58 } },
    { name: "Cappuccino Assassino", sprite: "☕", rarity: "legendary", tag: "Espresso-fuelled ninja",
      stats: { Cash: 80, Speed: 96, Chaos: 76 } },
    { name: "Brr Brr Patapim", sprite: "🐒", rarity: "common", tag: "Forest gremlin",
      stats: { Cash: 40, Speed: 50, Chaos: 45 } },
  ];

  const rarityClass = {
    common: "r-common", rare: "r-rare", epic: "r-epic",
    legendary: "r-legendary", mythic: "r-mythic",
  };

  const rotGrid = document.getElementById("rotGrid");
  if (rotGrid) {
    rotGrid.innerHTML = BRAINROTS.map((b) => {
      const bars = Object.entries(b.stats)
        .map(([k, v]) => `<div class="bar">${k}<i><b style="width:${v}%"></b></i></div>`)
        .join("");
      return `
        <article class="rot" data-tilt>
          <span class="rarity ${rarityClass[b.rarity]}">${b.rarity}</span>
          <div class="sprite">${b.sprite}</div>
          <h4>${b.name}</h4>
          <div class="tag">${b.tag}</div>
          <div class="bars">${bars}</div>
        </article>`;
    }).join("");
  }

  /* =========================================================
     LEADERBOARD DATA — Mohammad-bud: safe to expand/replace.
     ========================================================= */
  const LEADERS = [
    { name: "xX_RiftKing_Xx", av: "👑", score: 1284500 },
    { name: "pastafari", av: "🍝", score: 1102340 },
    { name: "sharkfusion", av: "🦈", score: 987120 },
    { name: "BombardiroBob", av: "🐊", score: 845900 },
    { name: "espresso_depresso", av: "☕", score: 731450 },
  ];
  const board = document.getElementById("board");
  if (board) {
    board.insertAdjacentHTML(
      "beforeend",
      LEADERS.map(
        (p, i) => `
        <div class="row">
          <div class="rank">${i + 1}</div>
          <div class="who"><span class="av">${p.av}</span> ${p.name}</div>
          <div class="score">${p.score.toLocaleString()}</div>
        </div>`
      ).join("")
    );
  }

  /* ---------- scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((r) => io.observe(r));
  } else {
    reveals.forEach((r) => r.classList.add("in"));
  }

  /* ---------- animated count-up ---------- */
  const fmt = (n, dec) =>
    dec
      ? n.toFixed(dec)
      : n >= 1e6
      ? (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
      : n >= 1e3
      ? (n / 1e3).toFixed(0) + "K"
      : Math.round(n).toString();

  const countUp = (el) => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || "0", 10);
    const dur = 1600;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased, dec);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target, dec);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            countUp(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));
  } else {
    document.querySelectorAll("[data-count]").forEach(countUp);
  }

  /* ---------- pointer glow + lightweight 3D tilt on cards ---------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-tilt], .card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty("--mx", `${(x / r.width) * 100}%`);
      card.style.setProperty("--my", `${(y / r.height) * 100}%`);
      if (reduce || !card.hasAttribute("data-tilt")) return;
      const rx = (y / r.height - 0.5) * -8;
      const ry = (x / r.width - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  /* duplicate marquee track so the loop is seamless */
  const track = document.getElementById("marquee");
  if (track) track.innerHTML += track.innerHTML;
})();
