const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/lobby-B3oqGerA.js","assets/art-CzhEu4Jc.js","assets/toast-DOovUkYA.js","assets/tilt-RUnDzFnH.js","assets/table-D_3tX9gb.js","assets/seal-Bnu-XgW4.js","assets/howto-Bab797vE.js","assets/treasury-CswW-8u2.js","assets/devcards-HnypwkyV.js","assets/admin-CAcRLwE-.js"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function o(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(i){if(i.ep)return;i.ep=!0;const a=o(i);fetch(i.href,a)}})();const we="modulepreload",ye=function(t){return"/peece/"+t},Zt={},tt=function(e,o,r){let i=Promise.resolve();if(o&&o.length>0){let n=function(d){return Promise.all(d.map(f=>Promise.resolve(f).then(l=>({status:"fulfilled",value:l}),l=>({status:"rejected",reason:l}))))};document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),c=s?.nonce||s?.getAttribute("nonce");i=n(o.map(d=>{if(d=ye(d),d in Zt)return;Zt[d]=!0;const f=d.endsWith(".css"),l=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${l}`))return;const m=document.createElement("link");if(m.rel=f?"stylesheet":we,f||(m.as="script"),m.crossOrigin="",m.href=d,c&&m.setAttribute("nonce",c),document.head.appendChild(m),f)return new Promise(($,g)=>{m.addEventListener("load",$),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${d}`)))})}))}function a(n){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=n,window.dispatchEvent(s),!s.defaultPrevented)throw n}return i.then(n=>{for(const s of n||[])s.status==="rejected"&&a(s.reason);return e().catch(a)})},Yt=[];let bt=null;function J(t,e){const o=[],r=new RegExp("^"+t.replace(/:(\w+)/g,(i,a)=>(o.push(a),"([^/]+)")).replace(/\//g,"\\/")+"\\/?$");Yt.push({re:r,keys:o,load:e})}function $e(t){location.hash.slice(1)===t?_t():location.hash=t}function be(){return location.hash.slice(1)||"/"}async function _t(){const t=be(),e=document.getElementById("app");for(const o of Yt){const r=t.match(o.re);if(!r)continue;const i=Object.fromEntries(o.keys.map((n,s)=>[n,decodeURIComponent(r[s+1])])),a=await o.load();bt?.unmount&&bt.unmount(),e.replaceChildren(),bt=a,window.scrollTo(0,0),await a.mount(e,i);return}$e("/")}function xe(){return window.addEventListener("hashchange",_t),_t()}function A(t,e={},...o){const r=document.createElement(t);for(const[i,a]of Object.entries(e||{}))if(!(a==null||a===!1))if(i==="class")r.className=a;else if(i==="style"&&typeof a=="object")for(const[n,s]of Object.entries(a))n.startsWith("--")?r.style.setProperty(n,s):r.style[n]=s;else i==="dataset"?Object.assign(r.dataset,a):i.startsWith("on")&&typeof a=="function"?r.addEventListener(i.slice(2),a):i==="html"?r.append(Lt(a)):a===!0?r.setAttribute(i,""):r.setAttribute(i,a);return ke(r,o),r}function ke(t,e){for(const o of e.flat(1/0))o==null||o===!1||t.append(o instanceof Node?o:document.createTextNode(String(o)))}function Lt(t){const e=document.createElement("template");return e.innerHTML=t.trim(),e.content}function Cr(t){const e=document.getElementById("sr-live");e&&(e.textContent="",requestAnimationFrame(()=>e.textContent=t))}const Me=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,nt=t=>new Promise(e=>setTimeout(e,t));function Er(t){return Math.round(t).toLocaleString("en-US")}const It=["M50 4C61 22 95 38 95 61C95 75 85 83 73 83C64 83 57 79 53.5 72C54.5 81 59 89 67 95H33C41 89 45.5 81 46.5 72C43 79 36 83 27 83C15 83 5 75 5 61C5 38 39 22 50 4Z","M50 92C21 68 4 51 4 31C4 16 15 6 28.5 6C38.5 6 46 12 50 21C54 12 61.5 6 71.5 6C85 6 96 16 96 31C96 51 79 68 50 92Z","M50 3C59 21 73 37 91 50C73 63 59 79 50 97C41 79 27 63 9 50C27 37 41 21 50 3Z","M31 30a19 19 0 1 0 38 0a19 19 0 1 0-38 0ZM9 58a19 19 0 1 0 38 0a19 19 0 1 0-38 0ZM53 58a19 19 0 1 0 38 0a19 19 0 1 0-38 0ZM38 46L50 68L62 46ZM46 62C46 78 41 88 32 95H68C59 88 54 78 54 62Z"],ve=`
<defs>
  <linearGradient id="goldA" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f6e3a3"/><stop offset=".35" stop-color="#d8b45a"/>
    <stop offset=".6" stop-color="#a8832f"/><stop offset="1" stop-color="#f1dc9a"/>
  </linearGradient>
  <linearGradient id="goldB" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fbeab0"/><stop offset=".5" stop-color="#c9a24a"/><stop offset="1" stop-color="#8a6a24"/>
  </linearGradient>
  <linearGradient id="goldC" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#8a6a24"/><stop offset=".5" stop-color="#f6e3a3"/><stop offset="1" stop-color="#8a6a24"/>
  </linearGradient>
  <linearGradient id="paper" x1="0" y1="0" x2="0.4" y2="1">
    <stop offset="0" stop-color="#fdfaf1"/><stop offset=".55" stop-color="#f6efdc"/><stop offset="1" stop-color="#ece2c6"/>
  </linearGradient>
  <linearGradient id="inkG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2d2820"/><stop offset="1" stop-color="#0b0906"/>
  </linearGradient>
  <linearGradient id="rubyG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#cf3343"/><stop offset="1" stop-color="#7d1622"/>
  </linearGradient>
  <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#8d97a3"/><stop offset=".45" stop-color="#f4f6f8"/><stop offset="1" stop-color="#7c8692"/>
  </linearGradient>
  <linearGradient id="navyG" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#172846"/><stop offset=".55" stop-color="#0f1c33"/><stop offset="1" stop-color="#070d18"/>
  </linearGradient>
  <radialGradient id="skin" cx=".45" cy=".4" r=".7">
    <stop offset="0" stop-color="#fbe3c8"/><stop offset=".8" stop-color="#e9c29c"/><stop offset="1" stop-color="#d9ab80"/>
  </radialGradient>
  <radialGradient id="aceGlow" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#f6e3a3" stop-opacity=".55"/><stop offset="1" stop-color="#f6e3a3" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="pearl" cx=".35" cy=".3" r=".8">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#efe6d2"/><stop offset="1" stop-color="#bdb19a"/>
  </radialGradient>
  <filter id="grainF" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix values="0 0 0 0 .35  0 0 0 0 .28  0 0 0 0 .18  0 0 0 .55 0"/>
  </filter>
  <pattern id="grain" width="140" height="140" patternUnits="userSpaceOnUse">
    <rect width="140" height="140" filter="url(#grainF)" opacity=".5"/>
  </pattern>
  <pattern id="lattice" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <path d="M0 0H14M0 0V14" stroke="#c9a24a" stroke-width=".5" opacity=".35" fill="none"/>
    <circle cx="7" cy="7" r=".9" fill="#c9a24a" opacity=".45"/>
  </pattern>
  <pattern id="backLattice" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45 125 175)">
    <rect width="22" height="22" fill="none" stroke="#c9a24a" stroke-width=".7" opacity=".55"/>
    <rect x="7" y="7" width="8" height="8" fill="none" stroke="#e2c36b" stroke-width=".6" opacity=".7"/>
    <circle cx="0" cy="0" r="2.2" fill="#e2c36b" opacity=".75"/>
    <circle cx="11" cy="11" r="1.1" fill="#f1dc9a" opacity=".6"/>
  </pattern>
  <clipPath id="courtHalf"><rect x="46" y="46" width="158" height="129"/></clipPath>
  <clipPath id="cardClip"><rect width="250" height="350" rx="14"/></clipPath>
  <path id="aceRingPath" d="M125 175m-61 0a61 61 0 1 1 122 0a61 61 0 1 1-122 0"/>
  ${It.map((t,e)=>`<symbol id="suit-${e}" viewBox="0 0 100 100"><path d="${t}"/></symbol>`).join("")}
