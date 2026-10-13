// Admin console (#/admin): PIN-gated house controls for the offline lounge.
// Players & purses, house rules, rounds, data export/import/reset, audit log.
// Honest note: everything runs in this browser, so the PIN keeps casual hands off the
// controls — it is not server-grade security.
import { h, fmt } from '../dom.js';
import { header } from '../components/header.js';
import { toast } from '../components/toast.js';
import { bank, profile, persist, audit, isLocked, onChange, pref, setPref, setName, validName } from '../../state/save.js';
import { settings, saveSettings, resetSettings, DEFAULTS } from '../../state/settings.js';
import { RIVALS, rivalAcct } from '../../engine/rivals.js';
import { sha256Hex } from '../../engine/hash.js';
import { verifySeal } from '../../engine/seal.js';
import { GAMES, rivalPortrait } from '../art.js';
import { navigate } from '../../router.js';
import '../../styles/treasury.css';
import '../../styles/admin.css';

const SAVE_KEY = 'peece.save.v1';
const UNLOCK_KEY = 'peece.adminUnlocked';
let cleanups = [];

const when = (t) => new Date(t).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
const isUnlocked = () => {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === '1';
  } catch {
    return false;
  }
};
const setUnlocked = (v) => {
  try {
    v ? sessionStorage.setItem(UNLOCK_KEY, '1') : sessionStorage.removeItem(UNLOCK_KEY);
  } catch {
    /* ignore */
  }
};
const pinHash = (pin) => sha256Hex(`peece-admin:${pin}`);

export function mount(root) {
  const top = header({ title: 'Admin console' });
  cleanups.push(() => top.destroy());
  const page = h('main', { class: 'screen admin wrap' });
  root.append(top, page);
  if (isUnlocked()) renderConsole(page);
  else renderGate(page);
}

/* ---------------- PIN gate ---------------- */
function renderGate(page) {
  const existing = pref('adminPin', null);
  const pin = h('input', { class: 'input pin-input', type: 'password', inputmode: 'numeric', autocomplete: 'off', maxlength: '8', placeholder: '••••', 'aria-label': 'Admin PIN' });
  const pin2 = h('input', { class: 'input pin-input', type: 'password', inputmode: 'numeric', autocomplete: 'off', maxlength: '8', placeholder: '••••', 'aria-label': 'Repeat PIN' });
  const msg = h('p', { class: 'muted small', role: 'status' });
  const form = h(
    'form',
    {
      class: 'gate panel',
      onsubmit: async (e) => {
        e.preventDefault();
        const v = pin.value.trim();
        if (!/^\d{4,8}$/.test(v)) return (msg.textContent = 'Use 4 to 8 digits.');
        if (!existing) {
          if (v !== pin2.value.trim()) return (msg.textContent = 'The two PINs do not match.');
          setPref('adminPin', await pinHash(v));
          audit('admin_pin_set', 'Admin PIN created');
          toast('Admin PIN created', 'ok');
        } else if ((await pinHash(v)) !== existing) {
          pin.value = '';
          form.classList.remove('is-shake');
          void form.offsetWidth;
          form.classList.add('is-shake');
          return (msg.textContent = 'Wrong PIN.');
        }
        setUnlocked(true);
        audit('admin_unlock', 'Console unlocked');
        page.replaceChildren();
        renderConsole(page);
      },
    },
    h('div', { class: 'gate__lock', 'aria-hidden': 'true', html: `<svg viewBox="0 0 48 48"><rect x="9" y="21" width="30" height="22" rx="4" fill="none" stroke="#e2c36b" stroke-width="2"/><path d="M15 21v-6a9 9 0 0 1 18 0v6" fill="none" stroke="#e2c36b" stroke-width="2"/><circle cx="24" cy="31" r="3" fill="#e2c36b"/><path d="M24 34v4" stroke="#e2c36b" stroke-width="2"/></svg>` }),
    h('p', { class: 'eyebrow' }, 'House only'),
    h('h1', {}, existing ? 'Enter the admin PIN' : 'Create an admin PIN'),
    h('p', { class: 'muted' }, existing ? 'Unlock the house controls for this browser session.' : 'Choose a 4–8 digit PIN. You will need it to open the console.'),
    pin,
    existing ? null : pin2,
    msg,
    h('button', { class: 'btn btn--primary btn--lg', type: 'submit' }, existing ? 'Unlock' : 'Create PIN & unlock'),
    existing
      ? h(
          'details',
          { class: 'gate__forgot' },
          h('summary', {}, 'Forgot the PIN?'),
          h('p', { class: 'muted small' }, 'The PIN cannot be recovered. You can wipe all local PEECE data (tokens, history, settings, PIN) and start fresh.'),
          h('button', { class: 'btn btn--danger btn--sm', type: 'button', onclick: () => wipeAll() }, 'Wipe everything')
        )
      : null
  );
  page.append(form);
  setTimeout(() => pin.focus(), 50);
}

