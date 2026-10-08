// A thin gold countdown ring (server-style deadlines, docs/02 §1.2).
import { h } from '../dom.js';
import { sfx } from '../../audio/synth.js';

export function timerRing(label = 'Time left') {
  const el = h('div', {
    class: 'timer',
    role: 'timer',
    'aria-label': label,
    html: `<svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="19" fill="none" stroke="rgba(226,195,107,.18)" stroke-width="2"/><circle class="timer__arc" cx="22" cy="22" r="19" fill="none" stroke="#e2c36b" stroke-width="2.4" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="0" transform="rotate(-90 22 22)"/></svg>`,
  });
  const num = h('span', { class: 'timer__num tabular' }, '');
  el.append(num);
  const arc = el.querySelector('.timer__arc');
  let raf = 0;
  let deadline = 0;
  let total = 0;
  let cb = null;
  let lastSec = -1;
  const frame = () => {
    const left = Math.max(0, deadline - Date.now());
    arc.setAttribute('stroke-dashoffset', String(100 - (left / total) * 100));
    const s = Math.ceil(left / 1000);
    if (s !== lastSec) {
      num.textContent = String(s);
      if (s <= 5 && s > 0) sfx.tick();
      lastSec = s;
    }
    el.classList.toggle('is-urgent', left < 10000);
    if (left <= 0) {
      el.hidden = true;
      const f = cb;
      cb = null;
      f?.();
      return;
    }
    raf = requestAnimationFrame(frame);
  };
  return {
    el,
    start(seconds, onExpire) {
      cancelAnimationFrame(raf);
      total = seconds * 1000;
      deadline = Date.now() + total;
      cb = onExpire;
      lastSec = -1;
      el.hidden = false;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      cancelAnimationFrame(raf);
      cb = null;
      el.hidden = true;
    },
  };
}