</defs>`;let _=null;function Ft(){return _&&document.body.contains(_)||(_=document.createElementNS("http://www.w3.org/2000/svg","svg"),_.setAttribute("id","peece-sprite"),_.setAttribute("aria-hidden","true"),_.setAttribute("width","0"),_.setAttribute("height","0"),_.style.position="absolute",_.style.width="0",_.style.height="0",_.style.overflow="hidden",_.innerHTML=ve,document.body.prepend(_)),_}function Jt(t,e,o="0 0 250 350"){const r=Ft();if(r.querySelector(`#${t}`))return t;const i=r.querySelector("defs"),a=document.createElementNS("http://www.w3.org/2000/svg","svg");return a.innerHTML=`<symbol id="${t}" viewBox="${o}">${e()}</symbol>`,i.append(a.firstChild),t}function K(t,e,o,r,i={}){const a=i.fill??(t===1||t===2?"url(#rubyG)":"url(#inkG)"),n=i.rotate?` transform="rotate(180 ${e+r/2} ${o+r/2})"`:"",s=i.stroke?` stroke="${i.stroke}" stroke-width="${i.strokeWidth??1.2}"`:"";return`<use href="#suit-${t}" x="${e}" y="${o}" width="${r}" height="${r}" fill="${a}"${s}${n}/>`}function Ar(t,e="suit-ico"){return Ft(),`<svg class="${e}" viewBox="0 0 100 100" aria-hidden="true"><use href="#suit-${t}" fill="${t===1||t===2?"var(--ruby-bright)":"currentColor"}"/></svg>`}function Qt(t="url(#goldA)",e="#8a6a24"){const o=(r,i,a,n)=>`<path d="${It[r]}" transform="translate(${i} ${a}) scale(${n/100})" fill="${t}" stroke="${e}" stroke-width="${80/n}"/>`;return`<path d="M12 48L8 24L21 35L32 18L43 35L56 24L52 48Z" fill="${t}" stroke="${e}" stroke-width=".8" stroke-linejoin="round"/>
    <rect x="11" y="48" width="42" height="7" rx="2" fill="${t}" stroke="${e}" stroke-width=".8"/>
    <circle cx="22" cy="51.5" r="1.6" fill="${e}"/><circle cx="32" cy="51.5" r="1.9" fill="${e}"/><circle cx="42" cy="51.5" r="1.6" fill="${e}"/>
    ${o(0,1.5,11,13)}${o(1,25,4,14)}${o(2,49.5,11,13)}`}function Ce(t="crown-mark",e="crownGrad"){return`<svg class="${t}" viewBox="0 0 64 64" aria-hidden="true">
    <defs><linearGradient id="${e}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f6e3a3"/><stop offset=".4" stop-color="#d8b45a"/>
      <stop offset=".7" stop-color="#a8832f"/><stop offset="1" stop-color="#f1dc9a"/></linearGradient></defs>
    ${Qt(`url(#${e})`)}</svg>`}const b=.18,F=.5,x=.82,X=1/3,Ee={2:[[F,0],[F,1]],3:[[F,0],[F,.5],[F,1]],4:[[b,0],[x,0],[b,1],[x,1]],5:[[b,0],[x,0],[F,.5],[b,1],[x,1]],6:[[b,0],[x,0],[b,.5],[x,.5],[b,1],[x,1]],7:[[b,0],[x,0],[F,.25],[b,.5],[x,.5],[b,1],[x,1]],8:[[b,0],[x,0],[F,.25],[b,.5],[x,.5],[F,.75],[b,1],[x,1]],9:[[b,0],[x,0],[b,X],[x,X],[F,.5],[b,2*X],[x,2*X],[b,1],[x,1]],10:[[b,0],[x,0],[F,1/6],[b,X],[x,X],[b,2*X],[x,2*X],[F,5/6],[b,1],[x,1]]},dt={x:64,y:70,w:122,h:210},Bt=40;function Ae(t,e){const o=Ee[t],r=t<=3?46:Bt;return o.map(([i,a])=>{const n=a===.5&&(t===3||t===5||t===9)?r+4:t<=3?r:Bt,s=dt.x+i*dt.w,c=dt.y+a*dt.h;return K(e,s-n/2,c-n/2,n,{rotate:a>.5})}).join("")}const _e=[{robe:"#1b2d55",deep:"#0a1220",light:"#3a5794",hair:"#2f2216",trim:"#e2c36b"},{robe:"#9b1c2e",deep:"#5a0f1a",light:"#cc3b4d",hair:"#5e3218",trim:"#f1dc9a"},{robe:"#bf7a1a",deep:"#7a4a0e",light:"#e4a748",hair:"#43290f",trim:"#fbeab0"},{robe:"#11674b",deep:"#073526",light:"#22926b",hair:"#2a1f14",trim:"#e2c36b"}];function Gt(t){let e="";for(let o=0;o<3;o++)for(let r=0;r<9;r++){const i=58+r*17+o%2*8,a=152+o*8;i>106&&i<144||(e+=`<path d="M${i} ${a}l2.4 2.4-2.4 2.4-2.4-2.4Z" fill="${t.trim}" opacity=".55"/>`)}return`<g data-layer="robe">
    <path d="M46 175V158C54 141 79 132 101 128H149C171 132 196 141 204 158V175Z" fill="${t.robe}"/>
    <path d="M46 175V158C54 141 79 132 101 128H113C97 136 82 152 79 175Z" fill="${t.deep}" opacity=".5"/>
    <path d="M204 175V158C196 141 171 132 149 128H140C156 136 170 152 173 175Z" fill="#fff" opacity=".07"/>
    ${e}
    <path d="M46 158C54 141 79 132 101 128M204 158C196 141 171 132 149 128" stroke="url(#goldB)" stroke-width="2.6" fill="none"/>
    <rect x="118" y="140" width="14" height="35" fill="url(#goldB)"/>
    <path d="M125 146l4 5-4 5-4-5Zm0 14l4 5-4 5-4-5Z" fill="${t.deep}"/>
  </g>`}function Le(t=139){const e=[92,108,125,142,158].map((o,r)=>{const i=t-1+(r===0||r===4?-2:1);return`<path d="M${o} ${i}c-1.7 3.2-1.7 5.6 0 7.6c1.7-2 1.7-4.4 0-7.6Z" fill="#14110c"/><path d="M${o-2.6} ${i-1.6}h5.2" stroke="#14110c" stroke-width=".9"/>`}).join("");return`<g data-layer="ermine">
    <path d="M76 ${t}C88 ${t-13} 107 ${t-16} 125 ${t-16}C143 ${t-16} 162 ${t-13} 174 ${t}C162 ${t+10} 141 ${t+7} 125 ${t+7}C109 ${t+7} 88 ${t+10} 76 ${t}Z" fill="#fbf7ec" stroke="#cfc3a2" stroke-width=".8"/>
    ${e}
  </g>`}function Nt(t,{cy:e=98,rx:o=15.5,ry:r=19,lips:i="#a5524a",lashes:a=!1}={}){const n=e;return`<g data-layer="face">
    <rect x="117.5" y="${e+12}" width="15" height="16" fill="url(#skin)"/>
    <ellipse cx="125" cy="${e}" rx="${o}" ry="${r}" fill="url(#skin)" stroke="#c99a70" stroke-width=".6"/>
    <circle cx="116" cy="${e+6}" r="3.6" fill="#e0767f" opacity=".22"/>
    <circle cx="134" cy="${e+6}" r="3.6" fill="#e0767f" opacity=".22"/>
    <path d="M114.5 ${n-5}q4-2.6 8 0M127.5 ${n-5}q4-2.6 8 0" stroke="${t.hair}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <ellipse cx="119" cy="${n}" rx="2" ry="1.4" fill="#1e1a14"/>
    <ellipse cx="131" cy="${n}" rx="2" ry="1.4" fill="#1e1a14"/>
    ${a?`<path d="M116.6 ${n-1.2}l-1.6-1.4M133.4 ${n-1.2}l1.6-1.4" stroke="#1e1a14" stroke-width=".8"/>`:""}
    <path d="M125 ${n+1}v7.5l-2.6 1.3" stroke="#b0805a" stroke-width="1" fill="none" stroke-linecap="round"/>
    <path d="M121 ${n+13}q4 2.6 8 0q-4-1.2-8 0Z" fill="${i}"/>
  </g>`}function te(t,e=125,o=158){return`<circle cx="${e}" cy="${o}" r="12.5" fill="#fbf7ec" stroke="url(#goldA)" stroke-width="2.2"/>
    <circle cx="${e}" cy="${o}" r="9.5" fill="none" stroke="#c9a24a" stroke-width=".5"/>
    ${K(t,e-7.5,o-7.5,15)}`}const it=(t,e)=>`<ellipse cx="${t}" cy="${e}" rx="7" ry="5.6" fill="url(#skin)" stroke="#c99a70" stroke-width=".6"/>`,Se=()=>`<g data-layer="prop">
  <path d="M167 54l3.5-9 3.5 9V146h-7Z" fill="url(#steel)" stroke="#5b636c" stroke-width=".5"/>
  <path d="M170.5 50V144" stroke="#fff" stroke-width=".6" opacity=".7"/>
  <rect x="156" y="144" width="29" height="5.5" rx="2.6" fill="url(#goldB)" stroke="#8a6a24" stroke-width=".5"/>
  <rect x="167.5" y="149" width="6" height="16" fill="#3b2a1a"/>
  <circle cx="170.5" cy="167" r="4.2" fill="url(#goldA)"/>
  ${it(170.5,157)}
</g>`,Te=()=>`<g data-layer="prop">
  <rect x="168" y="62" width="5" height="104" rx="2.4" fill="url(#goldB)"/>
  <rect x="166.5" y="88" width="8" height="3" rx="1.5" fill="url(#goldA)"/>
  <rect x="166.5" y="120" width="8" height="3" rx="1.5" fill="url(#goldA)"/>
  <circle cx="170.5" cy="57" r="8.5" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".8"/>
  <circle cx="170.5" cy="57" r="3.2" fill="#b3202e"/>
  <path d="M170.5 41v9M166 45.5h9" stroke="url(#goldB)" stroke-width="2.4" stroke-linecap="round"/>
  ${it(170.5,157)}
</g>`,Pe=()=>`<g data-layer="prop">
  <path d="M86 168C84 148 88 128 88 112" stroke="#2f6b3f" stroke-width="2.2" fill="none"/>
  <path d="M87 136c-8-4-12-2-14 2c6 2 10 2 14-2ZM88 126c7-5 11-4 13-1c-5 3-9 3-13 1Z" fill="#2f8a52"/>
  <circle cx="88" cy="107" r="8" fill="#9b1c2e"/>
  <circle cx="88" cy="107" r="5.6" fill="#cc3b4d"/>
  <path d="M84.5 106.5q3.5-4 7 0q-3.5 3.6-7 0Z" fill="#7d1622"/>
  <path d="M82 101q6-3 12 0" stroke="#e8707c" stroke-width=".8" fill="none"/>
  ${it(86,154)}
</g>`,Re=t=>{let e="";for(let o=0;o<=8;o++){const r=Math.PI*(1.08+o/8*.84);e+=`<path d="M86 132L${(86+Math.cos(r)*30).toFixed(1)} ${(132+Math.sin(r)*30).toFixed(1)}" stroke="#8a6a24" stroke-width=".7"/>`}return`<g data-layer="prop">
    <path d="M86 132L${(86+Math.cos(Math.PI*1.08)*32).toFixed(1)} ${(132+Math.sin(Math.PI*1.08)*32).toFixed(1)}A32 32 0 0 1 ${(86+Math.cos(Math.PI*1.92)*32).toFixed(1)} ${(132+Math.sin(Math.PI*1.92)*32).toFixed(1)}Z" fill="${t.light}" stroke="url(#goldA)" stroke-width="1.4"/>
    <path d="M86 132L${(86+Math.cos(Math.PI*1.08)*22).toFixed(1)} ${(132+Math.sin(Math.PI*1.08)*22).toFixed(1)}A22 22 0 0 1 ${(86+Math.cos(Math.PI*1.92)*22).toFixed(1)} ${(132+Math.sin(Math.PI*1.92)*22).toFixed(1)}" fill="none" stroke="#fbeab0" stroke-width=".8" opacity=".8"/>
    ${e}
    ${it(86,138)}
  </g>`},Ie=()=>`<g data-layer="prop">
  <rect x="83.5" y="96" width="4.5" height="72" rx="2" fill="url(#goldB)"/>
  <path d="M85.7 98c-8-4-10-14-7-22c3 5 5 7 7 7c2 0 4-2 7-7c3 8 1 18-7 22Z" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".7"/>
  <path d="M85.7 96c-2-6-1-12 0-16c1 4 2 10 0 16Z" fill="#fbeab0"/>
  <circle cx="85.7" cy="104" r="2.2" fill="#b3202e"/>
  ${it(86,150)}
