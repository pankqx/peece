// Hash router: works on GitHub Pages and Vercel with zero server config.
// Routes: #/  #/play/:game/:rival  #/how-to-play  #/treasury  #/dev/cards
const routes = [];
let current = null;

export function route(pattern, load) {
  const keys = [];
  const re = new RegExp(
    '^' + pattern.replace(/:(\w+)/g, (_, k) => (keys.push(k), '([^/]+)')).replace(/\//g, '\\/') + '\\/?$'
  );
  routes.push({ re, keys, load });
}

export function navigate(path) {
  if (location.hash.slice(1) === path) render();
  else location.hash = path;
}

export function currentPath() {
  return location.hash.slice(1) || '/';
}

export async function render() {
  const path = currentPath();
  const root = document.getElementById('app');
  for (const r of routes) {
    const m = path.match(r.re);
    if (!m) continue;
    const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
    const mod = await r.load();
    if (current?.unmount) current.unmount();
    root.replaceChildren();
    current = mod;
    window.scrollTo(0, 0);
    await mod.mount(root, params);
    return;
  }
  navigate('/');
}

export function startRouter() {
  window.addEventListener('hashchange', render);
  return render();
}
