// The Treasury (FR-60..66, offline edition): reconciliation, balances, verifiable round history,
// the double-entry ledger with filters, and audited house controls.
import { h, fmt } from '../dom.js';
import { header } from '../components/header.js';
import { bank, profile, isLocked, onChange } from '../../state/save.js';
import { RIVALS, rivalAcct } from '../../engine/rivals.js';
import { verifySeal } from '../../engine/seal.js';
import { GAMES } from '../art.js';
import '../../styles/treasury.css';

let cleanups = [];

const label = (acct) => (acct === 'you' ? profile.name || 'You' : acct.startsWith('rival:') ? RIVALS[acct.slice(6)]?.name || acct : acct[0].toUpperCase() + acct.slice(1));
const when = (t) => new Date(t).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export function mount(root) {
  const top = header({ title: 'The Treasury' });
  cleanups.push(() => top.destroy());

  const recon = h('section', { class: 'recon panel' });
  const balances = h('div', { class: 'bal-grid' });
  const history = h('tbody');
  const ledgerBody = h('tbody');
  const auditList = h('ol', { class: 'audit' });
  const kindSel = h('select', { class: 'input input--sm', 'aria-label': 'Filter by kind' }, h('option', { value: '' }, 'All kinds'), ...['bet', 'excess-refund', 'stake-return', 'win', 'rake', 'refund', 'raise', 'mint', 'admin'].map((k) => h('option', { value: k }, k)));
  const acctSel = h('select', { class: 'input input--sm', 'aria-label': 'Filter by account' }, h('option', { value: '' }, 'All accounts'));

  function paint() {
    const r = bank.reconcile();
    recon.className = `recon panel ${r.ok ? 'is-ok' : 'is-bad'}`;
    recon.replaceChildren(
      h('div', { class: 'recon__seal', 'aria-hidden': 'true' }, r.ok ? '✓' : '!'),
      h(
        'div',
        {},
        h('p', { class: 'eyebrow' }, 'Reconciliation'),
        h('h2', {}, r.ok ? 'The books balance.' : 'The books do not balance!'),
        h('p', { class: 'muted' }, `Ever minted ${fmt(r.minted)} · held across all accounts ${fmt(r.held)} (players + escrow + treasury).`)
      )
    );

    const accts = ['you', ...Object.keys(RIVALS).map(rivalAcct), 'escrow', 'treasury'];
    balances.replaceChildren(
      ...accts.map((a) =>
        h('div', { class: `bal ${a === 'treasury' ? 'bal--gold' : ''}` }, h('span', { class: 'bal__k' }, label(a)), h('span', { class: 'bal__v tabular' }, fmt(bank.bal(a))), a === 'you' && isLocked() ? h('span', { class: 'bal__lock' }, 'Locked out') : null)
      )
    );
    if (acctSel.options.length === 1) accts.forEach((a) => acctSel.append(h('option', { value: a }, label(a))));

    history.replaceChildren(
      ...(profile.history.length
        ? profile.history.map((row) => {
            const out = h('td', { class: 'verify-cell' });
            const btn = h(
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
            );
            out.append(btn);
            return h(
              'tr',
              {},
              h('td', {}, when(row.at)),
              h('td', {}, GAMES[row.game]?.name || row.game),
              h('td', {}, RIVALS[row.rival]?.name || row.rival),
              h('td', { class: 'tabular' }, fmt(row.stake)),
              h('td', { class: `tabular ${row.net > 0 ? 'ok' : row.net < 0 ? 'bad' : ''}` }, row.net > 0 ? `+${fmt(row.net)}` : fmt(row.net)),
              h('td', {}, h('code', { title: row.commit }, `${row.commit.slice(0, 12)}…`)),
              out
            );
          })
        : [h('tr', {}, h('td', { colspan: '7', class: 'muted empty' }, 'No rounds yet. Take a seat in the Foyer.'))])
    );
    paintLedger();
    auditList.replaceChildren(...(profile.audit.length ? profile.audit.map((a) => h('li', {}, h('span', { class: 'muted' }, when(a.at)), ' ', h('strong', {}, a.action), ' — ', a.detail)) : [h('li', { class: 'muted' }, 'No house actions yet.')]));
  }

  function paintLedger() {
    const k = kindSel.value;
    const a = acctSel.value;
    const rows = bank.ledger.filter((r) => (!k || r.kind === k) && (!a || r.from === a || r.to === a)).slice(-120).reverse();
    ledgerBody.replaceChildren(
      ...rows.map((r) => h('tr', {}, h('td', { class: 'tabular muted' }, `#${r.id}`), h('td', {}, when(r.at)), h('td', {}, h('span', { class: `kind kind--${r.kind}` }, r.kind)), h('td', {}, label(r.from)), h('td', {}, '→ ', label(r.to)), h('td', { class: 'tabular' }, fmt(r.amount))))
    );
  }
  kindSel.addEventListener('change', paintLedger);
  acctSel.addEventListener('change', paintLedger);

  const page = h(
    'main',
    { class: 'screen treasury wrap' },
    h('header', { class: 'howto__head' }, h('p', { class: 'eyebrow' }, 'Fairness ledger'), h('h1', {}, 'The ', h('em', { class: 'gold-text' }, 'Treasury'))),
    recon,
    balances,
    h(
      'section',
      { class: 'panel tbl-panel' },
      h('div', { class: 'tbl-head' }, h('h2', {}, 'Your rounds'), h('p', { class: 'muted small' }, 'Each round’s deck was hashed before you bet. Verify re-hashes the revealed deck in your browser.')),
      h('div', { class: 'tbl-scroll' }, h('table', { class: 'tbl' }, h('thead', {}, h('tr', {}, ['When', 'Game', 'Rival', 'Stake', 'Net', 'Seal', ''].map((t) => h('th', { scope: 'col' }, t)))), history))
    ),
    h(
      'section',
      { class: 'panel tbl-panel' },
      h('div', { class: 'tbl-head' }, h('h2', {}, 'Ledger'), h('div', { class: 'filters' }, kindSel, acctSel)),
      h('div', { class: 'tbl-scroll' }, h('table', { class: 'tbl' }, h('thead', {}, h('tr', {}, ['#', 'When', 'Kind', 'From', 'To', 'Amount'].map((t) => h('th', { scope: 'col' }, t)))), ledgerBody))
    ),
    h('section', { class: 'house panel' }, h('p', { class: 'eyebrow' }, 'House controls'), h('h2', {}, 'Restore tokens, change rules'), h('p', { class: 'muted small' }, 'Purses, lockouts, timers, rake and data live in the PIN-protected admin console.'), h('div', { class: 'house__row' }, h('a', { class: 'btn btn--primary btn--sm', href: '#/admin' }, 'Open admin console'))),
    h('section', { class: 'panel tbl-panel' }, h('h2', {}, 'Audit log'), auditList)
  );
  root.append(top, page);
  paint();
  cleanups.push(onChange(paint));
}

export function unmount() {
  cleanups.forEach((f) => f());
  cleanups = [];
}