</g>`,Fe=()=>`<g data-layer="prop">
  <rect x="168" y="58" width="4.5" height="112" rx="2" fill="#6b4a2b"/>
  <path d="M170.2 40l3.6 14h-7.2Z" fill="url(#steel)" stroke="#5b636c" stroke-width=".5"/>
  <path d="M172.5 60c10-2 17 4 18 14c-6-4-12-5-18-3Z" fill="url(#steel)" stroke="#5b636c" stroke-width=".6"/>
  <path d="M168 62c-5 0-8 3-9 7c3-2 6-2 9-2Z" fill="url(#steel)" stroke="#5b636c" stroke-width=".5"/>
  <path d="M166 76h9" stroke="url(#goldA)" stroke-width="3"/>
  <path d="M170.2 78c-3 4-4 8-2 12M170.2 78c3 4 4 8 2 12" stroke="#b3202e" stroke-width="1.6" fill="none"/>
  ${it(170.2,152)}
</g>`;function Ge(t,e){const o=t===0||t===3?Se():Te();return`${Gt(e)}
    <path data-layer="hair" d="M104 93C102 78 112 66 125 66C138 66 148 78 146 93C148 105 146 117 140 124H110C104 117 102 105 104 93Z" fill="${e.hair}"/>
    ${Le()}
    ${Nt(e)}
    <path d="M109.5 100C110 116 116 129 125 134C134 129 140 116 140.5 100C137 111 132 116 125 116C118 116 113 111 109.5 100Z" fill="${e.hair}"/>
    <path d="M118 120q2 6 0 10M125 122v10M132 120q-2 6 0 10" stroke="#000" stroke-width=".6" opacity=".35" fill="none"/>
    <path d="M114 110.5q5.5-4.5 11-1.2q5.5-3.3 11 1.2q-5.5.8-11 .6q-5.5.2-11-.6Z" fill="${e.hair}"/>
    <g data-layer="crown">
      <path d="M106 76L103.5 56L114 66.5L119 51L125 61L131 51L136 66.5L146.5 56L144 76Z" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".8"/>
      <rect x="105.5" y="74" width="39" height="9.5" rx="1.6" fill="url(#goldB)" stroke="#8a6a24" stroke-width=".7"/>
      <circle cx="103.5" cy="56" r="2.6" fill="url(#pearl)"/><circle cx="119" cy="51" r="2.6" fill="url(#pearl)"/>
      <circle cx="131" cy="51" r="2.6" fill="url(#pearl)"/><circle cx="146.5" cy="56" r="2.6" fill="url(#pearl)"/>
      <path d="M125 45v13M120.6 49.4h8.8" stroke="url(#goldB)" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="125" cy="78.8" r="2.8" fill="#b3202e" stroke="#fbeab0" stroke-width=".5"/>
      <circle cx="114.5" cy="78.8" r="1.9" fill="#1f8d68"/><circle cx="135.5" cy="78.8" r="1.9" fill="#1f8d68"/>
    </g>
    ${o}
    ${te(t)}`}function Ne(t,e){const o=t===1?Pe():t===2?Re(e):Ie();let r="";for(let i=0;i<=8;i++){const a=Math.PI*(.15+i/8*.7);r+=`<circle cx="${(125+Math.cos(a)*15).toFixed(1)}" cy="${(124+Math.sin(a)*9).toFixed(1)}" r="1.7" fill="url(#pearl)"/>`}return`<path data-layer="veil" d="M101 82C92 104 85 132 78 175H172C165 132 158 104 149 82Z" fill="#fbf7ec" opacity=".5"/>
    <path d="M104 92C88 120 84 150 82 175M146 92C162 120 166 150 168 175" stroke="#d9cfb3" stroke-width=".6" fill="none" opacity=".8"/>
    ${Gt(e)}
    <path data-layer="hair" d="M106 92C102 76 112 64 125 64C138 64 148 76 144 92C150 110 152 128 146 140H104C98 128 100 110 106 92Z" fill="${e.hair}"/>
    <path d="M84 139q10 8 20 0q10 8 21 0q10 8 21 0q10 8 20 0L166 132C150 125 100 125 84 132Z" fill="#fbf7ec" stroke="url(#goldB)" stroke-width="1"/>
    ${Nt(e,{cy:97,rx:14.5,ry:18,lips:"#b3202e",lashes:!0})}
    <path d="M110.5 92C113 82 119 79 125 79C131 79 137 82 139.5 92C136 86 131 84 125 84C119 84 114 86 110.5 92Z" fill="${e.hair}"/>
    ${r}
    <circle cx="125" cy="133.5" r="2.6" fill="#b3202e" stroke="#fbeab0" stroke-width=".5"/>
    <g data-layer="crown">
      <path d="M109 78L111 63L118 71L125 57L132 71L139 63L141 78Z" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".7"/>
      <rect x="108.5" y="76" width="33" height="5.5" rx="1.4" fill="url(#goldB)" stroke="#8a6a24" stroke-width=".6"/>
      <circle cx="111" cy="63" r="2" fill="url(#pearl)"/><circle cx="125" cy="57" r="2.3" fill="url(#pearl)"/><circle cx="139" cy="63" r="2" fill="url(#pearl)"/>
      <path d="M125 64l3 4.5-3 4.5-3-4.5Z" fill="#b3202e" stroke="#fbeab0" stroke-width=".5"/>
    </g>
    ${o}
    ${te(t,125,160)}`}function Ze(t,e){return`${Gt(e)}
    <path data-layer="sash" d="M58 146L76 136L196 175H158Z" fill="url(#goldB)" opacity=".92"/>
    <path d="M62 147L196 175" stroke="#8a6a24" stroke-width=".6" opacity=".7"/>
    <g data-layer="ruff">${[104,111,118,125,132,139,146].map(o=>`<circle cx="${o}" cy="128" r="4.2" fill="#fbf7ec" stroke="#cfc3a2" stroke-width=".6"/>`).join("")}</g>
    ${Nt(e,{cy:100,rx:14,ry:17,lips:"#a5524a"})}
    <path data-layer="hair" d="M107 98C104 82 113 72 125 72C137 72 146 82 143 98C140 91 134 87 125 87C116 87 110 91 107 98Z" fill="${e.hair}"/>
    <circle cx="108.5" cy="99" r="3.6" fill="${e.hair}"/><circle cx="141.5" cy="99" r="3.6" fill="${e.hair}"/>
    <g data-layer="crown">
      <path d="M138 74C149 60 160 51 178 48C168 57 158 66 143 78Z" fill="#fbf7ec" stroke="#cfc3a2" stroke-width=".7"/>
      <path d="M142 75C152 64 162 56 175 50" stroke="#cfc3a2" stroke-width=".6" fill="none"/>
      <path d="M103 80C104 67 114 60 125 60C136 60 145 66 147 78Z" fill="${e.light}"/>
      <ellipse cx="125" cy="79" rx="24" ry="5.5" fill="${e.robe}" stroke="url(#goldB)" stroke-width="1.4"/>
      <circle cx="140" cy="76" r="3" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".5"/>
    </g>
    <g data-layer="shield">
      <path d="M68 118h32v19c0 13-9 21-16 25c-7-4-16-12-16-25Z" fill="#fbf7ec" stroke="url(#goldA)" stroke-width="2.2"/>
      <path d="M72 122h24v15c0 10-6 16-12 19c-6-3-12-9-12-19Z" fill="none" stroke="${e.robe}" stroke-width=".8"/>
      ${K(t,75.5,127,17)}
    </g>
    ${Fe()}`}function Be(){const t='<path d="M50 70C50 58 56 50 68 50M50 60C53 56 56 55 58 50M57 70c0-6 3-10 9-10" stroke="url(#goldB)" stroke-width="1.3" fill="none" stroke-linecap="round"/><circle cx="50" cy="72.5" r="1.6" fill="#c9a24a"/><circle cx="70.5" cy="50" r="1.6" fill="#c9a24a"/>';return`<g data-layer="filigree">
    ${t}
    <g transform="matrix(-1 0 0 1 250 0)">${t}</g>
    <g transform="matrix(1 0 0 -1 0 350)">${t}</g>
    <g transform="rotate(180 125 175)">${t}</g>
  </g>`}function qe(t,e){const o=_e[e],r=t===11?Ge(e,o):t===10?Ne(e,o):Ze(e,o);return`<g data-layer="base">
      <rect x="46" y="46" width="158" height="258" rx="5" fill="#fbf7ec"/>
      <rect x="46" y="46" width="158" height="258" rx="5" fill="url(#lattice)"/>
    </g>
    <g clip-path="url(#courtHalf)">${r}</g>
    <g transform="rotate(180 125 175)"><g clip-path="url(#courtHalf)">${r}</g></g>
    <path d="M46 175H204" stroke="url(#goldC)" stroke-width="1.6"/>
    <path d="M125 169l6 6-6 6-6-6Z" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".6"/>
    <rect x="46" y="46" width="158" height="258" rx="5" fill="none" stroke="url(#goldA)" stroke-width="2"/>
    <rect x="50" y="50" width="150" height="250" rx="3" fill="none" stroke="#c9a24a" stroke-width=".6"/>
    ${Be()}`}const S=125,N=175;function Oe(){let t="";for(let e=0;e<24;e++){const o=e/24*Math.PI*2,r=e%2===0,i=70,a=r?104:88,n=r?.045:.03,s=(c,d)=>`${(S+Math.cos(o+d)*c).toFixed(1)} ${(N+Math.sin(o+d)*c).toFixed(1)}`;t+=`<path d="M${s(i,-n)}L${s(a,0)}L${s(i,n)}Z" fill="url(#goldB)" opacity="${r?.8:.5}"/>`}return t}function qt(t){let e="";const o=t==="left"?-1:1;for(let r=0;r<9;r++){const i=Math.PI/2+o*(.35+r*.13),a=80,n=S+Math.cos(i)*a,s=N+Math.sin(i)*a,c=i*180/Math.PI+(t==="left"?-60:60);e+=`<ellipse cx="${n.toFixed(1)}" cy="${s.toFixed(1)}" rx="7" ry="2.6" transform="rotate(${c.toFixed(1)} ${n.toFixed(1)} ${s.toFixed(1)})" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".4"/>`}return e}function Ue(){return`<g data-layer="body">
    <circle cx="${S}" cy="${N}" r="104" fill="url(#aceGlow)"/>
    ${Oe()}
    ${qt("left")}${qt("right")}
    <circle cx="${S}" cy="${N}" r="69" fill="#fbf7ec" stroke="url(#goldA)" stroke-width="2.4"/>
    <circle cx="${S}" cy="${N}" r="54" fill="none" stroke="#c9a24a" stroke-width=".8"/>
    <g class="ace-ring">
      <text font-family="Cormorant Garamond, Georgia, serif" font-size="9.6" font-weight="700" letter-spacing="2.6" fill="#8a6a24">
        <textPath href="#aceRingPath">PEECE · EST · MMXXVI · PEECE · EST · MMXXVI ·</textPath>
      </text>
    </g>
    ${K(0,S-40,N-42,80,{stroke:"#c9a24a",strokeWidth:1.4})}
    <path d="M${S} ${N-12}l3 5-3 5-3-5Z" fill="url(#goldA)"/>
    ${K(0,S-7,52,14,{fill:"url(#goldB)"})}
    ${K(0,S-7,284,14,{fill:"url(#goldB)",rotate:!0})}
  </g>`}function He(t){return`<g data-layer="body">
    <circle cx="${S}" cy="${N}" r="58" fill="none" stroke="#c9a24a" stroke-width="1" opacity=".7"/>
    <circle cx="${S}" cy="${N}" r="52" fill="none" stroke="#c9a24a" stroke-width=".5" opacity=".6"/>
    ${[0,1,2,3].map(e=>`<path d="M${S} ${N-66+(e%2?132:0)}l3 4-3 4-3-4Z" fill="#c9a24a" transform="rotate(${e<2?0:90} ${S} ${N})"/>`).join("")}
    ${K(t,S-36,N-36,72)}
  </g>`}function De(){return`<rect width="250" height="350" rx="14" fill="#fbf7ec"/>
    <rect x="6" y="6" width="238" height="338" rx="10" fill="url(#goldA)"/>
    <rect x="9" y="9" width="232" height="332" rx="8" fill="url(#navyG)"/>
    <rect x="9" y="9" width="232" height="332" rx="8" fill="url(#backLattice)"/>
    <rect x="20" y="20" width="210" height="310" rx="6" fill="none" stroke="url(#goldA)" stroke-width="1.4"/>
    <rect x="25" y="25" width="200" height="300" rx="4" fill="none" stroke="#c9a24a" stroke-width=".6" opacity=".7"/>
    <circle cx="125" cy="175" r="54" fill="#0a1220" stroke="url(#goldA)" stroke-width="2.2"/>
    <circle cx="125" cy="175" r="47" fill="none" stroke="#c9a24a" stroke-width=".7" opacity=".8"/>
    ${[...Array(16)].map((t,e)=>`<circle cx="${(125+Math.cos(e/16*Math.PI*2)*50.5).toFixed(1)}" cy="${(175+Math.sin(e/16*Math.PI*2)*50.5).toFixed(1)}" r="1.2" fill="#e2c36b"/>`).join("")}
    <g transform="translate(125 172) scale(1.15) translate(-32 -34)">${Qt("url(#goldA)")}</g>
    ${[[34,34],[216,34],[34,316],[216,316]].map(([t,e])=>`<path d="M${t} ${e-7}l7 7-7 7-7-7Z" fill="url(#goldA)"/>`).join("")}`}const je=["♠","♥","♦","♣"],Ve=["Spades","Hearts","Diamonds","Clubs"],ee=["2","3","4","5","6","7","8","9","10","J","Q","K","A"],We=["Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Jack","Queen","King","Ace"],C=t=>Math.floor(t/13),Z=t=>t%13,Xe=t=>C(t)===1||C(t)===2,st=t=>3-t,re=t=>`${We[Z(t)]} of ${Ve[C(t)]}`,_r=t=>`${ee[Z(t)]}${je[C(t)]}`,Ke=()=>Array.from({length:52},(t,e)=>e),Ot="http://www.w3.org/2000/svg";function ze(t,e){const o=e===1||e===2?"#a3202e":"#14110c",r=ee[t],a=`<text x="27" y="50" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-weight="700" font-size="${r==="10"?34:40}" letter-spacing="${r==="10"?-2:0}" fill="${o}">${r}</text>
    ${K(e,17,57,20)}`;return`<g data-layer="indices">${a}<g transform="rotate(180 125 175)">${a}</g></g>`}function Ye(t){const e=Z(t),o=C(t);let r;return e===12?r=o===0?Ue():He(o):e>=9?r=qe(e,o):r=`<g data-layer="body">${Ae(e+2,o)}</g>`,`<g clip-path="url(#cardClip)">
      <rect data-layer="base" width="250" height="350" rx="14" fill="url(#paper)"/>
      <rect width="250" height="350" fill="url(#grain)" opacity=".55"/>
    </g>
    <g data-layer="frame">
      <rect x="8" y="8" width="234" height="334" rx="10" fill="none" stroke="url(#goldA)" stroke-width="2"/>
      <rect x="11.5" y="11.5" width="227" height="327" rx="8" fill="none" stroke="#c9a24a" stroke-width=".75" opacity=".85"/>
    </g>
    ${r}
    ${ze(e,o)}
    <rect width="250" height="350" rx="14" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1"/>`}function St(t){return Jt(`card-${t}`,()=>Ye(t))}function oe(){return Jt("card-back",De)}function Ut(t,e="card-svg"){const o=t==="back"?oe():St(t),r=document.createElementNS(Ot,"svg");r.setAttribute("viewBox","0 0 250 350"),r.setAttribute("class",e),r.setAttribute("role","img"),r.setAttribute("aria-label",t==="back"?"Card back":re(t));const i=document.createElementNS(Ot,"use");return i.setAttribute("href",`#${o}`),r.append(i),r}function Je({id:t=null,faceUp:e=!0,button:o=!1,label:r}={}){const i=document.createElement(o?"button":"div");i.className="card",o?(i.type="button",i.setAttribute("aria-pressed","false")):i.setAttribute("role","img");const a=document.createElement("div");a.className="card__inner";const n=document.createElement("div");n.className="card__face card__front";const s=document.createElement("div");s.className="card__face card__back",s.append(Ut("back"));const c=document.createElement("div");c.className="card__sheen",a.append(n,s),i.append(a,c),i.setFace=f=>{i.dataset.id=f??"",n.replaceChildren(),f!=null&&(n.append(Ut(f)),i.classList.toggle("is-red",Xe(f))),d()};const d=()=>{const f=i.dataset.id!==""&&i.dataset.id!=null,l=r||(f&&!i.classList.contains("is-down")?re(+i.dataset.id):"Face-down card");i.setAttribute("aria-label",l)};return i.flip=f=>{i.classList.toggle("is-down",!f),d()},i.setFace(t),i.flip(e&&t!=null),i}const xt=[[255,250,210],[255,214,120],[255,150,40],[214,70,20],[120,20,10]];function Ht(t,e){const o=Math.min(.999,Math.max(0,t))*(xt.length-1),r=Math.floor(o),i=o-r,a=xt[r].map((n,s)=>Math.round(n+(xt[r+1][s]-n)*i));return`rgba(${a[0]},${a[1]},${a[2]},${e})`}const kt=(t,e)=>Math.sin(t*1.7+e*1.3)*.5+Math.sin(t*3.1-e*2.1)*.3+Math.sin(t*5.3+e*3.7)*.2;function Qe(t,e=64){const o=document.createElement("canvas");o.width=o.height=e;const r=o.getContext("2d"),i=r.createRadialGradient(e/2,e/2,0,e/2,e/2,e/2);return i.addColorStop(0,t.replace("A","1")),i.addColorStop(.35,t.replace("A",".55")),i.addColorStop(1,t.replace("A","0")),r.fillStyle=i,r.fillRect(0,0,e,e),o}function tr({back:t,front:e,target:o,budget:r=1,embersOnly:i=!1}){const a=t.getContext("2d"),n=e.getContext("2d"),s=Math.min(2,window.devicePixelRatio||1),c=[0,.25,.5,.75,.95].map(h=>Qe(Ht(h,"A")));let d=0,f=0,l=null,m=[],$=[],g=!1,R=0,E=0,P=1;const z=Math.round(260*r),O=Math.round(80*r);function j(){d=window.innerWidth,f=window.innerHeight;for(const h of[t,e])h.width=Math.round(d*s),h.height=Math.round(f*s),h.style.width=`${d}px`,h.style.height=`${f}px`,h.getContext("2d").setTransform(s,0,0,s,0,0);l=o.getBoundingClientRect()}function v(h){for(let y=0;y<h&&m.length<z;y++){const L=Math.random();let u,p;L<.62?(u=l.left+Math.random()*l.width,p=l.bottom-Math.random()*l.height*.08):(u=L<.81?l.left+Math.random()*10:l.right-Math.random()*10,p=l.top+l.height*(.45+Math.random()*.55));const I=l.width*(.1+Math.random()*.16)*(.7+P*.3);m.push({x:u,y:p,vx:(Math.random()-.5)*18,vy:-(40+Math.random()*70)*(.8+P*.4),life:0,max:.7+Math.random()*.9,size:I,front:L<.62&&Math.random()<.3})}}function B(h){for(let y=0;y<h&&$.length<O;y++)$.push({x:l.left+Math.random()*l.width,y:l.bottom-Math.random()*l.height*.5,vy:-(30+Math.random()*90),life:0,max:1.6+Math.random()*2.4,r:.8+Math.random()*1.8,phase:Math.random()*6.28})}function U(h,y,L,u,p){const I=l.bottom+l.height*.06;for(let q=0;q<L;q++){const ct=(q+.5)/L,W=l.left-l.width*.32+ct*l.width*1.64,me=Math.abs(ct-.5)*2,at=l.height*u*(.3+.45*me+.18*kt(q*.9,y))*(.75+P*.25),Y=l.width/L*1.9,ge=kt(q*1.3+7,y*1.4)*Y*.9,$t=W+ge,ft=I-at,Q=h.createLinearGradient(0,I,0,ft);Q.addColorStop(0,"rgba(150,25,10,0)"),Q.addColorStop(.1,`rgba(170,35,12,${p})`),Q.addColorStop(.32,`rgba(240,110,30,${p*.9})`),Q.addColorStop(.65,`rgba(255,200,90,${p*.6})`),Q.addColorStop(1,"rgba(255,245,200,0)"),h.fillStyle=Q,h.beginPath(),h.moveTo(W-Y/2,I),h.bezierCurveTo(W-Y*.6,I-at*.45,$t-Y*.15,ft+at*.25,$t,ft),h.bezierCurveTo($t+Y*.15,ft+at*.25,W+Y*.6,I-at*.45,W+Y/2,I),h.closePath(),h.fill()}}function V(h){if(!g)return;const y=Math.min(.05,(h-E)/1e3||.016);E=h;const L=h/1e3;l=o.getBoundingClientRect(),i||v(Math.round(160*y*r*(.6+P))),B(Math.random()<(i?45:30)*y*r*P?1:0);for(const u of[a,n])u.globalCompositeOperation="source-over",u.clearRect(0,0,d,f),u.globalCompositeOperation="lighter";if(!i){const u=a.createRadialGradient(l.left+l.width/2,l.bottom,0,l.left+l.width/2,l.bottom,l.width*1.1);u.addColorStop(0,`rgba(255,120,40,${.2*P})`),u.addColorStop(1,"rgba(255,120,40,0)"),a.fillStyle=u,a.fillRect(0,0,d,f),U(a,L,9,1.25,.62),U(a,L*1.3+5,12,.75,.55),U(n,L*1.7+11,12,.3,.4),m=m.filter(p=>(p.life+=y)<p.max);for(const p of m){const I=p.life/p.max;p.x+=(p.vx+kt(p.y*.02,L)*22)*y,p.y+=p.vy*y;const q=p.size*(1-I*.6),ct=c[Math.min(4,Math.floor(I*5))],W=p.front?n:a;W.globalAlpha=(1-I)*(p.front?.28:.6),W.drawImage(ct,p.x-q/2,p.y-q/2,q,q)}n.globalAlpha=a.globalAlpha=1}$=$.filter(u=>(u.life+=y)<u.max);for(const u of $){u.y+=u.vy*y,u.x+=Math.sin(L*2+u.phase)*24*y+8*y;const p=.55+.45*Math.sin(L*18+u.phase*3);n.fillStyle=Ht(.1+u.life/u.max*.6,(1-u.life/u.max)*p),n.beginPath(),n.arc(u.x,u.y,u.r,0,Math.PI*2),n.fill()}R=requestAnimationFrame(V)}const k=()=>document.hidden?cancelAnimationFrame(R):g&&(R=requestAnimationFrame(V));return{start(){j(),g=!0,E=performance.now(),window.addEventListener("resize",j),document.addEventListener("visibilitychange",k),R=requestAnimationFrame(V)},stop(){g=!1,cancelAnimationFrame(R),window.removeEventListener("resize",j),document.removeEventListener("visibilitychange",k)},setIntensity(h){P=h},flare(){P=2.4,v(120),B(40)}}}const er="attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}",rr=`
