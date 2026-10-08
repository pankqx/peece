import './styles/tokens.css';
import './styles/base.css';
import { route, startRouter } from './router.js';

// Screens are lazy-loaded modules exposing mount(root, params) / unmount().
route('/', () => import('./ui/screens/lobby.js'));
route('/play/:game/:rival', () => import('./ui/screens/table.js'));
route('/how-to-play', () => import('./ui/screens/howto.js'));
route('/how-to-play/:game', () => import('./ui/screens/howto.js'));
route('/treasury', () => import('./ui/screens/treasury.js'));
route('/dev/cards', () => import('./ui/screens/devcards.js'));

startRouter();
