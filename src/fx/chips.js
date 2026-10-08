// Flying chips: SVG discs arc from one element to another, staggered (docs/05 §6 "Tokens").
import { CHIP_SVG } from '../ui/components/header.js';
import { reducedMotion } from '../ui/dom.js';
import { sfx } from '../audio/synth.js';

const center = (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};

export function flyChips(fromEl, toEl, count = 6, { size = 26, spread = 26 } = {}) {
  if (!fromEl || !toEl || reducedMotion()) return Promise.resolve();
  const a = center(fromEl);
  const b = center(toEl);
  const layer = document.createElement('div');
  layer.className = 'fx-layer';
  document.body.append(layer);
  const n = Math.max(1, Math.min(14, count));
  const jobs = [];
  for (let i = 0; i < n; i++) {
    const chip = document.createElement('div');
    chip.className = 'fx-chip';
    chip.style.width = chip.style.height = `${size}px`;
    chip.innerHTML = CHIP_SVG; // static developer SVG
    layer.append(chip);
    const sx = a.x + (Math.random() - 0.5) * spread;
    const sy = a.y + (Math.random() - 0.5) * spread;
    const ex = b.x + (Math.random() - 0.5) * 10;
    const ey = b.y + (Math.random() - 0.5) * 10;
    const lift = -Math.max(60, Math.abs(ex - sx) * 0.35) - Math.random() * 40;
    const frames = [];
    for (let k = 0; k <= 16; k++) {
      const t = k / 16;
      const x = sx + (ex - sx) * t;
      const y = sy + (ey - sy) * t + lift * 4 * t * (1 - t);
      frames.push({ transform: `translate(${x - size / 2}px, ${y - size / 2}px) rotate(${t * 540}deg) scale(${1 - 0.25 * Math.sin(t * Math.PI) * -1})`, opacity: k === 16 ? 0.2 : 1 });
    }
    const anim = chip.animate(frames, { duration: 900 + Math.random() * 250, delay: i * 70, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'both' });
    setTimeout(() => sfx.chip(1), i * 70 + 850);
    jobs.push(anim.finished.catch(() => {}));
  }
  return Promise.all(jobs).then(() => layer.remove());
}