precision highp float;
uniform sampler2D uCard;
uniform vec2 uRes;
uniform vec4 uRect;     // card rect in canvas pixels: x0, y0, x1, y1 (y up)
uniform float uTime;
uniform float uBurn;    // burn front position (field units)
uniform float uFlare;   // 0..1 extra intensity

float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(17.1,9.2);a*=.5;}return v;}
float fbm3(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*noise(p);p=p*2.07+vec2(5.3,1.7);a*=.5;}return v;}

// Where the paper burns first: the bottom edge and the lower corners, shaped by noise.
float field(vec2 c){
  float n=fbm3(c*vec2(3.2,4.0)+vec2(2.,7.));
  return c.y*.9+n*.38+.22*pow(abs(c.x-.5)*2.,2.)*(-.35)+.02;
}

vec3 fireRamp(float t){
  t=clamp(t,0.,1.);
  vec3 c=mix(vec3(.05,0.,0.),vec3(.75,.08,.02),smoothstep(0.,.25,t));
  c=mix(c,vec3(1.,.42,.05),smoothstep(.2,.5,t));
  c=mix(c,vec3(1.,.78,.25),smoothstep(.45,.75,t));
  c=mix(c,vec3(1.,.97,.82),smoothstep(.75,1.,t));
  return c;
}