function wipeAll() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('peece.'))
      .forEach((k) => localStorage.removeItem(k));
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith('peece.'))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch {
    /* ignore */
  }
  location.hash = '#/';
  location.reload();
}

/* ---------------- Console ---------------- */
function renderConsole(page) {
  const sections = [
    ['overview', 'Overview'],
    ['players', 'Players & purses'],
    ['rules', 'House rules'],
    ['rounds', 'Rounds'],
    ['data', 'Data'],
    ['audit', 'Audit log'],
  ];
  const nav = h(
    'nav',
    { class: 'admin__nav panel', 'aria-label': 'Admin sections' },
    sections.map(([id, label]) => h('a', { href: `#admin-${id}`, onclick: (e) => (e.preventDefault(), document.getElementById(`admin-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })) }, label)),
    h('hr', { class: 'hairline' }),
    h('a', { href: '#/' }, '← Back to the Foyer'),
    h('a', { href: '#/treasury' }, 'Fairness ledger'),
    h('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => (setUnlocked(false), audit('admin_lock', 'Console locked'), navigate('/admin')) }, 'Lock console')
  );
  const body = h('div', { class: 'admin__body' });
  page.append(h('header', { class: 'howto__head admin__head' }, h('p', { class: 'eyebrow' }, 'House controls'), h('h1', {}, 'Admin ', h('em', { class: 'gold-text' }, 'console'))), h('div', { class: 'admin__grid' }, nav, body));

  const overview = section('overview', 'Overview');
  const players = section('players', 'Players & purses', 'Set any purse exactly. The difference is minted or burned through the ledger, so the books always balance.');
  const rules = section('rules', 'House rules', 'Applies from the next round.');
  const rounds = section('rounds', 'Rounds', 'Your last 40 rounds. Verify re-hashes the revealed deck against the seal shown before betting.');
  const data = section('data', 'Data');
  const auditSec = section('audit', 'Audit log');
  body.append(overview, players, rules, rounds, data, auditSec);

  function paint() {
    paintOverview(overview.content);
    paintPlayers(players.content);
    paintRounds(rounds.content);
    paintAudit(auditSec.content);
  }
  paintRules(rules.content);
  paintData(data.content);
  paint();
  cleanups.push(onChange(paint));
}

function section(id, title, sub) {
  const content = h('div', { class: 'admin__content' });
  const el = h('section', { class: 'admin__sec panel', id: `admin-${id}`, 'aria-labelledby': `admin-${id}-h` }, h('div', { class: 'admin__sechead' }, h('h2', { id: `admin-${id}-h` }, title), sub ? h('p', { class: 'muted small' }, sub) : null), content);
  el.content = content;
  return el;
}

/* ---------- overview ---------- */
function paintOverview(c) {
  const r = bank.reconcile();
  const s = profile.stats;
  const rate = s.played ? Math.round((s.won / s.played) * 100) : 0;
  const tile = (k, v, cls = '') => h('div', { class: `bal ${cls}` }, h('span', { class: 'bal__k' }, k), h('span', { class: 'bal__v tabular' }, v));
  c.replaceChildren(
    h('div', { class: 'bal-grid' }, tile('Your purse', fmt(bank.bal('you'))), tile('Treasury (rake)', fmt(bank.bal('treasury')), 'bal--gold'), tile('In escrow', fmt(bank.bal('escrow'))), tile('Rounds played', fmt(s.played)), tile('Win rate', `${rate}%`), tile('Books', r.ok ? 'Balanced ✓' : 'Mismatch!', r.ok ? 'bal--ok' : 'bal--bad')),
    h(
      'div',
      { class: 'quick' },
      h('span', { class: 'eyebrow' }, 'Quick actions'),
      h('button', { class: 'btn btn--primary btn--sm', type: 'button', onclick: () => adjust('you', bank.bal('you') + 1000, 'Quick +1,000') }, '+1,000 tokens'),
      h('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => adjust('you', 1000, 'Reset purse to 1,000') }, 'Reset my purse to 1,000'),
      h('button', { class: 'btn btn--ghost btn--sm', type: 'button', disabled: !isLocked() || null, onclick: clearLock }, isLocked() ? 'Clear my lockout' : 'Not locked out'),
      h('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => {
        Object.keys(RIVALS).forEach((id) => adjust(rivalAcct(id), 1000, 'Reset rival purse', true));
        toast('All rivals reset to 1,000', 'ok');
      } }, 'Reset all rivals'),
      h('a', { class: 'btn btn--ghost btn--sm', href: '#/' }, 'Go to the Foyer')
    )
  );
}

function adjust(acct, value, why, quiet = false) {
  const v = Math.floor(Number(value));
  if (!Number.isFinite(v) || v < 0 || v > 10000000) return toast('Enter a number from 0 to 10,000,000', 'bad');
  const before = bank.bal(acct);
  bank.setTo(acct, v, why);
  if (acct === 'you' && v > 0) profile.lockedUntil = 0;
  audit('set_tokens', `${acct === 'you' ? profile.name || 'You' : RIVALS[acct.slice(6)].name}: ${fmt(before)} → ${fmt(v)} (${why})`);
  persist();
  if (!quiet) toast('Purse updated', 'ok');
}

function clearLock() {
  profile.lockedUntil = 0;
  audit('clear_lockout', 'Lockout cleared');
  persist();
  toast('Lockout cleared — welcome back to the tables', 'ok');
}

/* ---------- players ---------- */
function paintPlayers(c) {
  const row = (acct, name, portrait, extra) => {
    const input = h('input', { class: 'input input--sm', type: 'number', min: '0', max: '10000000', step: '1', value: String(bank.bal(acct)), 'aria-label': `New purse for ${name}` });
    return h(
      'div',
      { class: 'player-row' },
      typeof portrait === 'string' ? h('span', { class: 'player-row__face', html: portrait }) : h('span', { class: 'player-row__face' }, portrait),
      h('span', { class: 'player-row__who' }, h('strong', {}, name), extra),
      h('span', { class: 'player-row__bal tabular' }, fmt(bank.bal(acct))),
      h(
        'span',
        { class: 'player-row__ctl' },
        input,
        h('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => adjust(acct, input.value, 'Admin set') }, 'Set'),
        h('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => adjust(acct, bank.bal(acct) + 500, 'Admin +500') }, '+500'),
        h('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: () => adjust(acct, 1000, 'Admin reset') }, 'Reset')
      )
    );
  };
  const nameInput = h('input', { class: 'input input--sm', maxlength: '14', value: profile.name || '', 'aria-label': 'Your display name' });
  const youFace = h('span', { class: 'seat__avatar' }, (profile.name || '?').slice(0, 1).toUpperCase());
  const lockNote = isLocked() ? h('span', { class: 'bad small' }, `Locked until ${when(profile.lockedUntil)}`) : h('span', { class: 'muted small' }, 'Active');
  c.replaceChildren(
    row('you', profile.name || 'You', youFace, lockNote),
    ...Object.values(RIVALS).map((r) => row(rivalAcct(r.id), r.name, rivalPortrait(r.id, 'portrait'), h('span', { class: 'muted small' }, r.title))),
    h(
      'div',
      { class: 'house__row' },
      h('label', { class: 'muted small' }, 'Rename yourself'),
      nameInput,
      h(
        'button',
        {
          class: 'btn btn--ghost btn--sm',
          type: 'button',
          onclick: () => {
            if (!validName(nameInput.value)) return toast('2–14 characters', 'bad');
            const before = profile.name;
            setName(nameInput.value);
            audit('rename', `${before || '—'} → ${profile.name}`);
            toast('Name updated', 'ok');
          },
        },
        'Rename'
      ),
      h('button', { class: 'btn btn--ghost btn--sm', type: 'button', disabled: !isLocked() || null, onclick: clearLock }, 'Clear lockout')
    )
  );
}

/* ---------- house rules ---------- */
function paintRules(c) {
  const select = (key, label, options, hint) => {
    const el = h('select', { class: 'input input--sm', id: `set-${key}` }, options.map(([v, t]) => h('option', { value: String(v), selected: String(settings[key]) === String(v) || null }, t)));
    return { key, el, row: h('label', { class: 'rule', for: `set-${key}` }, h('span', { class: 'rule__label' }, label, hint ? h('span', { class: 'muted small' }, hint) : null), el) };
  };
  const toggle = (key, label, hint) => {
    const el = h('input', { type: 'checkbox', class: 'switch', id: `set-${key}`, checked: settings[key] || null });
    return { key, el, bool: true, row: h('label', { class: 'rule', for: `set-${key}` }, h('span', { class: 'rule__label' }, label, hint ? h('span', { class: 'muted small' }, hint) : null), el) };
  };
  const fields = [
    select('betSeconds', 'Bet timer', [[0, 'Off'], [30, '30 seconds'], [60, '60 seconds'], [90, '90 seconds'], [120, '2 minutes']], 'Round is cancelled if you do not bet in time.'),
    select('actSeconds', 'Action timer', [[0, 'Off'], [30, '30 seconds'], [45, '45 seconds'], [60, '60 seconds'], [90, '90 seconds']], 'Pick / hit / claim / decide.'),
    toggle('autoRematch', 'Auto-deal the next round', 'Off: wait for “Deal again”.'),
    select('rematchSeconds', 'Next-round countdown', [[3, '3 seconds'], [6, '6 seconds'], [10, '10 seconds'], [15, '15 seconds']]),
    select('rakePercent', 'House rake on winnings', [[0, '0% — no rake'], [2, '2%'], [5, '5% (standard)'], [10, '10%']]),
    select('lockoutDays', 'Lockout at zero tokens', [[0, 'Never'], [1, '1 day'], [3, '3 days'], [7, '7 days (standard)']]),
    toggle('loaderEverySession', 'Play the burning-King intro every session', 'Off: only on your first visit.'),
  ];
  c.replaceChildren(
    h('div', { class: 'rules-grid' }, fields.map((f) => f.row)),
    h(
      'div',
      { class: 'quick' },
      h(
        'button',
        {
          class: 'btn btn--primary btn--sm',
          type: 'button',
          onclick: () => {
            const patch = {};
            fields.forEach((f) => (patch[f.key] = f.bool ? f.el.checked : Number(f.el.value)));
            const changed = Object.keys(patch).filter((k) => patch[k] !== settings[k]);
            saveSettings(patch);
            audit('house_rules', changed.length ? changed.map((k) => `${k}=${patch[k]}`).join(', ') : 'saved (no change)');
            toast('House rules saved', 'ok');
          },
        },
        'Save house rules'
      ),
      h(
        'button',
        {
          class: 'btn btn--ghost btn--sm',
          type: 'button',
          onclick: () => {
            resetSettings();
            fields.forEach((f) => (f.bool ? (f.el.checked = DEFAULTS[f.key]) : (f.el.value = String(DEFAULTS[f.key]))));
            audit('house_rules', 'reset to defaults');
            toast('Defaults restored', 'ok');
          },
        },
        'Restore defaults'
      )
    )
  );
}

/* ---------- rounds ---------- */
function paintRounds(c) {
  const rows = profile.history.length
    ? profile.history.map((row) => {
        const out = h('td', { class: 'verify-cell' });
        out.append(
          h(
            'button',
            {
              class: 'btn btn--ghost btn--sm',
              type: 'button',
              onclick: async () => {
                const ok = row.text && (await verifySeal(row.text, row.commit));
                out.replaceChildren(h('span', { class: ok ? 'ok' : 'bad' }, ok ? '✓ fair' : '✗ mismatch'));
              },
            },
            'Verify'
          )
        );
        return h('tr', {}, h('td', {}, when(row.at)), h('td', {}, GAMES[row.game]?.name || row.game), h('td', {}, RIVALS[row.rival]?.name || row.rival), h('td', { class: 'tabular' }, fmt(row.stake)), h('td', { class: `tabular ${row.net > 0 ? 'ok' : row.net < 0 ? 'bad' : ''}` }, row.net > 0 ? `+${fmt(row.net)}` : fmt(row.net)), out);
      })
    : [h('tr', {}, h('td', { colspan: '6', class: 'muted empty' }, 'No rounds yet.'))];
  c.replaceChildren(
    h('div', { class: 'tbl-scroll' }, h('table', { class: 'tbl' }, h('thead', {}, h('tr', {}, ['When', 'Game', 'Rival', 'Stake', 'Net', ''].map((t) => h('th', { scope: 'col' }, t)))), h('tbody', {}, rows))),
    h(
      'div',
      { class: 'quick' },
      h('a', { class: 'btn btn--ghost btn--sm', href: '#/treasury' }, 'Open the full ledger'),
      h(
        'button',
        {
          class: 'btn btn--ghost btn--sm',
          type: 'button',
          onclick: () => {
            profile.history = [];
            profile.stats = { played: 0, won: 0, best: 0 };
            audit('clear_history', 'Round history and stats cleared');
            persist();
            toast('History cleared', 'ok');
          },
        },
        'Clear history & stats'
      )
    )
  );
}

/* ---------- data ---------- */
function paintData(c) {
  const file = h('input', { type: 'file', accept: 'application/json,.json', class: 'sr-only', id: 'import-file' });
  file.addEventListener('change', async () => {
    const f = file.files?.[0];
    if (!f) return;
    try {
      const parsed = JSON.parse(await f.text());
      if (!parsed?.bank?.balances || !parsed?.profile) throw new Error('not a PEECE save');
      const held = Object.entries(parsed.bank.balances).filter(([k]) => k !== 'mint').reduce((a, [, v]) => a + v, 0);
      if (held !== -(parsed.bank.balances.mint || 0)) throw new Error('books do not balance');
      localStorage.setItem(SAVE_KEY, JSON.stringify(parsed));
      toast('Save imported — reloading', 'ok');
      setTimeout(() => location.reload(), 600);
    } catch (e) {
      toast(`Import failed: ${e.message}`, 'bad');
    }
    file.value = '';
  });
  const confirmInput = h('input', { class: 'input input--sm', placeholder: 'Type RESET', 'aria-label': 'Type RESET to confirm' });
  c.replaceChildren(
    h(
      'div',
      { class: 'quick' },
      h(
        'button',
        {
          class: 'btn btn--ghost btn--sm',
          type: 'button',
          onclick: () => {
            const blob = new Blob([JSON.stringify({ bank: bank.toJSON(), profile, settings, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
            const a = h('a', { href: URL.createObjectURL(blob), download: `peece-save-${new Date().toISOString().slice(0, 10)}.json` });
            document.body.append(a);
            a.click();
            setTimeout(() => (URL.revokeObjectURL(a.href), a.remove()), 1000);
            audit('export', 'Save exported');
          },
        },
        'Export save (.json)'
      ),
      h('label', { class: 'btn btn--ghost btn--sm', for: 'import-file' }, 'Import save…'),
      file
    ),
    h(
      'div',
      { class: 'danger' },
      h('div', {}, h('strong', {}, 'Reset everything'), h('p', { class: 'muted small' }, 'Wipes tokens, rivals, history, settings and the admin PIN on this browser. Cannot be undone.')),
      h('div', { class: 'house__row' }, confirmInput, h('button', { class: 'btn btn--danger btn--sm', type: 'button', onclick: () => (confirmInput.value.trim() === 'RESET' ? wipeAll() : toast('Type RESET to confirm', 'bad')) }, 'Reset everything'))
    )
  );
}

/* ---------- audit ---------- */
function paintAudit(c) {
  c.replaceChildren(h('ol', { class: 'audit' }, profile.audit.length ? profile.audit.map((a) => h('li', {}, h('span', { class: 'muted' }, when(a.at)), ' ', h('strong', {}, a.action), ' — ', a.detail)) : [h('li', { class: 'muted' }, 'No admin actions yet.')]));
}

export function unmount() {
  cleanups.forEach((f) => f());
  cleanups = [];
}
