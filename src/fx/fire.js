// Canvas fire (docs/05 §5): noise-driven bezier flame tongues + glowing particles + embers,
// additive blending, colour ramp deep red → orange → gold → pale yellow at the tips.
// Cosmetic only, so Math.random() is fine here (game logic never uses it).

const RAMP = [
  [255, 250, 210], // pale tip
  [255, 214, 120], // gold
  [255, 150, 40], // orange
  [214, 70, 20], // ember red
  [120, 20, 10], // deep red
];

function rampColor(t, a) {
  const x = Math.min(0.999, Math.max(0, t)) * (RAMP.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  const c = RAMP[i].map((v, k) => Math.round(v + (RAMP[i + 1][k] - v) * f));
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

/** Smooth pseudo-noise from layered sines — cheap and organic enough for flames. */
const noise = (x, t) => Math.sin(x * 1.7 + t * 1.3) * 0.5 + Math.sin(x * 3.1 - t * 2.1) * 0.3 + Math.sin(x * 5.3 + t * 3.7) * 0.2;

function glowSprite(color, size = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, color.replace('A', '1'));
  grd.addColorStop(0.35, color.replace('A', '.55'));
  grd.addColorStop(1, color.replace('A', '0'));
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  return c;
}

/**
 * createFire({ back, front, target }) — `back` and `front` are canvases layered behind and in
 * front of `target` (the burning card). Returns { start, stop, flare, setIntensity }.
 */
export function createFire({ back, front, target, budget = 1 }) {
  const ctxB = back.getContext('2d');
  const ctxF = front.getContext('2d');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const sprites = [0, 0.25, 0.5, 0.75, 0.95].map((t) => glowSprite(rampColor(t, 'A')));
  let W = 0;
  let H = 0;
  let rect = null;
  let particles = [];
  let embers = [];
  let running = false;
  let raf = 0;
  let last = 0;
  let intensity = 1;
  const maxParticles = Math.round(260 * budget);
  const maxEmbers = Math.round(80 * budget);

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    for (const c of [back, front]) {
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
      c.style.width = `${W}px`;
      c.style.height = `${H}px`;
      c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    rect = target.getBoundingClientRect();
  }

  function emit(n) {
    for (let i = 0; i < n && particles.length < maxParticles; i++) {
      // Most fire licks up from the bottom edge, some from the lower sides.
      const side = Math.random();
      let x;
      let y;
      if (side < 0.62) {
        x = rect.left + Math.random() * rect.width;
        y = rect.bottom - Math.random() * rect.height * 0.08;
      } else {
        const left = side < 0.81;
        x = left ? rect.left + Math.random() * 10 : rect.right - Math.random() * 10;
        y = rect.top + rect.height * (0.45 + Math.random() * 0.55);
      }
      const size = rect.width * (0.1 + Math.random() * 0.16) * (0.7 + intensity * 0.3);
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 18,
        vy: -(40 + Math.random() * 70) * (0.8 + intensity * 0.4),
        life: 0,
        max: 0.7 + Math.random() * 0.9,
        size,
        front: side < 0.62 && Math.random() < 0.3,
      });
    }
  }

  function emitEmbers(n) {
    for (let i = 0; i < n && embers.length < maxEmbers; i++) {
      embers.push({
        x: rect.left + Math.random() * rect.width,
        y: rect.bottom - Math.random() * rect.height * 0.5,
        vy: -(30 + Math.random() * 90),
        life: 0,
        max: 1.6 + Math.random() * 2.4,
        r: 0.8 + Math.random() * 1.8,
        phase: Math.random() * 6.28,
      });
    }
  }

  function tongues(ctx, t, count, scale, alpha) {
    const baseY = rect.bottom + rect.height * 0.06;
    for (let i = 0; i < count; i++) {
      const u = (i + 0.5) / count;
      const x = rect.left - rect.width * 0.32 + u * rect.width * 1.64;
      const edge = Math.abs(u - 0.5) * 2;
      const h = rect.height * scale * (0.3 + 0.45 * edge + 0.18 * noise(i * 0.9, t)) * (0.75 + intensity * 0.25);
      const w = (rect.width / count) * 1.9;
      const sway = noise(i * 1.3 + 7, t * 1.4) * w * 0.9;
      const tipX = x + sway;
      const tipY = baseY - h;
      const grd = ctx.createLinearGradient(0, baseY, 0, tipY);
      grd.addColorStop(0, 'rgba(150,25,10,0)');
      grd.addColorStop(0.1, `rgba(170,35,12,${alpha})`);
      grd.addColorStop(0.32, `rgba(240,110,30,${alpha * 0.9})`);
      grd.addColorStop(0.65, `rgba(255,200,90,${alpha * 0.6})`);
      grd.addColorStop(1, 'rgba(255,245,200,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.moveTo(x - w / 2, baseY);
      ctx.bezierCurveTo(x - w * 0.6, baseY - h * 0.45, tipX - w * 0.15, tipY + h * 0.25, tipX, tipY);
      ctx.bezierCurveTo(tipX + w * 0.15, tipY + h * 0.25, x + w * 0.6, baseY - h * 0.45, x + w / 2, baseY);
      ctx.closePath();
      ctx.fill();
    }
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    const t = now / 1000;
    rect = target.getBoundingClientRect();
    emit(Math.round(160 * dt * budget * (0.6 + intensity)));
    emitEmbers(Math.random() < 30 * dt * budget * intensity ? 1 : 0);

    for (const ctx of [ctxB, ctxF]) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
    }

    // Warm floor glow behind everything.
    const glow = ctxB.createRadialGradient(rect.left + rect.width / 2, rect.bottom, 0, rect.left + rect.width / 2, rect.bottom, rect.width * 1.1);
    glow.addColorStop(0, `rgba(255,120,40,${0.2 * intensity})`);
    glow.addColorStop(1, 'rgba(255,120,40,0)');
    ctxB.fillStyle = glow;
    ctxB.fillRect(0, 0, W, H);

    tongues(ctxB, t, 9, 1.25, 0.62); // back layer: tall and soft
    tongues(ctxB, t * 1.3 + 5, 12, 0.75, 0.55); // mid layer
    tongues(ctxF, t * 1.7 + 11, 12, 0.3, 0.4); // front layer: low licks over the card's foot

    particles = particles.filter((p) => (p.life += dt) < p.max);
    for (const p of particles) {
      const k = p.life / p.max;
      p.x += (p.vx + noise(p.y * 0.02, t) * 22) * dt;
      p.y += p.vy * dt;
      const s = p.size * (1 - k * 0.6);
      const sprite = sprites[Math.min(4, Math.floor(k * 5))];
      const ctx = p.front ? ctxF : ctxB;
      ctx.globalAlpha = (1 - k) * (p.front ? 0.28 : 0.6);
      ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
    }
    ctxF.globalAlpha = ctxB.globalAlpha = 1;

    embers = embers.filter((e) => (e.life += dt) < e.max);
    for (const e of embers) {
      e.y += e.vy * dt;
      e.x += Math.sin(t * 2 + e.phase) * 24 * dt + 8 * dt;
      const flick = 0.55 + 0.45 * Math.sin(t * 18 + e.phase * 3);
      ctxF.fillStyle = rampColor(0.1 + e.life / e.max * 0.6, (1 - e.life / e.max) * flick);
      ctxF.beginPath();
      ctxF.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctxF.fill();
    }
    raf = requestAnimationFrame(frame);
  }

  const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : running && (raf = requestAnimationFrame(frame)));

  return {
    start() {
      resize();
      running = true;
      last = performance.now();
      window.addEventListener('resize', resize);
      document.addEventListener('visibilitychange', onVis);
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    },
    setIntensity(v) {
      intensity = v;
    },
    flare() {
      intensity = 2.4;
      emit(120);
      emitEmbers(40);
    },
  };
}