float roundedBox(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}

void main(){
  vec2 px=gl_FragCoord.xy;
  vec2 size=uRect.zw-uRect.xy;
  vec2 c=(px-uRect.xy)/size;           // card space, (0,0) bottom-left
  float t=uTime;

  // Heat haze: warp the lookup near and above the burn front.
  float e0=field(c)-uBurn;
  float haze=(1.-smoothstep(0.,.35,e0))*(.006+.01*uFlare);
  vec2 cw=c+vec2(fbm(c*9.+vec2(0.,-t*2.))-.5,fbm(c*7.+vec2(t*.7,-t*2.4))-.5)*haze;

  float e=field(cw)-uBurn;
  float aspect=size.x/size.y;
  float box=roundedBox((cw-.5)*vec2(aspect,1.),vec2(.5*aspect,.5),.04);
  float inside=1.-smoothstep(-.002,.002,box);

  vec4 col=vec4(0.);
  if(inside>0.&&e>0.){
    vec4 tex=texture2D(uCard,vec2(cw.x,1.-cw.y));
    vec3 p=tex.rgb;
    // Scorch: paper browns, then blackens toward the front.
    float scorch=1.-smoothstep(0.,.3,e);
    p=mix(p,p*vec3(.86,.62,.36),scorch*.85);
    p=mix(p,vec3(.06,.03,.015),1.-smoothstep(.005,.075,e));
    // Ember rim with flickering hot spots.
    float rim=1.-smoothstep(0.,.016,e);
    float flick=.65+.6*fbm(cw*28.+vec2(t*1.5,-t));
    p+=vec3(1.,.36,.05)*rim*flick*1.15;
    p+=vec3(1.,.75,.35)*pow(rim,4.)*flick*.55;
    col=vec4(p,inside*tex.a);
  }

  // Flames: sample the field below this pixel, displaced by rising turbulence, so tongues
  // grow upward out of the burning edge.
  float turb=fbm(vec2(c.x*5.,c.y*1.5-t*1.9));
  float turb2=fbm(vec2(c.x*9.+3.,c.y*5.5-t*3.1));
  float lift=.07+.5*turb*turb*(1.+uFlare*1.4);
  vec2 fc=vec2(c.x+(turb2-.5)*.07,c.y-lift);
  float fe=field(fc)-uBurn;
  float band=smoothstep(.1,-.01,fe)*smoothstep(-.32,-.04,fe);
  float xs=smoothstep(-.06,.06,c.x)*smoothstep(1.06,.94,c.x);
  float heightFade=1.-smoothstep(.0,.55+.3*uFlare,c.y-(uBurn*.9-.05));
  // Flames only rise from paper that still exists (at or above the front), never from ash below.
  float source=smoothstep(-.045,.012,e0);
  float fireI=band*xs*source*clamp(heightFade,0.,1.)*(.45+.8*turb2);
  fireI*=1.+uFlare*.8;
  vec3 fire=fireRamp(fireI*.92);
  float fa=smoothstep(.05,.42,fireI)*.95;

  // Smoke: faint warm-grey wisps above the flames.
  float sm=fbm(vec2(c.x*3.+sin(c.y*3.+t)*.2,c.y*2.-t*.6));
  float smokeA=smoothstep(.45,.8,sm)*smoothstep(-.05,.3,c.y-uBurn*.9)*(1.-smoothstep(.4,1.2,c.y-uBurn*.9))*xs*.18*smoothstep(0.,.08,uBurn+.05);

  vec3 outc=col.rgb*col.a;
  float outa=col.a;
  outc=outc*(1.-smokeA)+vec3(.32,.28,.26)*smokeA;
  outa=max(outa,smokeA);
  // Additive fire over everything.
  outc+=fire*fa;
  outa=max(outa,fa);
  gl_FragColor=vec4(outc,clamp(outa,0.,1.));
}`;function Dt(t,e,o){const r=t.createShader(e);return t.shaderSource(r,o),t.compileShader(r),t.getShaderParameter(r,t.COMPILE_STATUS)?r:(console.warn(t.getShaderInfoLog(r)),null)}function or({canvas:t,image:e,target:o}){const r=t.getContext("webgl",{premultipliedAlpha:!0,alpha:!0,antialias:!1});if(!r)return null;const i=Dt(r,r.VERTEX_SHADER,er),a=Dt(r,r.FRAGMENT_SHADER,rr);if(!i||!a)return null;const n=r.createProgram();if(r.attachShader(n,i),r.attachShader(n,a),r.linkProgram(n),!r.getProgramParameter(n,r.LINK_STATUS))return null;r.useProgram(n);const s=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,s),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),r.STATIC_DRAW);const c=r.getAttribLocation(n,"a");r.enableVertexAttribArray(c),r.vertexAttribPointer(c,2,r.FLOAT,!1,0,0);const d=r.createTexture();r.bindTexture(r.TEXTURE_2D,d),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,e),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE);const f=Object.fromEntries(["uCard","uRes","uRect","uTime","uBurn","uFlare"].map(v=>[v,r.getUniformLocation(n,v)]));r.uniform1i(f.uCard,0),r.enable(r.BLEND),r.blendFunc(r.ONE,r.ONE_MINUS_SRC_ALPHA);const l=Math.min(1.75,window.devicePixelRatio||1);let m=0,$=!1,g=-.16,R=0,E=null;const P=performance.now();function z(){t.width=Math.round(innerWidth*l),t.height=Math.round(innerHeight*l),t.style.width=`${innerWidth}px`,t.style.height=`${innerHeight}px`,r.viewport(0,0,t.width,t.height)}function O(v){if(!$)return;if(E){const V=Math.min(1,(v-E.start)/E.ms),k=1-Math.pow(1-V,2.2);g=E.from+(E.to-E.from)*k,V>=1&&(E=null)}else g+=4e-5*(v-(O.last||v));O.last=v;const B=o.getBoundingClientRect(),U=innerHeight;r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),r.uniform2f(f.uRes,t.width,t.height),r.uniform4f(f.uRect,B.left*l,(U-B.bottom)*l,B.right*l,(U-B.top)*l),r.uniform1f(f.uTime,(v-P)/1e3),r.uniform1f(f.uBurn,g),r.uniform1f(f.uFlare,R),r.drawArrays(r.TRIANGLE_STRIP,0,4),m=requestAnimationFrame(O)}const j=()=>document.hidden?cancelAnimationFrame(m):$&&(m=requestAnimationFrame(O));return{start(){z(),$=!0,addEventListener("resize",z),document.addEventListener("visibilitychange",j),m=requestAnimationFrame(O)},stop(){$=!1,cancelAnimationFrame(m),removeEventListener("resize",z),document.removeEventListener("visibilitychange",j),r.getExtension("WEBGL_lose_context")?.loseContext()},burnTo(v,B){E={from:g,to:v,ms:B,start:performance.now()}},flare(){R=1},get level(){return g}}}function ir(t){return new Promise((e,o)=>{const r=URL.createObjectURL(new Blob([t],{type:"image/svg+xml"})),i=new Image;i.onload=()=>{URL.revokeObjectURL(r),e(i)},i.onerror=o,i.src=r})}const M="#141414",et="#c4122f",Mt="#1d4f9e",G="#f2c12e",vt="#fbeedd",w=`stroke="${M}" stroke-linejoin="round" stroke-linecap="round"`,ie=(t,e,o,r=M)=>`<path d="${It[0]}" transform="translate(${t} ${e}) scale(${o/100})" fill="${r}"/>`;function Ct(t,e,o,r){return t.map(i=>`<circle cx="${i}" cy="${e}" r="${o}" fill="${r}" ${w} stroke-width=".8"/>`).join("")}function jt(){const t=[[60,156],[68,147],[78,140],[178,140],[188,147],[196,156]].map(([r,i])=>`<path d="M${r} ${i}c-1.4 2.6-1.4 4.6 0 6.4c1.4-1.8 1.4-3.8 0-6.4Z" fill="${M}"/>`).join("");let e="";for(let r=0;r<6;r++)e+=`<rect x="${121+r%2*5}" y="${144+r*5}" width="5" height="5" fill="${r%2?M:G}"/>`;let o="M98 133";for(let r=0;r<12;r++)o+=` L${101+r*5} ${r%2?133:138}`;return`
  <!-- sword blade raised behind the King -->
  <path d="M62 40 L68 45 L77 128 L70 129 Z" fill="#e9ecef" ${w}/>
  <path d="M65.5 45 L73.5 127" stroke="${M}" stroke-width=".7"/>
  <!-- robe -->
  <path d="M36 175 L36 148 C50 134 80 128 104 126 L152 126 C176 128 206 134 214 148 L214 175 Z" fill="${et}" ${w}/>
  ${Ct([58,70,186,198],166,2.6,G)}
  ${Ct([64,192],158,2,G)}
  <path d="M36 148 C50 134 80 128 104 126 L106 133 C84 136 58 142 44 158 L36 160 Z" fill="#fff" ${w}/>
  <path d="M214 148 C200 134 176 128 152 126 L150 133 C172 136 198 142 206 158 L214 160 Z" fill="#fff" ${w}/>
  ${t}
  <path d="M104 128 L152 128 L160 175 L96 175 Z" fill="${Mt}" ${w}/>
  <path d="M108 140 L100 175 M148 140 L156 175" stroke="${G}" stroke-width="2.2"/>
  ${e}
  <rect x="121" y="144" width="10" height="30" fill="none" ${w} stroke-width=".9"/>
  <!-- hilt and gripping hand -->
  <rect x="55" y="125" width="38" height="7" rx="3" fill="${G}" ${w} transform="rotate(-6 74 128)"/>
  <circle cx="56" cy="130.5" r="3.3" fill="${et}" ${w} stroke-width=".9"/>
  <circle cx="92.5" cy="126.4" r="3.3" fill="${et}" ${w} stroke-width=".9"/>
  <path d="M66 140 C62 134 66 130 74 131 C82 132 86 137 84 143 C82 149 72 149 66 140 Z" fill="${vt}" ${w}/>
  <path d="M71 134 C73 137 75 139 79 139 M69 137 C71 141 73 143 77 143" stroke="${M}" stroke-width=".8" fill="none"/>
  <!-- collar -->
  <path d="M94 133 C108 145 148 145 162 133 C156 123 100 123 94 133 Z" fill="${G}" ${w}/>
  <path d="${o}" fill="none" stroke="${M}" stroke-width=".9"/>
  <!-- neck -->
  <path d="M120 112 L136 112 L138 126 L118 126 Z" fill="${vt}" ${w}/>
  <!-- hair curls -->
  ${[[111,84],[109,95],[110,106],[149,84],[151,95],[150,106]].map(([r,i])=>`<circle cx="${r}" cy="${i}" r="5.2" fill="${G}" ${w} stroke-width="1"/><path d="M${r-2.6} ${i}a2.6 2.6 0 1 1 2.6 2.6" fill="none" stroke="${M}" stroke-width=".7"/>`).join("")}
  <!-- face, three-quarter to the left -->
  <path d="M114 84 C114 74 121 69 130 69 C140 69 147 76 147 88 C147 101 141 111 131 113 C121 113 114 103 114 92 Z" fill="${vt}" ${w}/>
  <path d="M117 86 q5 -3 9 0 M133 86 q5 -3 9 0" fill="none" stroke="${M}" stroke-width="1.2"/>
  <path d="M118 91 q4 -2.6 8 0 q-4 2 -8 0Z M134 91 q4 -2.6 8 0 q-4 2 -8 0Z" fill="#fff" stroke="${M}" stroke-width=".9"/>
  <circle cx="120.6" cy="91" r="1.4" fill="${M}"/><circle cx="136.6" cy="91" r="1.4" fill="${M}"/>
  <path d="M129 91 C128 96 125 100 126 102 C127 103.5 130 103 131 102" fill="none" stroke="${M}" stroke-width="1"/>
  <!-- moustache and beard -->
  <path d="M130 105 C126 103 119 104 114 109 C120 108 125 109 130 108 C135 109 140 108 146 109 C141 104 134 103 130 105 Z" fill="${G}" ${w} stroke-width="1"/>
  <path d="M115 100 C115 117 121 128 130 133 C139 128 145 117 145 100 C142 110 137 113 130 113 C123 113 118 110 115 100 Z" fill="${G}" ${w}/>
  <path d="M120 112 q1 6 4 11 M126 114 q0 7 2 13 M134 114 q0 7 -2 13 M140 112 q-1 6 -4 11" fill="none" stroke="${M}" stroke-width=".8"/>
  <path d="M126 110 q4 2 8 0" fill="none" stroke="${et}" stroke-width="1.6"/>
  <!-- crown -->
  <path d="M112 66 C114 52 146 52 148 66 Z" fill="${et}" ${w}/>
  <path d="M110 68 L107 50 L117 58 L123 44 L130 55 L137 44 L143 58 L153 50 L150 68 Z" fill="${G}" ${w}/>
  ${Ct([107,123,137,153],50,2.4,"#fff").replace(/cy="50"/g,'cy="50"')}
  <path d="M130 34 v9 M126 38 h8" stroke="${M}" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M130 34 v9 M126 38 h8" stroke="${G}" stroke-width="1.6" stroke-linecap="round"/>
  <rect x="109" y="66" width="42" height="9" rx="1.5" fill="${G}" ${w}/>
  <circle cx="130" cy="70.5" r="3" fill="${et}" ${w} stroke-width=".9"/>
  <rect x="116" y="68" width="5" height="5" fill="${Mt}" ${w} stroke-width=".8" transform="rotate(45 118.5 70.5)"/>
  <rect x="139" y="68" width="5" height="5" fill="${Mt}" ${w} stroke-width=".8" transform="rotate(45 141.5 70.5)"/>
  <!-- suit symbol in the frame corner -->
  ${ie(186,46,18)}`}function ar(t=3){const e=250*t,o=350*t,r=`<text x="25" y="50" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="38" fill="${M}">K</text>${ie(15.5,56,19)}`;return`<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${o}" viewBox="0 0 250 350">
  <defs>
    <clipPath id="half"><rect x="38" y="40" width="174" height="135"/></clipPath>
    <linearGradient id="paperG" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#fffefa"/><stop offset="1" stop-color="#f4efe2"/></linearGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .3 0 0 0 0 .25 0 0 0 0 .2 0 0 0 .12 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  </defs>
  <rect width="250" height="350" rx="14" fill="url(#paperG)"/>
  <rect width="250" height="350" rx="14" fill="#fff" filter="url(#grain)"/>
  <rect x="38" y="40" width="174" height="270" fill="#fff"/>
  <g clip-path="url(#half)" stroke-width="1.3">${jt()}</g>
  <g transform="rotate(180 125 175)"><g clip-path="url(#half)" stroke-width="1.3">${jt()}</g></g>
  <path d="M38 175 H212" stroke="${M}" stroke-width="1.4"/>
  <rect x="38" y="40" width="174" height="270" fill="none" stroke="${M}" stroke-width="1.6"/>
  <rect x="35" y="37" width="180" height="276" fill="none" stroke="${M}" stroke-width=".6"/>
  ${r}
  <g transform="rotate(180 125 175)">${r}</g>
  <rect x=".5" y=".5" width="249" height="349" rx="13.5" fill="none" stroke="#cfc6b0" stroke-width="1"/>
