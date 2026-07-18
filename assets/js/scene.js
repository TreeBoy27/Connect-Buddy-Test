/* ============================================================
   BRAINROT RIFT — scene.js
   A lightweight Three.js hero: a cloud of glowing, morphing
   "rift shards" + a pulsing wireframe core that drifts with the
   pointer. Degrades gracefully if WebGL or the CDN is unavailable.
   Territory: Daniel-Bud owns the 3D hero scene.
   ============================================================ */
import * as THREE from "three";

const canvas = document.getElementById("hero-canvas");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && !reduce) {
  boot().catch((err) => {
    // never let a 3D failure break the page
    console.warn("[brainrot-rift] 3D hero disabled:", err);
    canvas.style.display = "none";
  });
}

async function boot() {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  /* ----- lights ----- */
  scene.add(new THREE.AmbientLight(0x8899ff, 0.6));
  const key = new THREE.PointLight(0x7c3aed, 60, 60);
  key.position.set(8, 10, 12);
  scene.add(key);
  const rim = new THREE.PointLight(0x22d3ee, 50, 60);
  rim.position.set(-10, -6, 8);
  scene.add(rim);
  const warm = new THREE.PointLight(0xf43f5e, 40, 60);
  warm.position.set(0, -10, -6);
  scene.add(warm);

  const group = new THREE.Group();
  scene.add(group);

  /* ----- pulsing wireframe core (the "rift") ----- */
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.1, 1),
    new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.6,
      metalness: 0.4,
      roughness: 0.2,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    })
  );
  group.add(core);

  const coreGlow = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.2, 2),
    new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x0e7490,
      emissiveIntensity: 0.8,
      metalness: 0.6,
      roughness: 0.1,
    })
  );
  group.add(coreGlow);

  /* ----- orbiting rift shards ----- */
  const palette = [0x7c3aed, 0x22d3ee, 0xf43f5e, 0xfacc15, 0x34d399];
  const shards = [];
  const SHARD_COUNT = 26;
  for (let i = 0; i < SHARD_COUNT; i++) {
    const geo =
      i % 3 === 0
        ? new THREE.TetrahedronGeometry(0.55)
        : i % 3 === 1
        ? new THREE.OctahedronGeometry(0.5)
        : new THREE.IcosahedronGeometry(0.45, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: palette[i % palette.length],
      emissive: palette[i % palette.length],
      emissiveIntensity: 0.35,
      metalness: 0.7,
      roughness: 0.25,
      flatShading: true,
    });
    const m = new THREE.Mesh(geo, mat);
    const radius = 5 + Math.random() * 4.5;
    const angle = Math.random() * Math.PI * 2;
    const yOff = (Math.random() - 0.5) * 8;
    m.userData = {
      radius,
      angle,
      yOff,
      speed: 0.12 + Math.random() * 0.25,
      spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.01),
      bob: Math.random() * Math.PI * 2,
    };
    m.position.set(Math.cos(angle) * radius, yOff, Math.sin(angle) * radius);
    group.add(m);
    shards.push(m);
  }

  /* ----- starfield ----- */
  const starGeo = new THREE.BufferGeometry();
  const STAR_COUNT = 900;
  const pos = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 70;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 8;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0x9aa3c7, size: 0.06, transparent: true, opacity: 0.7 })
  );
  scene.add(stars);

  /* ----- pointer parallax ----- */
  const target = { x: 0, y: 0 };
  const cur = { x: 0, y: 0 };
  window.addEventListener(
    "pointermove",
    (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    },
    { passive: true }
  );

  /* ----- resize ----- */
  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || Math.round(window.innerHeight * 0.85);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* ----- animation loop ----- */
  const clock = new THREE.Clock();
  let raf;
  function tick() {
    const t = clock.getElapsedTime();

    cur.x += (target.x - cur.x) * 0.05;
    cur.y += (target.y - cur.y) * 0.05;
    group.rotation.y = t * 0.08 + cur.x * 0.6;
    group.rotation.x = cur.y * 0.4;

    core.rotation.x = t * 0.15;
    core.rotation.y = t * 0.2;
    const pulse = 1 + Math.sin(t * 1.6) * 0.04;
    core.scale.setScalar(pulse);
    coreGlow.rotation.x = -t * 0.25;
    coreGlow.rotation.y = -t * 0.18;
    coreGlow.material.emissiveIntensity = 0.7 + Math.sin(t * 2.2) * 0.25;

    for (const s of shards) {
      const u = s.userData;
      u.angle += u.speed * 0.01;
      s.position.x = Math.cos(u.angle) * u.radius;
      s.position.z = Math.sin(u.angle) * u.radius;
      s.position.y = u.yOff + Math.sin(t * 0.8 + u.bob) * 0.6;
      s.rotation.x += u.spin.x;
      s.rotation.y += u.spin.y;
      s.rotation.z += u.spin.z;
    }

    stars.rotation.y = t * 0.01;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  tick();

  /* pause when tab hidden to save battery */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else tick();
  });
}
