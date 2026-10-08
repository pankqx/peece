// Golden win burst: radial particles + ring shockwave over an element (docs/05 §6 "Win").
import { reducedMotion } from '../ui/dom.js';

export function burst(el, { count = 60, colors = ['#f6e3a3', '#e2c36b', '#fff4cf', '#c9a24a', '#ffffff'] } = {}) {
  if (!el || reducedMotion()) return Promise.resolve();
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const layer = document.createElement('div');
  layer.className = 'fx-layer';
  document.body.append(layer);
  const ring = document.createElement('div');
  ring.className = 'fx-ring';
  ring.style.left = `${cx}px`;
  ring.style.top = `${cy}px`;
  layer.append(ring);
  const jobs = [ring.animate([{ transform: 'translate(-50%,-50%) scale(.2)', opacity: 1 }, { transform: 'translate(-50%,-50%) scale(3.2)', opacity: 0 }], { duration: 900, easing: 'cubic-bezier(.16,1,.3,1)' }).finished];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('i');
    p.className = 'fx-spark';
    const s = 3 + Math.random() * 6;
    p.style.width = p.style.height = `${s}px`;
    p.style.background = colors[i % colors.length];
    p.style.left = `${cx}px`;
    p.style.top = `${cy}px`;
    if (i % 3 === 0) p.style.borderRadius = '1px';
    layer.append(p);
    const a = Math.random() * Math.PI * 2;
    const d = 80 + Math.random() * Math.max(140, r.width * 1.4);
    const dx = Math.cos(a) * d;
    const dy = Math.sin(a) * d - 30;
    jobs.push(
      p.animate(
        [
          { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.9) rotate(${Math.random() * 360}deg)`, opacity: 0.9, offset: 0.7 },
          { transform: `translate(calc(-50% + ${dx * 1.1}px), calc(-50% + ${dy * 1.1 + 60}px)) scale(.3)`, opacity: 0 },
        ],
        { duration: 1000 + Math.random() * 500, easing: 'cubic-bezier(.16,1,.3,1)' }
      ).finished
    );
  }
  return Promise.all(jobs.map((j) => j.catch(() => {}))).then(() => layer.remove());
}

/** Floating emoji reaction that wobbles up and fades (docs/05 §6 "Reaction emoji"). */
export function floatEmoji(emoji, anchor) {
  const r = anchor.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'fx-emoji';
  el.textContent = emoji;
  el.style.left = `${r.left + r.width / 2 + (Math.random() - 0.5) * r.width * 0.5}px`;
  el.style.top = `${r.top + r.height * 0.6}px`;
  document.body.append(el);
  const drift = (Math.random() - 0.5) * 60;
  el.animate(
    [
      { transform: 'translate(-50%, 0) scale(.4)', opacity: 0 },
      { transform: `translate(calc(-50% + ${drift * 0.3}px), -40px) scale(1.15) rotate(-8deg)`, opacity: 1, offset: 0.15 },
      { transform: `translate(calc(-50% + ${drift * 0.7}px), -140px) scale(1) rotate(8deg)`, opacity: 1, offset: 0.6 },
      { transform: `translate(calc(-50% + ${drift}px), -220px) scale(.9) rotate(-4deg)`, opacity: 0 },
    ],
    { duration: 2400, easing: 'ease-out' }
  ).finished.then(() => el.remove(), () => el.remove());
}