</svg>`}const nr=.05,wt=1e3,sr=10080*60*1e3,Vt=600;class lr{constructor(e){this.balances={mint:0,escrow:0,treasury:0,...e?.balances||{}},this.ledger=e?.ledger||[],this.seq=e?.seq||0}toJSON(){return{balances:this.balances,ledger:this.ledger,seq:this.seq}}bal(e){return this.balances[e]||0}move(e,o,r,i,a=null,n=""){if(!Number.isInteger(r)||r<0)throw new Error(`bad amount ${r}`);if(r===0)return null;if(e===o)throw new Error("self move");if(e!=="mint"&&this.bal(e)<r)throw new Error(`insufficient funds in ${e}`);this.balances[e]=this.bal(e)-r,this.balances[o]=this.bal(o)+r;const s={id:++this.seq,at:Date.now(),round:a,kind:i,from:e,to:o,amount:r,memo:n};return this.ledger.push(s),this.ledger.length>Vt&&this.ledger.splice(0,this.ledger.length-Vt),s}open(e,o=wt){return e in this.balances?!1:(this.balances[e]=0,this.move("mint",e,o,"mint",null,"welcome tokens"),!0)}setTo(e,o,r="admin set"){const i=o-this.bal(e);i>0&&this.move("mint",e,i,"admin",null,r),i<0&&this.move(e,"mint",-i,"admin",null,r)}reconcile(){const e=-this.bal("mint"),o=Object.entries(this.balances).filter(([r])=>r!=="mint").reduce((r,[,i])=>r+i,0);return{minted:e,held:o,ok:e===o}}}function Lr(t,e,o,r,i,a){for(const[s,c]of[[o,i],[r,a]]){if(!Number.isInteger(c)||c<1)throw new Error("bet must be a whole number ≥ 1");if(c>t.bal(s))throw new Error("bet exceeds balance")}t.move(o,"escrow",i,"bet",e.id),t.move(r,"escrow",a,"bet",e.id);const n=Math.min(i,a);return i>n&&t.move("escrow",o,i-n,"excess-refund",e.id),a>n&&t.move("escrow",r,a-n,"excess-refund",e.id),e.stake=n,e.bets={[o]:i,[r]:a},e.escrow={[o]:n,[r]:n},n}function Sr(t,e,o,r){t.move(o,"escrow",r,"raise",e.id),e.escrow[o]+=r}function Tr(t,e,o,r=0,i=nr){if(e.settled)return e.result;const[a,n]=Object.keys(e.escrow);let s;if(!o)t.move("escrow",a,e.escrow[a],"refund",e.id),t.move("escrow",n,e.escrow[n],"refund",e.id),s={winner:null,profit:0,rake:0,net:{[a]:0,[n]:0}};else{const c=o===a?n:a,d=Math.min(Math.max(0,Math.floor(r)),e.escrow[c]),f=Math.floor(d*i);t.move("escrow",o,e.escrow[o],"stake-return",e.id),d-f>0&&t.move("escrow",o,d-f,"win",e.id),f>0&&t.move("escrow","treasury",f,"rake",e.id),e.escrow[c]-d>0&&t.move("escrow",c,e.escrow[c]-d,"stake-return",e.id),s={winner:o,loser:c,profit:d,rake:f,net:{[o]:d-f,[c]:-d}}}return e.escrow[a]=0,e.escrow[n]=0,e.settled=!0,e.result=s,s}const ut=new Uint32Array(1),ht=2**32;function pt(t){if(!Number.isInteger(t)||t<=0||t>ht)throw new RangeError("randInt: bad n");const e=ht-ht%t;let o;do crypto.getRandomValues(ut),o=ut[0];while(o>=e);return o%t}function mt(){return crypto.getRandomValues(ut),ut[0]/ht}function cr(t){for(let e=t.length-1;e>0;e--){const o=pt(e+1);[t[e],t[o]]=[t[o],t[e]]}return t}function Pr(t=16){const e=new Uint8Array(t);return crypto.getRandomValues(e),[...e].map(o=>o.toString(16).padStart(2,"0")).join("")}const Rr=t=>t[pt(t.length)],H=t=>mt()<t,Ir=5;function Tt(t,e){return t==null?0:t===e?1:-1}function Wt(t,e,o){return Math.min(12,Math.max(0,Z(t)+Tt(e,o)))}function ae(t,e,o,r){return t!==o?t===0&&o===12?1:o===0&&t===12?-1:t>o?1:-1:e===r?0:st(e)>st(r)?1:-1}function Fr(t,e,o,r,i){const a=Wt(t,e,i),n=Wt(o,r,i);return{cmp:ae(a,C(t),n,C(o)),powerA:a,powerB:n,shiftA:Tt(e,i),shiftB:Tt(r,i)}}function fr(t){let e=0;for(let o=0;o<52;o++)o!==t&&ae(Z(t),C(t),Z(o),C(o))>0&&e++;return e/51}const dr=5;function hr(t){const e=Z(t);return e===12?1:e>=8?10:e+2}function ur(t,e){let o=0,r=0;for(const i of t)o+=hr(i)+(C(i)===e?1:0),Z(i)===12&&r++;return r>0&&o+10<=21?{total:o+10,soft:!0}:{total:o,soft:!1}}function pr(t,e){const{total:o,soft:r}=ur(t,e),i=o>21;return{total:o,soft:r,bust:i,count:t.length,natural:t.length===2&&o===21,charlie:t.length===dr&&!i}}function Gr(t,e){return t.bust&&e.bust?0:t.bust?-1:e.bust?1:t.natural!==e.natural?t.natural?1:-1:t.charlie!==e.charlie?t.charlie?1:-1:t.total!==e.total?t.total>e.total?1:-1:t.count!==e.count?t.count<e.count?1:-1:0}const Nr=["LOW","MID","COURT","ACE"],Zr=["3–6","7–10","J Q K","A or 2"],ne=[.1,.25,.5,.75],Br=5;function se(t){const e=Z(t);return e===0||e===12?3:e>=9?2:e>=5?1:0}const mr=(t,e)=>se(t)>=e;function qr(t,e,o,r){if(o==="believe")return{throneWins:!0,profit:Math.floor(r*ne[e]),revealed:!1,truthful:null};const i=mr(t,e);return{throneWins:i,profit:r,revealed:!0,truthful:i}}const Or=.25,Ur=3,gr=["High card","Pair","Straight","Flush","Straight flush","Triple"],rt={HIGH:0,PAIR:1,STRAIGHT:2,FLUSH:3,SF:4,TRIPLE:5},Et=t=>Z(t)===0?12:Z(t)-1;function Xt(t){const e=[...t].sort((s,c)=>Et(c)-Et(s)||st(C(c))-st(C(s))),o=e.map(Et),r=C(e[0])===C(e[1])&&C(e[1])===C(e[2]),i=o[0]-1===o[1]&&o[1]-1===o[2];let a,n=o;if(o[0]===o[1]&&o[1]===o[2])a=rt.TRIPLE;else if(i&&r)a=rt.SF;else if(r)a=rt.FLUSH;else if(i)a=rt.STRAIGHT;else if(o[0]===o[1]||o[1]===o[2]){a=rt.PAIR;const s=o[1],c=o[0]===o[1]?o[2]:o[0];n=[s,c]}else a=rt.HIGH;return{cat:a,name:gr[a],keys:n,topSuit:st(C(e[0])),sorted:e}}function wr(t,e){if(t.cat!==e.cat)return t.cat>e.cat?1:-1;for(let o=0;o<t.keys.length;o++)if(t.keys[o]!==e.keys[o])return t.keys[o]>e.keys[o]?1:-1;return t.topSuit!==e.topSuit?t.topSuit>e.topSuit?1:-1:0}function Hr(t,e){return t==="fold"&&e==="fold"?{kind:"tie"}:t==="fold"?{kind:"fold",folder:"a"}:e==="fold"?{kind:"fold",folder:"b"}:t==="raise"&&e==="raise"?{kind:"showdown",mult:2}:t==="raise"?{kind:"answer",who:"b"}:e==="raise"?{kind:"answer",who:"a"}:{kind:"showdown",mult:1}}const le={marquis:{id:"marquis",name:"Marquis Noir",title:"The Calculator",blurb:"Counts every card, bets like a banker, almost never bluffs.",difficulty:2,risk:.32,bluff:.08,omenCall:.06,standAt:17,skeptic:0,palette:{robe:"#0f1c33",trim:"#c9a24a",accent:"#e2c36b"}},countess:{id:"countess",name:"Countess Rouge",title:"The High Roller",blurb:"Big bets, bigger nerve. Hits on seventeen and laughs about it.",difficulty:3,risk:.7,bluff:.28,omenCall:.22,standAt:18,skeptic:.08,palette:{robe:"#5a0f1a",trim:"#e2c36b",accent:"#d23a49"}},jester:{id:"jester",name:"The Jester",title:"The Trickster",blurb:"Bluffs for sport, calls the Omen on a whim. Unreadable, sometimes foolish.",difficulty:1,risk:.5,bluff:.5,omenCall:.55,standAt:16,skeptic:.18,palette:{robe:"#0b4a37",trim:"#f1dc9a",accent:"#14805c"}}},Pt=t=>`rival:${t}`,yr=(t,e)=>Math.max(1,Math.round(t/e)*e);function Dr(t,e){if(e<=0)return 0;const o=.08+mt()*.32;let r=e*t.risk*o;return H(t.risk*.08)&&(r=e*(.5+mt()*.5)),Math.min(e,yr(r,r>100?10:5))}function jr(t,e){const o=e.map((a,n)=>({i:n,s:fr(a)})).sort((a,n)=>n.s-a.s),r=t.id==="jester"&&H(.3)?o[pt(Math.min(3,o.length))]:o[0],i=H(t.omenCall)?pt(4):null;return{index:r.i,call:i}}function Vr(t,e,o){const r=pr(e,o);return r.bust||e.length>=5?!1:r.total<t.standAt?!0:e.length===4&&r.total<=15?H(.5+t.risk*.3):!1}function Wr(t,e){const r=e.map((a,n)=>({i:n,band:se(a),r:Z(a)})).sort((a,n)=>n.band-a.band||n.r-a.r)[0];let i=r.band;return r.band<3&&H(t.bluff)?i=r.band+1:r.band>0&&H(t.bluff*.25)&&(i=r.band-1),{index:r.i,claim:i}}function Xr(t,e,o={calls:0,lies:0}){const r=[.97,.8,.52,.3][e],i=o.calls>=2?o.lies/o.calls:null;let a=i==null?r:r*(1-Math.min(.6,i));a=Math.min(.99,Math.max(.01,a-t.skeptic+(mt()-.5)*.12));const n=ne[e],s=1-a-a,c=-n;return s>c?"call":"believe"}function ce(t,e=260){const o=Xt(t),r=Ke().filter(a=>!t.includes(a));let i=0;for(let a=0;a<e;a++){const n=cr(r.slice()),s=wr(o,Xt(n.slice(0,3)));i+=s>0?1:s===0?.5:0}return i/e}function Kr(t,e,o){const r=ce(e);return o&&(r>.78-t.risk*.12||H(t.bluff*.18))?{action:"raise",p:r}:r<.2+t.skeptic*.3&&!H(t.bluff*.5)?{action:"fold",p:r}:{action:"hold",p:r}}function zr(t,e,o){const r=ce(e);return o&&(r>.5-t.risk*.15||H(t.bluff*.15))?"call":"fold"}const fe="peece.save.v1",Kt=40,zt=100;function $r(){try{return JSON.parse(localStorage.getItem(fe)||"null")}catch{return null}}const de=$r()||{},ot=new lr(de.bank),T={name:"",lockedUntil:0,history:[],tells:{calls:0,lies:0},audit:[],stats:{played:0,won:0,best:0},...de.profile||{}};ot.open("you",wt);for(const t of Object.keys(le))ot.open(Pt(t),wt);const Rt=new Set,Yr=t=>(Rt.add(t),()=>Rt.delete(t));function yt(){Rt.forEach(t=>t());try{localStorage.setItem(fe,JSON.stringify({bank:ot.toJSON(),profile:T}))}catch{}}function br(t,e){try{const o=localStorage.getItem(`peece.${t}`);return o==null?e:JSON.parse(o)}catch{return e}}function he(t,e){try{localStorage.setItem(`peece.${t}`,JSON.stringify(e))}catch{}}const xr=()=>T.lockedUntil>Date.now();function Jr(t=sr/864e5){return t<=0?!1:ot.bal("you")<=0&&!xr()?(T.lockedUntil=Date.now()+t*864e5,!0):!1}function Qr(){const t=[];for(const e of Object.keys(le))ot.bal(Pt(e))<=0&&(ot.move("mint",Pt(e),wt,"mint",null,"Treasury restored rival"),t.push(e));return t}function to(t){T.history.unshift(t),T.history.length>Kt&&(T.history.length=Kt),T.stats.played++,t.net>0&&(T.stats.won++,T.stats.best=Math.max(T.stats.best,t.net)),yt()}function eo(t,e){T.audit.unshift({at:Date.now(),action:t,detail:e}),T.audit.length>zt&&(T.audit.length=zt),yt()}function ro(t){T.name=ue(t),yt()}function ue(t){return String(t||"").replace(/[\u0000-\u001f\u007f]/g,"").replace(/\s+/g," ").trim().slice(0,14)}const oo=t=>ue(t).length>=2;yt();const pe={betSeconds:60,actSeconds:45,rematchSeconds:6,autoRematch:!0,rakePercent:5,lockoutDays:7,loaderEverySession:!0},At=br("settings",{}),lt={...pe,...At&&typeof At=="object"?At:{}};function io(t){Object.assign(lt,t),he("settings",lt)}function ao(){Object.assign(lt,pe),he("settings",lt)}const gt="peece.loaderSeen",kr=2200;function Mr(){try{return!lt.loaderEverySession&&localStorage.getItem(gt)?!1:!sessionStorage.getItem(gt)}catch{return!0}}async function vr(t=[]){try{sessionStorage.setItem(gt,"1"),localStorage.setItem(gt,"1")}catch{}const e=Me(),o=(navigator.hardwareConcurrency||4)<=4||matchMedia("(max-width: 520px)").matches,r=Lt(`<svg class="loader__ring" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(226,195,107,.15)" stroke-width="1.5"/>
      <circle class="loader__ring-fill" cx="60" cy="60" r="54" fill="none" stroke="url(#ringGrad)" stroke-width="2.5"
        stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" transform="rotate(-90 60 60)"/>
      <defs><linearGradient id="ringGrad"><stop offset="0" stop-color="#8a6a24"/><stop offset=".5" stop-color="#f6e3a3"/><stop offset="1" stop-color="#c9a24a"/></linearGradient></defs>
    </svg>`),i=Lt(`<svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <filter id="heat"><feTurbulence id="heatNoise" type="fractalNoise" baseFrequency=".012 .06" numOctaves="2" seed="3"/>
      <feDisplacementMap in="SourceGraphic" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter></svg>`),a=Je({id:11});a.classList.add("loader__card");const n=A("div",{class:"loader__char"});a.append(n);const s=[..."PEECE"].map(k=>A("span",{class:"loader__letter"},k)),c=A("canvas",{class:"loader__canvas loader__canvas--back","aria-hidden":"true"}),d=A("canvas",{class:"loader__canvas loader__canvas--front","aria-hidden":"true"}),f=A("canvas",{class:"loader__canvas loader__canvas--gl","aria-hidden":"true"}),l=A("button",{class:"btn btn--ghost btn--sm loader__skip",type:"button"},"Skip"),m=A("span",{class:"loader__pct tabular"},"0%"),$=A("div",{class:`loader${e?" is-calm":""}`,role:"dialog","aria-label":"Loading PEECE"},i,c,A("div",{class:"loader__brand"},A("div",{class:"loader__mark",html:Ce("loader__crown","loaderCrown")},r),A("h1",{class:"loader__word","aria-label":"PEECE"},s),A("span",{class:"loader__underline"}),A("p",{class:"loader__tag"},"The midnight card lounge"),m),A("div",{class:"loader__stage"},A("div",{class:"loader__glow","aria-hidden":"true"}),a),f,d,A("div",{class:"loader__flash"}),l);document.body.append($);let g=null;if(!e)try{const k=await Promise.race([ir(ar(o?2:3)),nt(1500).then(()=>Promise.reject(new Error("slow")))]);g=or({canvas:f,image:k,target:a})}catch{g=null}g&&($.classList.add("is-gl"),g.start(),g.burnTo(.27,2600));const R=e?null:tr({back:c,front:d,target:a,budget:o?.55:1,embersOnly:!!g});R?.start();let E=0;const P=$.querySelector("#heatNoise");if(!e&&P){const k=h=>{const y=.06+Math.sin(h/380)*.012;P.setAttribute("baseFrequency",`${(.012+Math.sin(h/900)*.003).toFixed(4)} ${y.toFixed(4)}`),E=requestAnimationFrame(k)};E=requestAnimationFrame(k)}const z=$.querySelector(".loader__ring-fill");let O=0;const j=Math.max(1,t.length),v=k=>{z.setAttribute("stroke-dashoffset",String(100-k*100)),m.textContent=`${Math.round(k*100)}%`,s.forEach((h,y)=>h.classList.toggle("is-lit",k>=(y+.5)/s.length||k===1))},B=Promise.all(t.map(k=>Promise.resolve(k).catch(()=>{}).then(()=>v(++O/j))));requestAnimationFrame(()=>$.classList.add("is-in"));let U=!1;const V=new Promise(k=>{setTimeout(()=>l.classList.add("is-ready"),1e3),l.addEventListener("click",()=>{U=!0,k()})});v(.04),await Promise.race([Promise.all([B,nt(e?900:kr)]),V]),v(1),!U&&!e&&($.classList.add("is-flaring"),R?.flare(),g?(g.flare(),g.burnTo(1.45,1100),await nt(1e3)):await nt(700)),$.classList.add("is-out"),await nt(e?300:650),R?.stop(),g?.stop(),cancelAnimationFrame(E),$.remove()}const D={lobby:()=>tt(()=>import("./lobby-B3oqGerA.js"),__vite__mapDeps([0,1,2,3])),table:()=>tt(()=>import("./table-D_3tX9gb.js"),__vite__mapDeps([4,1,2,3,5])),howto:()=>tt(()=>import("./howto-Bab797vE.js"),__vite__mapDeps([6,1])),treasury:()=>tt(()=>import("./treasury-CswW-8u2.js"),__vite__mapDeps([7,1,5])),dev:()=>tt(()=>import("./devcards-HnypwkyV.js"),__vite__mapDeps([8,3])),admin:()=>tt(()=>import("./admin-CAcRLwE-.js"),__vite__mapDeps([9,1,2,5]))};J("/",D.lobby);J("/play/:game/:rival",D.table);J("/how-to-play",D.howto);J("/how-to-play/:game",D.howto);J("/treasury",D.treasury);J("/dev/cards",D.dev);J("/admin",D.admin);Ft();if(Mr()){const t=e=>new Promise(o=>(window.requestIdleCallback||setTimeout)(()=>o(e())));vr([document.fonts?.ready??Promise.resolve(),D.lobby(),D.table(),t(()=>oe()),t(()=>[12,11,10,9].forEach(St)),t(()=>Array.from({length:52},(e,o)=>St(o)))])}xe();export{ne as $,lt as A,Lr as B,eo as C,ao as D,pe as E,io as F,cr as G,Ke as H,Pr as I,Ce as J,jr as K,Ve as L,Ar as M,je as N,Fr as O,_r as P,Ir as Q,le as R,It as S,ee as T,pr as U,dr as V,C as W,Vr as X,Gr as Y,Nr as Z,tt as _,T as a,Zr as a0,se as a1,Or as a2,Xr as a3,Wr as a4,Br as a5,qr as a6,Xt as a7,Kr as a8,Hr as a9,zr as aa,wr as ab,Ur as ac,ot as b,he as c,Je as d,Rr as e,Er as f,H as g,A as h,xr as i,Me as j,pt as k,Tr as l,yt as m,$e as n,Yr as o,br as p,Qr as q,Pt as r,ro as s,Jr as t,to as u,oo as v,Cr as w,Sr as x,nt as y,Dr as z};
