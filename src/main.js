import './styles/tokens.css';
import './styles/base.css';
import './styles/cards.css';
import './styles/layout.css';
import { route, startRouter } from './router.js';
import { shouldShowLoader, runLoader } from './ui/screens/loader.js';
import { ensureSprite } from './cards/sprite.js';
import { faceSymbol, backSymbol } from './cards/renderCard.js';

// Screens are lazy-loaded modules exposing mount(root, params) / unmount().
const screens = {
  lobby: () => import('./ui/screens/lobby.js'),
  table: () => import('./ui/screens/table.js'),
  howto: () => import('./ui/screens/howto.js'),
  treasury: () => import('./ui/screens/treasury.js'),
  dev: () => import('./ui/screens/devcards.js'),
};
route('/', screens.lobby);
route('/play/:game/:rival', screens.table);
route('/how-to-play', screens.howto);
route('/how-to-play/:game', screens.howto);
route('/treasury', screens.treasury);
route('/dev/cards', screens.dev);

ensureSprite();

if (shouldShowLoader()) {
  // Real loading work drives the gold ring: fonts, screen modules, and the deck's symbols.
  const idle = (fn) => new Promise((r) => (window.requestIdleCallback || setTimeout)(() => r(fn())));
  runLoader([
    document.fonts?.ready ?? Promise.resolve(),
    screens.lobby(),
    screens.table(),
    idle(() => backSymbol()),
    idle(() => [12, 11, 10, 9].forEach(faceSymbol)),
    idle(() => Array.from({ length: 52 }, (_, i) => faceSymbol(i))),
  ]);
}
startRouter();
