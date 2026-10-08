const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/lobby-BVheSBHT.js","assets/art-C8UWTOFE.js","assets/toast-BLd0GpYv.js","assets/tilt-BnLScqfE.js","assets/table-BMq4ps-M.js","assets/seal-M4S4_0iF.js","assets/howto-CAuch1W-.js","assets/treasury-I10_jPJ2.js","assets/devcards-BLxMpYKE.js"])))=>i.map(i=>d[i]);
(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function a(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function t(o){if(o.ep)return;o.ep=!0;const i=a(o);fetch(o.href,i)}})();const qt="modulepreload",Nt=function(e){return"/peece/"+e},xt={},Q=function(r,a,t){let o=Promise.resolve();if(a&&a.length>0){let l=function(h){return Promise.all(h.map(s=>Promise.resolve(s).then(c=>({status:"fulfilled",value:c}),c=>({status:"rejected",reason:c}))))};document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),b=n?.nonce||n?.getAttribute("nonce");o=l(a.map(h=>{if(h=Nt(h),h in xt)return;xt[h]=!0;const s=h.endsWith(".css"),c=s?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${h}"]${c}`))return;const u=document.createElement("link");if(u.rel=s?"stylesheet":qt,s||(u.as="script"),u.crossOrigin="",u.href=h,b&&u.setAttribute("nonce",b),document.head.appendChild(u),s)return new Promise(($,m)=>{u.addEventListener("load",$),u.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${h}`)))})}))}function i(l){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=l,window.dispatchEvent(n),!n.defaultPrevented)throw l}return o.then(l=>{for(const n of l||[])n.status==="rejected"&&i(n.reason);return r().catch(i)})},Et=[];let lt=null;function K(e,r){const a=[],t=new RegExp("^"+e.replace(/:(\w+)/g,(o,i)=>(a.push(i),"([^/]+)")).replace(/\//g,"\\/")+"\\/?$");Et.push({re:t,keys:a,load:r})}function Ut(e){location.hash.slice(1)===e?ht():location.hash=e}function Ot(){return location.hash.slice(1)||"/"}async function ht(){const e=Ot(),r=document.getElementById("app");for(const a of Et){const t=e.match(a.re);if(!t)continue;const o=Object.fromEntries(a.keys.map((l,n)=>[l,decodeURIComponent(t[n+1])])),i=await a.load();lt?.unmount&&lt.unmount(),r.replaceChildren(),lt=i,window.scrollTo(0,0),await i.mount(r,o);return}Ut("/")}function Ht(){return window.addEventListener("hashchange",ht),ht()}function _(e,r={},...a){const t=document.createElement(e);for(const[o,i]of Object.entries(r||{}))if(!(i==null||i===!1))if(o==="class")t.className=i;else if(o==="style"&&typeof i=="object")for(const[l,n]of Object.entries(i))l.startsWith("--")?t.style.setProperty(l,n):t.style[l]=n;else o==="dataset"?Object.assign(t.dataset,i):o.startsWith("on")&&typeof i=="function"?t.addEventListener(o.slice(2),i):o==="html"?t.append(pt(i)):i===!0?t.setAttribute(o,""):t.setAttribute(o,i);return Dt(t,a),t}function Dt(e,r){for(const a of r.flat(1/0))a==null||a===!1||e.append(a instanceof Node?a:document.createTextNode(String(a)))}function pt(e){const r=document.createElement("template");return r.innerHTML=e.trim(),r.content}function Se(e){const r=document.getElementById("sr-live");r&&(r.textContent="",requestAnimationFrame(()=>r.textContent=e))}const jt=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,tt=e=>new Promise(r=>setTimeout(r,e));function Pe(e){return Math.round(e).toLocaleString("en-US")}const mt=["M50 4C61 22 95 38 95 61C95 75 85 83 73 83C64 83 57 79 53.5 72C54.5 81 59 89 67 95H33C41 89 45.5 81 46.5 72C43 79 36 83 27 83C15 83 5 75 5 61C5 38 39 22 50 4Z","M50 92C21 68 4 51 4 31C4 16 15 6 28.5 6C38.5 6 46 12 50 21C54 12 61.5 6 71.5 6C85 6 96 16 96 31C96 51 79 68 50 92Z","M50 3C59 21 73 37 91 50C73 63 59 79 50 97C41 79 27 63 9 50C27 37 41 21 50 3Z","M31 30a19 19 0 1 0 38 0a19 19 0 1 0-38 0ZM9 58a19 19 0 1 0 38 0a19 19 0 1 0-38 0ZM53 58a19 19 0 1 0 38 0a19 19 0 1 0-38 0ZM38 46L50 68L62 46ZM46 62C46 78 41 88 32 95H68C59 88 54 78 54 62Z"],Vt=`
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
  ${mt.map((e,r)=>`<symbol id="suit-${r}" viewBox="0 0 100 100"><path d="${e}"/></symbol>`).join("")}
</defs>`;let L=null;function gt(){return L&&document.body.contains(L)||(L=document.createElementNS("http://www.w3.org/2000/svg","svg"),L.setAttribute("id","peece-sprite"),L.setAttribute("aria-hidden","true"),L.setAttribute("width","0"),L.setAttribute("height","0"),L.style.position="absolute",L.style.width="0",L.style.height="0",L.style.overflow="hidden",L.innerHTML=Vt,document.body.prepend(L)),L}function At(e,r,a="0 0 250 350"){const t=gt();if(t.querySelector(`#${e}`))return e;const o=t.querySelector("defs"),i=document.createElementNS("http://www.w3.org/2000/svg","svg");return i.innerHTML=`<symbol id="${e}" viewBox="${a}">${r()}</symbol>`,o.append(i.firstChild),e}function D(e,r,a,t,o={}){const i=o.fill??(e===1||e===2?"url(#rubyG)":"url(#inkG)"),l=o.rotate?` transform="rotate(180 ${r+t/2} ${a+t/2})"`:"",n=o.stroke?` stroke="${o.stroke}" stroke-width="${o.strokeWidth??1.2}"`:"";return`<use href="#suit-${e}" x="${r}" y="${a}" width="${t}" height="${t}" fill="${i}"${n}${l}/>`}function Te(e,r="suit-ico"){return gt(),`<svg class="${r}" viewBox="0 0 100 100" aria-hidden="true"><use href="#suit-${e}" fill="${e===1||e===2?"var(--ruby-bright)":"currentColor"}"/></svg>`}function St(e="url(#goldA)",r="#8a6a24"){const a=(t,o,i,l)=>`<path d="${mt[t]}" transform="translate(${o} ${i}) scale(${l/100})" fill="${e}" stroke="${r}" stroke-width="${80/l}"/>`;return`<path d="M12 48L8 24L21 35L32 18L43 35L56 24L52 48Z" fill="${e}" stroke="${r}" stroke-width=".8" stroke-linejoin="round"/>
    <rect x="11" y="48" width="42" height="7" rx="2" fill="${e}" stroke="${r}" stroke-width=".8"/>
    <circle cx="22" cy="51.5" r="1.6" fill="${r}"/><circle cx="32" cy="51.5" r="1.9" fill="${r}"/><circle cx="42" cy="51.5" r="1.6" fill="${r}"/>
    ${a(0,1.5,11,13)}${a(1,25,4,14)}${a(2,49.5,11,13)}`}function Xt(e="crown-mark",r="crownGrad"){return`<svg class="${e}" viewBox="0 0 64 64" aria-hidden="true">
    <defs><linearGradient id="${r}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f6e3a3"/><stop offset=".4" stop-color="#d8b45a"/>
      <stop offset=".7" stop-color="#a8832f"/><stop offset="1" stop-color="#f1dc9a"/></linearGradient></defs>
    ${St(`url(#${r})`)}</svg>`}const w=.18,R=.5,x=.82,H=1/3,Wt={2:[[R,0],[R,1]],3:[[R,0],[R,.5],[R,1]],4:[[w,0],[x,0],[w,1],[x,1]],5:[[w,0],[x,0],[R,.5],[w,1],[x,1]],6:[[w,0],[x,0],[w,.5],[x,.5],[w,1],[x,1]],7:[[w,0],[x,0],[R,.25],[w,.5],[x,.5],[w,1],[x,1]],8:[[w,0],[x,0],[R,.25],[w,.5],[x,.5],[R,.75],[w,1],[x,1]],9:[[w,0],[x,0],[w,H],[x,H],[R,.5],[w,2*H],[x,2*H],[w,1],[x,1]],10:[[w,0],[x,0],[R,1/6],[w,H],[x,H],[w,2*H],[x,2*H],[R,5/6],[w,1],[x,1]]},at={x:64,y:70,w:122,h:210},bt=40;function zt(e,r){const a=Wt[e],t=e<=3?46:bt;return a.map(([o,i])=>{const l=i===.5&&(e===3||e===5||e===9)?t+4:e<=3?t:bt,n=at.x+o*at.w,b=at.y+i*at.h;return D(r,n-l/2,b-l/2,l,{rotate:i>.5})}).join("")}const Kt=[{robe:"#1b2d55",deep:"#0a1220",light:"#3a5794",hair:"#2f2216",trim:"#e2c36b"},{robe:"#9b1c2e",deep:"#5a0f1a",light:"#cc3b4d",hair:"#5e3218",trim:"#f1dc9a"},{robe:"#bf7a1a",deep:"#7a4a0e",light:"#e4a748",hair:"#43290f",trim:"#fbeab0"},{robe:"#11674b",deep:"#073526",light:"#22926b",hair:"#2a1f14",trim:"#e2c36b"}];function yt(e){let r="";for(let a=0;a<3;a++)for(let t=0;t<9;t++){const o=58+t*17+a%2*8,i=152+a*8;o>106&&o<144||(r+=`<path d="M${o} ${i}l2.4 2.4-2.4 2.4-2.4-2.4Z" fill="${e.trim}" opacity=".55"/>`)}return`<g data-layer="robe">
    <path d="M46 175V158C54 141 79 132 101 128H149C171 132 196 141 204 158V175Z" fill="${e.robe}"/>
    <path d="M46 175V158C54 141 79 132 101 128H113C97 136 82 152 79 175Z" fill="${e.deep}" opacity=".5"/>
    <path d="M204 175V158C196 141 171 132 149 128H140C156 136 170 152 173 175Z" fill="#fff" opacity=".07"/>
    ${r}
    <path d="M46 158C54 141 79 132 101 128M204 158C196 141 171 132 149 128" stroke="url(#goldB)" stroke-width="2.6" fill="none"/>
    <rect x="118" y="140" width="14" height="35" fill="url(#goldB)"/>
    <path d="M125 146l4 5-4 5-4-5Zm0 14l4 5-4 5-4-5Z" fill="${e.deep}"/>
  </g>`}function Yt(e=139){const r=[92,108,125,142,158].map((a,t)=>{const o=e-1+(t===0||t===4?-2:1);return`<path d="M${a} ${o}c-1.7 3.2-1.7 5.6 0 7.6c1.7-2 1.7-4.4 0-7.6Z" fill="#14110c"/><path d="M${a-2.6} ${o-1.6}h5.2" stroke="#14110c" stroke-width=".9"/>`}).join("");return`<g data-layer="ermine">
    <path d="M76 ${e}C88 ${e-13} 107 ${e-16} 125 ${e-16}C143 ${e-16} 162 ${e-13} 174 ${e}C162 ${e+10} 141 ${e+7} 125 ${e+7}C109 ${e+7} 88 ${e+10} 76 ${e}Z" fill="#fbf7ec" stroke="#cfc3a2" stroke-width=".8"/>
    ${r}
  </g>`}function $t(e,{cy:r=98,rx:a=15.5,ry:t=19,lips:o="#a5524a",lashes:i=!1}={}){const l=r;return`<g data-layer="face">
    <rect x="117.5" y="${r+12}" width="15" height="16" fill="url(#skin)"/>
    <ellipse cx="125" cy="${r}" rx="${a}" ry="${t}" fill="url(#skin)" stroke="#c99a70" stroke-width=".6"/>
    <circle cx="116" cy="${r+6}" r="3.6" fill="#e0767f" opacity=".22"/>
    <circle cx="134" cy="${r+6}" r="3.6" fill="#e0767f" opacity=".22"/>
    <path d="M114.5 ${l-5}q4-2.6 8 0M127.5 ${l-5}q4-2.6 8 0" stroke="${e.hair}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <ellipse cx="119" cy="${l}" rx="2" ry="1.4" fill="#1e1a14"/>
    <ellipse cx="131" cy="${l}" rx="2" ry="1.4" fill="#1e1a14"/>
    ${i?`<path d="M116.6 ${l-1.2}l-1.6-1.4M133.4 ${l-1.2}l1.6-1.4" stroke="#1e1a14" stroke-width=".8"/>`:""}
    <path d="M125 ${l+1}v7.5l-2.6 1.3" stroke="#b0805a" stroke-width="1" fill="none" stroke-linecap="round"/>
    <path d="M121 ${l+13}q4 2.6 8 0q-4-1.2-8 0Z" fill="${o}"/>
  </g>`}function Pt(e,r=125,a=158){return`<circle cx="${r}" cy="${a}" r="12.5" fill="#fbf7ec" stroke="url(#goldA)" stroke-width="2.2"/>
    <circle cx="${r}" cy="${a}" r="9.5" fill="none" stroke="#c9a24a" stroke-width=".5"/>
    ${D(e,r-7.5,a-7.5,15)}`}const Y=(e,r)=>`<ellipse cx="${e}" cy="${r}" rx="7" ry="5.6" fill="url(#skin)" stroke="#c99a70" stroke-width=".6"/>`,Jt=()=>`<g data-layer="prop">
  <path d="M167 54l3.5-9 3.5 9V146h-7Z" fill="url(#steel)" stroke="#5b636c" stroke-width=".5"/>
  <path d="M170.5 50V144" stroke="#fff" stroke-width=".6" opacity=".7"/>
  <rect x="156" y="144" width="29" height="5.5" rx="2.6" fill="url(#goldB)" stroke="#8a6a24" stroke-width=".5"/>
  <rect x="167.5" y="149" width="6" height="16" fill="#3b2a1a"/>
  <circle cx="170.5" cy="167" r="4.2" fill="url(#goldA)"/>
  ${Y(170.5,157)}
</g>`,Qt=()=>`<g data-layer="prop">
  <rect x="168" y="62" width="5" height="104" rx="2.4" fill="url(#goldB)"/>
  <rect x="166.5" y="88" width="8" height="3" rx="1.5" fill="url(#goldA)"/>
  <rect x="166.5" y="120" width="8" height="3" rx="1.5" fill="url(#goldA)"/>
  <circle cx="170.5" cy="57" r="8.5" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".8"/>
  <circle cx="170.5" cy="57" r="3.2" fill="#b3202e"/>
  <path d="M170.5 41v9M166 45.5h9" stroke="url(#goldB)" stroke-width="2.4" stroke-linecap="round"/>
  ${Y(170.5,157)}
</g>`,te=()=>`<g data-layer="prop">
  <path d="M86 168C84 148 88 128 88 112" stroke="#2f6b3f" stroke-width="2.2" fill="none"/>
  <path d="M87 136c-8-4-12-2-14 2c6 2 10 2 14-2ZM88 126c7-5 11-4 13-1c-5 3-9 3-13 1Z" fill="#2f8a52"/>
  <circle cx="88" cy="107" r="8" fill="#9b1c2e"/>
  <circle cx="88" cy="107" r="5.6" fill="#cc3b4d"/>
  <path d="M84.5 106.5q3.5-4 7 0q-3.5 3.6-7 0Z" fill="#7d1622"/>
  <path d="M82 101q6-3 12 0" stroke="#e8707c" stroke-width=".8" fill="none"/>
  ${Y(86,154)}
</g>`,ee=e=>{let r="";for(let a=0;a<=8;a++){const t=Math.PI*(1.08+a/8*.84);r+=`<path d="M86 132L${(86+Math.cos(t)*30).toFixed(1)} ${(132+Math.sin(t)*30).toFixed(1)}" stroke="#8a6a24" stroke-width=".7"/>`}return`<g data-layer="prop">
    <path d="M86 132L${(86+Math.cos(Math.PI*1.08)*32).toFixed(1)} ${(132+Math.sin(Math.PI*1.08)*32).toFixed(1)}A32 32 0 0 1 ${(86+Math.cos(Math.PI*1.92)*32).toFixed(1)} ${(132+Math.sin(Math.PI*1.92)*32).toFixed(1)}Z" fill="${e.light}" stroke="url(#goldA)" stroke-width="1.4"/>
    <path d="M86 132L${(86+Math.cos(Math.PI*1.08)*22).toFixed(1)} ${(132+Math.sin(Math.PI*1.08)*22).toFixed(1)}A22 22 0 0 1 ${(86+Math.cos(Math.PI*1.92)*22).toFixed(1)} ${(132+Math.sin(Math.PI*1.92)*22).toFixed(1)}" fill="none" stroke="#fbeab0" stroke-width=".8" opacity=".8"/>
    ${r}
    ${Y(86,138)}
  </g>`},re=()=>`<g data-layer="prop">
  <rect x="83.5" y="96" width="4.5" height="72" rx="2" fill="url(#goldB)"/>
  <path d="M85.7 98c-8-4-10-14-7-22c3 5 5 7 7 7c2 0 4-2 7-7c3 8 1 18-7 22Z" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".7"/>
  <path d="M85.7 96c-2-6-1-12 0-16c1 4 2 10 0 16Z" fill="#fbeab0"/>
  <circle cx="85.7" cy="104" r="2.2" fill="#b3202e"/>
  ${Y(86,150)}
</g>`,oe=()=>`<g data-layer="prop">
  <rect x="168" y="58" width="4.5" height="112" rx="2" fill="#6b4a2b"/>
  <path d="M170.2 40l3.6 14h-7.2Z" fill="url(#steel)" stroke="#5b636c" stroke-width=".5"/>
  <path d="M172.5 60c10-2 17 4 18 14c-6-4-12-5-18-3Z" fill="url(#steel)" stroke="#5b636c" stroke-width=".6"/>
  <path d="M168 62c-5 0-8 3-9 7c3-2 6-2 9-2Z" fill="url(#steel)" stroke="#5b636c" stroke-width=".5"/>
  <path d="M166 76h9" stroke="url(#goldA)" stroke-width="3"/>
  <path d="M170.2 78c-3 4-4 8-2 12M170.2 78c3 4 4 8 2 12" stroke="#b3202e" stroke-width="1.6" fill="none"/>
  ${Y(170.2,152)}
</g>`;function ae(e,r){const a=e===0||e===3?Jt():Qt();return`${yt(r)}
    <path data-layer="hair" d="M104 93C102 78 112 66 125 66C138 66 148 78 146 93C148 105 146 117 140 124H110C104 117 102 105 104 93Z" fill="${r.hair}"/>
    ${Yt()}
    ${$t(r)}
    <path d="M109.5 100C110 116 116 129 125 134C134 129 140 116 140.5 100C137 111 132 116 125 116C118 116 113 111 109.5 100Z" fill="${r.hair}"/>
    <path d="M118 120q2 6 0 10M125 122v10M132 120q-2 6 0 10" stroke="#000" stroke-width=".6" opacity=".35" fill="none"/>
    <path d="M114 110.5q5.5-4.5 11-1.2q5.5-3.3 11 1.2q-5.5.8-11 .6q-5.5.2-11-.6Z" fill="${r.hair}"/>
    <g data-layer="crown">
      <path d="M106 76L103.5 56L114 66.5L119 51L125 61L131 51L136 66.5L146.5 56L144 76Z" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".8"/>
      <rect x="105.5" y="74" width="39" height="9.5" rx="1.6" fill="url(#goldB)" stroke="#8a6a24" stroke-width=".7"/>
      <circle cx="103.5" cy="56" r="2.6" fill="url(#pearl)"/><circle cx="119" cy="51" r="2.6" fill="url(#pearl)"/>
      <circle cx="131" cy="51" r="2.6" fill="url(#pearl)"/><circle cx="146.5" cy="56" r="2.6" fill="url(#pearl)"/>
      <path d="M125 45v13M120.6 49.4h8.8" stroke="url(#goldB)" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="125" cy="78.8" r="2.8" fill="#b3202e" stroke="#fbeab0" stroke-width=".5"/>
      <circle cx="114.5" cy="78.8" r="1.9" fill="#1f8d68"/><circle cx="135.5" cy="78.8" r="1.9" fill="#1f8d68"/>
    </g>
    ${a}
    ${Pt(e)}`}function ie(e,r){const a=e===1?te():e===2?ee(r):re();let t="";for(let o=0;o<=8;o++){const i=Math.PI*(.15+o/8*.7);t+=`<circle cx="${(125+Math.cos(i)*15).toFixed(1)}" cy="${(124+Math.sin(i)*9).toFixed(1)}" r="1.7" fill="url(#pearl)"/>`}return`<path data-layer="veil" d="M101 82C92 104 85 132 78 175H172C165 132 158 104 149 82Z" fill="#fbf7ec" opacity=".5"/>
    <path d="M104 92C88 120 84 150 82 175M146 92C162 120 166 150 168 175" stroke="#d9cfb3" stroke-width=".6" fill="none" opacity=".8"/>
    ${yt(r)}
    <path data-layer="hair" d="M106 92C102 76 112 64 125 64C138 64 148 76 144 92C150 110 152 128 146 140H104C98 128 100 110 106 92Z" fill="${r.hair}"/>
    <path d="M84 139q10 8 20 0q10 8 21 0q10 8 21 0q10 8 20 0L166 132C150 125 100 125 84 132Z" fill="#fbf7ec" stroke="url(#goldB)" stroke-width="1"/>
    ${$t(r,{cy:97,rx:14.5,ry:18,lips:"#b3202e",lashes:!0})}
    <path d="M110.5 92C113 82 119 79 125 79C131 79 137 82 139.5 92C136 86 131 84 125 84C119 84 114 86 110.5 92Z" fill="${r.hair}"/>
    ${t}
    <circle cx="125" cy="133.5" r="2.6" fill="#b3202e" stroke="#fbeab0" stroke-width=".5"/>
    <g data-layer="crown">
      <path d="M109 78L111 63L118 71L125 57L132 71L139 63L141 78Z" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".7"/>
      <rect x="108.5" y="76" width="33" height="5.5" rx="1.4" fill="url(#goldB)" stroke="#8a6a24" stroke-width=".6"/>
      <circle cx="111" cy="63" r="2" fill="url(#pearl)"/><circle cx="125" cy="57" r="2.3" fill="url(#pearl)"/><circle cx="139" cy="63" r="2" fill="url(#pearl)"/>
      <path d="M125 64l3 4.5-3 4.5-3-4.5Z" fill="#b3202e" stroke="#fbeab0" stroke-width=".5"/>
    </g>
    ${a}
    ${Pt(e,125,160)}`}function le(e,r){return`${yt(r)}
    <path data-layer="sash" d="M58 146L76 136L196 175H158Z" fill="url(#goldB)" opacity=".92"/>
    <path d="M62 147L196 175" stroke="#8a6a24" stroke-width=".6" opacity=".7"/>
    <g data-layer="ruff">${[104,111,118,125,132,139,146].map(a=>`<circle cx="${a}" cy="128" r="4.2" fill="#fbf7ec" stroke="#cfc3a2" stroke-width=".6"/>`).join("")}</g>
    ${$t(r,{cy:100,rx:14,ry:17,lips:"#a5524a"})}
    <path data-layer="hair" d="M107 98C104 82 113 72 125 72C137 72 146 82 143 98C140 91 134 87 125 87C116 87 110 91 107 98Z" fill="${r.hair}"/>
    <circle cx="108.5" cy="99" r="3.6" fill="${r.hair}"/><circle cx="141.5" cy="99" r="3.6" fill="${r.hair}"/>
    <g data-layer="crown">
      <path d="M138 74C149 60 160 51 178 48C168 57 158 66 143 78Z" fill="#fbf7ec" stroke="#cfc3a2" stroke-width=".7"/>
      <path d="M142 75C152 64 162 56 175 50" stroke="#cfc3a2" stroke-width=".6" fill="none"/>
      <path d="M103 80C104 67 114 60 125 60C136 60 145 66 147 78Z" fill="${r.light}"/>
      <ellipse cx="125" cy="79" rx="24" ry="5.5" fill="${r.robe}" stroke="url(#goldB)" stroke-width="1.4"/>
      <circle cx="140" cy="76" r="3" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".5"/>
    </g>
    <g data-layer="shield">
      <path d="M68 118h32v19c0 13-9 21-16 25c-7-4-16-12-16-25Z" fill="#fbf7ec" stroke="url(#goldA)" stroke-width="2.2"/>
      <path d="M72 122h24v15c0 10-6 16-12 19c-6-3-12-9-12-19Z" fill="none" stroke="${r.robe}" stroke-width=".8"/>
      ${D(e,75.5,127,17)}
    </g>
    ${oe()}`}function ce(){const e='<path d="M50 70C50 58 56 50 68 50M50 60C53 56 56 55 58 50M57 70c0-6 3-10 9-10" stroke="url(#goldB)" stroke-width="1.3" fill="none" stroke-linecap="round"/><circle cx="50" cy="72.5" r="1.6" fill="#c9a24a"/><circle cx="70.5" cy="50" r="1.6" fill="#c9a24a"/>';return`<g data-layer="filigree">
    ${e}
    <g transform="matrix(-1 0 0 1 250 0)">${e}</g>
    <g transform="matrix(1 0 0 -1 0 350)">${e}</g>
    <g transform="rotate(180 125 175)">${e}</g>
  </g>`}function ne(e,r){const a=Kt[r],t=e===11?ae(r,a):e===10?ie(r,a):le(r,a);return`<g data-layer="base">
      <rect x="46" y="46" width="158" height="258" rx="5" fill="#fbf7ec"/>
      <rect x="46" y="46" width="158" height="258" rx="5" fill="url(#lattice)"/>
    </g>
    <g clip-path="url(#courtHalf)">${t}</g>
    <g transform="rotate(180 125 175)"><g clip-path="url(#courtHalf)">${t}</g></g>
    <path d="M46 175H204" stroke="url(#goldC)" stroke-width="1.6"/>
    <path d="M125 169l6 6-6 6-6-6Z" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".6"/>
    <rect x="46" y="46" width="158" height="258" rx="5" fill="none" stroke="url(#goldA)" stroke-width="2"/>
    <rect x="50" y="50" width="150" height="250" rx="3" fill="none" stroke="#c9a24a" stroke-width=".6"/>
    ${ce()}`}const A=125,Z=175;function se(){let e="";for(let r=0;r<24;r++){const a=r/24*Math.PI*2,t=r%2===0,o=70,i=t?104:88,l=t?.045:.03,n=(b,h)=>`${(A+Math.cos(a+h)*b).toFixed(1)} ${(Z+Math.sin(a+h)*b).toFixed(1)}`;e+=`<path d="M${n(o,-l)}L${n(i,0)}L${n(o,l)}Z" fill="url(#goldB)" opacity="${t?.8:.5}"/>`}return e}function kt(e){let r="";const a=e==="left"?-1:1;for(let t=0;t<9;t++){const o=Math.PI/2+a*(.35+t*.13),i=80,l=A+Math.cos(o)*i,n=Z+Math.sin(o)*i,b=o*180/Math.PI+(e==="left"?-60:60);r+=`<ellipse cx="${l.toFixed(1)}" cy="${n.toFixed(1)}" rx="7" ry="2.6" transform="rotate(${b.toFixed(1)} ${l.toFixed(1)} ${n.toFixed(1)})" fill="url(#goldA)" stroke="#8a6a24" stroke-width=".4"/>`}return r}function de(){return`<g data-layer="body">
    <circle cx="${A}" cy="${Z}" r="104" fill="url(#aceGlow)"/>
    ${se()}
    ${kt("left")}${kt("right")}
    <circle cx="${A}" cy="${Z}" r="69" fill="#fbf7ec" stroke="url(#goldA)" stroke-width="2.4"/>
    <circle cx="${A}" cy="${Z}" r="54" fill="none" stroke="#c9a24a" stroke-width=".8"/>
    <g class="ace-ring">
      <text font-family="Cormorant Garamond, Georgia, serif" font-size="9.6" font-weight="700" letter-spacing="2.6" fill="#8a6a24">
        <textPath href="#aceRingPath">PEECE · EST · MMXXVI · PEECE · EST · MMXXVI ·</textPath>
      </text>
    </g>
    ${D(0,A-40,Z-42,80,{stroke:"#c9a24a",strokeWidth:1.4})}
    <path d="M${A} ${Z-12}l3 5-3 5-3-5Z" fill="url(#goldA)"/>
    ${D(0,A-7,52,14,{fill:"url(#goldB)"})}
    ${D(0,A-7,284,14,{fill:"url(#goldB)",rotate:!0})}
  </g>`}function fe(e){return`<g data-layer="body">
    <circle cx="${A}" cy="${Z}" r="58" fill="none" stroke="#c9a24a" stroke-width="1" opacity=".7"/>
    <circle cx="${A}" cy="${Z}" r="52" fill="none" stroke="#c9a24a" stroke-width=".5" opacity=".6"/>
    ${[0,1,2,3].map(r=>`<path d="M${A} ${Z-66+(r%2?132:0)}l3 4-3 4-3-4Z" fill="#c9a24a" transform="rotate(${r<2?0:90} ${A} ${Z})"/>`).join("")}
    ${D(e,A-36,Z-36,72)}
  </g>`}function he(){return`<rect width="250" height="350" rx="14" fill="#fbf7ec"/>
    <rect x="6" y="6" width="238" height="338" rx="10" fill="url(#goldA)"/>
    <rect x="9" y="9" width="232" height="332" rx="8" fill="url(#navyG)"/>
    <rect x="9" y="9" width="232" height="332" rx="8" fill="url(#backLattice)"/>
    <rect x="20" y="20" width="210" height="310" rx="6" fill="none" stroke="url(#goldA)" stroke-width="1.4"/>
    <rect x="25" y="25" width="200" height="300" rx="4" fill="none" stroke="#c9a24a" stroke-width=".6" opacity=".7"/>
    <circle cx="125" cy="175" r="54" fill="#0a1220" stroke="url(#goldA)" stroke-width="2.2"/>
    <circle cx="125" cy="175" r="47" fill="none" stroke="#c9a24a" stroke-width=".7" opacity=".8"/>
    ${[...Array(16)].map((e,r)=>`<circle cx="${(125+Math.cos(r/16*Math.PI*2)*50.5).toFixed(1)}" cy="${(175+Math.sin(r/16*Math.PI*2)*50.5).toFixed(1)}" r="1.2" fill="#e2c36b"/>`).join("")}
    <g transform="translate(125 172) scale(1.15) translate(-32 -34)">${St("url(#goldA)")}</g>
    ${[[34,34],[216,34],[34,316],[216,316]].map(([e,r])=>`<path d="M${e} ${r-7}l7 7-7 7-7-7Z" fill="url(#goldA)"/>`).join("")}`}const pe=["♠","♥","♦","♣"],ue=["Spades","Hearts","Diamonds","Clubs"],Tt=["2","3","4","5","6","7","8","9","10","J","Q","K","A"],me=["Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Jack","Queen","King","Ace"],et=e=>Math.floor(e/13),wt=e=>e%13,ge=e=>et(e)===1||et(e)===2,Re=e=>3-e,Rt=e=>`${me[wt(e)]} of ${ue[et(e)]}`,Fe=e=>`${Tt[wt(e)]}${pe[et(e)]}`,Ze=()=>Array.from({length:52},(e,r)=>r),Mt="http://www.w3.org/2000/svg";function ye(e,r){const a=r===1||r===2?"#a3202e":"#14110c",t=Tt[e],i=`<text x="27" y="50" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-weight="700" font-size="${t==="10"?34:40}" letter-spacing="${t==="10"?-2:0}" fill="${a}">${t}</text>
    ${D(r,17,57,20)}`;return`<g data-layer="indices">${i}<g transform="rotate(180 125 175)">${i}</g></g>`}function $e(e){const r=wt(e),a=et(e);let t;return r===12?t=a===0?de():fe(a):r>=9?t=ne(r,a):t=`<g data-layer="body">${zt(r+2,a)}</g>`,`<g clip-path="url(#cardClip)">
      <rect data-layer="base" width="250" height="350" rx="14" fill="url(#paper)"/>
      <rect width="250" height="350" fill="url(#grain)" opacity=".55"/>
    </g>
    <g data-layer="frame">
      <rect x="8" y="8" width="234" height="334" rx="10" fill="none" stroke="url(#goldA)" stroke-width="2"/>
      <rect x="11.5" y="11.5" width="227" height="327" rx="8" fill="none" stroke="#c9a24a" stroke-width=".75" opacity=".85"/>
    </g>
    ${t}
    ${ye(r,a)}
    <rect width="250" height="350" rx="14" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1"/>`}function ut(e){return At(`card-${e}`,()=>$e(e))}function Ft(){return At("card-back",he)}function vt(e,r="card-svg"){const a=e==="back"?Ft():ut(e),t=document.createElementNS(Mt,"svg");t.setAttribute("viewBox","0 0 250 350"),t.setAttribute("class",r),t.setAttribute("role","img"),t.setAttribute("aria-label",e==="back"?"Card back":Rt(e));const o=document.createElementNS(Mt,"use");return o.setAttribute("href",`#${a}`),t.append(o),t}function we({id:e=null,faceUp:r=!0,button:a=!1,label:t}={}){const o=document.createElement(a?"button":"div");o.className="card",a?(o.type="button",o.setAttribute("aria-pressed","false")):o.setAttribute("role","img");const i=document.createElement("div");i.className="card__inner";const l=document.createElement("div");l.className="card__face card__front";const n=document.createElement("div");n.className="card__face card__back",n.append(vt("back"));const b=document.createElement("div");b.className="card__sheen",i.append(l,n),o.append(i,b),o.setFace=s=>{o.dataset.id=s??"",l.replaceChildren(),s!=null&&(l.append(vt(s)),o.classList.toggle("is-red",ge(s))),h()};const h=()=>{const s=o.dataset.id!==""&&o.dataset.id!=null,c=t||(s&&!o.classList.contains("is-down")?Rt(+o.dataset.id):"Face-down card");o.setAttribute("aria-label",c)};return o.flip=s=>{o.classList.toggle("is-down",!s),h()},o.setFace(e),o.flip(r&&e!=null),o}const ct=[[255,250,210],[255,214,120],[255,150,40],[214,70,20],[120,20,10]];function Ct(e,r){const a=Math.min(.999,Math.max(0,e))*(ct.length-1),t=Math.floor(a),o=a-t,i=ct[t].map((l,n)=>Math.round(l+(ct[t+1][n]-l)*o));return`rgba(${i[0]},${i[1]},${i[2]},${r})`}const nt=(e,r)=>Math.sin(e*1.7+r*1.3)*.5+Math.sin(e*3.1-r*2.1)*.3+Math.sin(e*5.3+r*3.7)*.2;function xe(e,r=64){const a=document.createElement("canvas");a.width=a.height=r;const t=a.getContext("2d"),o=t.createRadialGradient(r/2,r/2,0,r/2,r/2,r/2);return o.addColorStop(0,e.replace("A","1")),o.addColorStop(.35,e.replace("A",".55")),o.addColorStop(1,e.replace("A","0")),t.fillStyle=o,t.fillRect(0,0,r,r),a}function be({back:e,front:r,target:a,budget:t=1,embersOnly:o=!1}){const i=e.getContext("2d"),l=r.getContext("2d"),n=Math.min(2,window.devicePixelRatio||1),b=[0,.25,.5,.75,.95].map(d=>xe(Ct(d,"A")));let h=0,s=0,c=null,u=[],$=[],m=!1,P=0,C=0,S=1;const V=Math.round(260*t),I=Math.round(80*t);function N(){h=window.innerWidth,s=window.innerHeight;for(const d of[e,r])d.width=Math.round(h*n),d.height=Math.round(s*n),d.style.width=`${h}px`,d.style.height=`${s}px`,d.getContext("2d").setTransform(n,0,0,n,0,0);c=a.getBoundingClientRect()}function v(d){for(let y=0;y<d&&u.length<V;y++){const E=Math.random();let f,p;E<.62?(f=c.left+Math.random()*c.width,p=c.bottom-Math.random()*c.height*.08):(f=E<.81?c.left+Math.random()*10:c.right-Math.random()*10,p=c.top+c.height*(.45+Math.random()*.55));const T=c.width*(.1+Math.random()*.16)*(.7+S*.3);u.push({x:f,y:p,vx:(Math.random()-.5)*18,vy:-(40+Math.random()*70)*(.8+S*.4),life:0,max:.7+Math.random()*.9,size:T,front:E<.62&&Math.random()<.3})}}function G(d){for(let y=0;y<d&&$.length<I;y++)$.push({x:c.left+Math.random()*c.width,y:c.bottom-Math.random()*c.height*.5,vy:-(30+Math.random()*90),life:0,max:1.6+Math.random()*2.4,r:.8+Math.random()*1.8,phase:Math.random()*6.28})}function q(d,y,E,f,p){const T=c.bottom+c.height*.06;for(let B=0;B<E;B++){const rt=(B+.5)/E,O=c.left-c.width*.32+rt*c.width*1.64,Bt=Math.abs(rt-.5)*2,J=c.height*f*(.3+.45*Bt+.18*nt(B*.9,y))*(.75+S*.25),X=c.width/E*1.9,It=nt(B*1.3+7,y*1.4)*X*.9,it=O+It,ot=T-J,W=d.createLinearGradient(0,T,0,ot);W.addColorStop(0,"rgba(150,25,10,0)"),W.addColorStop(.1,`rgba(170,35,12,${p})`),W.addColorStop(.32,`rgba(240,110,30,${p*.9})`),W.addColorStop(.65,`rgba(255,200,90,${p*.6})`),W.addColorStop(1,"rgba(255,245,200,0)"),d.fillStyle=W,d.beginPath(),d.moveTo(O-X/2,T),d.bezierCurveTo(O-X*.6,T-J*.45,it-X*.15,ot+J*.25,it,ot),d.bezierCurveTo(it+X*.15,ot+J*.25,O+X*.6,T-J*.45,O+X/2,T),d.closePath(),d.fill()}}function U(d){if(!m)return;const y=Math.min(.05,(d-C)/1e3||.016);C=d;const E=d/1e3;c=a.getBoundingClientRect(),o||v(Math.round(160*y*t*(.6+S))),G(Math.random()<(o?45:30)*y*t*S?1:0);for(const f of[i,l])f.globalCompositeOperation="source-over",f.clearRect(0,0,h,s),f.globalCompositeOperation="lighter";if(!o){const f=i.createRadialGradient(c.left+c.width/2,c.bottom,0,c.left+c.width/2,c.bottom,c.width*1.1);f.addColorStop(0,`rgba(255,120,40,${.2*S})`),f.addColorStop(1,"rgba(255,120,40,0)"),i.fillStyle=f,i.fillRect(0,0,h,s),q(i,E,9,1.25,.62),q(i,E*1.3+5,12,.75,.55),q(l,E*1.7+11,12,.3,.4),u=u.filter(p=>(p.life+=y)<p.max);for(const p of u){const T=p.life/p.max;p.x+=(p.vx+nt(p.y*.02,E)*22)*y,p.y+=p.vy*y;const B=p.size*(1-T*.6),rt=b[Math.min(4,Math.floor(T*5))],O=p.front?l:i;O.globalAlpha=(1-T)*(p.front?.28:.6),O.drawImage(rt,p.x-B/2,p.y-B/2,B,B)}l.globalAlpha=i.globalAlpha=1}$=$.filter(f=>(f.life+=y)<f.max);for(const f of $){f.y+=f.vy*y,f.x+=Math.sin(E*2+f.phase)*24*y+8*y;const p=.55+.45*Math.sin(E*18+f.phase*3);l.fillStyle=Ct(.1+f.life/f.max*.6,(1-f.life/f.max)*p),l.beginPath(),l.arc(f.x,f.y,f.r,0,Math.PI*2),l.fill()}P=requestAnimationFrame(U)}const k=()=>document.hidden?cancelAnimationFrame(P):m&&(P=requestAnimationFrame(U));return{start(){N(),m=!0,C=performance.now(),window.addEventListener("resize",N),document.addEventListener("visibilitychange",k),P=requestAnimationFrame(U)},stop(){m=!1,cancelAnimationFrame(P),window.removeEventListener("resize",N),document.removeEventListener("visibilitychange",k)},setIntensity(d){S=d},flare(){S=2.4,v(120),G(40)}}}const ke="attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}",Me=`
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
}`;function _t(e,r,a){const t=e.createShader(r);return e.shaderSource(t,a),e.compileShader(t),e.getShaderParameter(t,e.COMPILE_STATUS)?t:(console.warn(e.getShaderInfoLog(t)),null)}function ve({canvas:e,image:r,target:a}){const t=e.getContext("webgl",{premultipliedAlpha:!0,alpha:!0,antialias:!1});if(!t)return null;const o=_t(t,t.VERTEX_SHADER,ke),i=_t(t,t.FRAGMENT_SHADER,Me);if(!o||!i)return null;const l=t.createProgram();if(t.attachShader(l,o),t.attachShader(l,i),t.linkProgram(l),!t.getProgramParameter(l,t.LINK_STATUS))return null;t.useProgram(l);const n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW);const b=t.getAttribLocation(l,"a");t.enableVertexAttribArray(b),t.vertexAttribPointer(b,2,t.FLOAT,!1,0,0);const h=t.createTexture();t.bindTexture(t.TEXTURE_2D,h),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);const s=Object.fromEntries(["uCard","uRes","uRect","uTime","uBurn","uFlare"].map(v=>[v,t.getUniformLocation(l,v)]));t.uniform1i(s.uCard,0),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA);const c=Math.min(1.75,window.devicePixelRatio||1);let u=0,$=!1,m=-.16,P=0,C=null;const S=performance.now();function V(){e.width=Math.round(innerWidth*c),e.height=Math.round(innerHeight*c),e.style.width=`${innerWidth}px`,e.style.height=`${innerHeight}px`,t.viewport(0,0,e.width,e.height)}function I(v){if(!$)return;if(C){const U=Math.min(1,(v-C.start)/C.ms),k=1-Math.pow(1-U,2.2);m=C.from+(C.to-C.from)*k,U>=1&&(C=null)}else m+=4e-5*(v-(I.last||v));I.last=v;const G=a.getBoundingClientRect(),q=innerHeight;t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.uniform2f(s.uRes,e.width,e.height),t.uniform4f(s.uRect,G.left*c,(q-G.bottom)*c,G.right*c,(q-G.top)*c),t.uniform1f(s.uTime,(v-S)/1e3),t.uniform1f(s.uBurn,m),t.uniform1f(s.uFlare,P),t.drawArrays(t.TRIANGLE_STRIP,0,4),u=requestAnimationFrame(I)}const N=()=>document.hidden?cancelAnimationFrame(u):$&&(u=requestAnimationFrame(I));return{start(){V(),$=!0,addEventListener("resize",V),document.addEventListener("visibilitychange",N),u=requestAnimationFrame(I)},stop(){$=!1,cancelAnimationFrame(u),removeEventListener("resize",V),document.removeEventListener("visibilitychange",N),t.getExtension("WEBGL_lose_context")?.loseContext()},burnTo(v,G){C={from:m,to:v,ms:G,start:performance.now()}},flare(){P=1},get level(){return m}}}function Ce(e){return new Promise((r,a)=>{const t=URL.createObjectURL(new Blob([e],{type:"image/svg+xml"})),o=new Image;o.onload=()=>{URL.revokeObjectURL(t),r(o)},o.onerror=a,o.src=t})}const M="#141414",z="#c4122f",st="#1d4f9e",F="#f2c12e",dt="#fbeedd",g=`stroke="${M}" stroke-linejoin="round" stroke-linecap="round"`,Zt=(e,r,a,t=M)=>`<path d="${mt[0]}" transform="translate(${e} ${r}) scale(${a/100})" fill="${t}"/>`;function ft(e,r,a,t){return e.map(o=>`<circle cx="${o}" cy="${r}" r="${a}" fill="${t}" ${g} stroke-width=".8"/>`).join("")}function Lt(){const e=[[60,156],[68,147],[78,140],[178,140],[188,147],[196,156]].map(([t,o])=>`<path d="M${t} ${o}c-1.4 2.6-1.4 4.6 0 6.4c1.4-1.8 1.4-3.8 0-6.4Z" fill="${M}"/>`).join("");let r="";for(let t=0;t<6;t++)r+=`<rect x="${121+t%2*5}" y="${144+t*5}" width="5" height="5" fill="${t%2?M:F}"/>`;let a="M98 133";for(let t=0;t<12;t++)a+=` L${101+t*5} ${t%2?133:138}`;return`
  <!-- sword blade raised behind the King -->
  <path d="M62 40 L68 45 L77 128 L70 129 Z" fill="#e9ecef" ${g}/>
  <path d="M65.5 45 L73.5 127" stroke="${M}" stroke-width=".7"/>
  <!-- robe -->
  <path d="M36 175 L36 148 C50 134 80 128 104 126 L152 126 C176 128 206 134 214 148 L214 175 Z" fill="${z}" ${g}/>
  ${ft([58,70,186,198],166,2.6,F)}
  ${ft([64,192],158,2,F)}
  <path d="M36 148 C50 134 80 128 104 126 L106 133 C84 136 58 142 44 158 L36 160 Z" fill="#fff" ${g}/>
  <path d="M214 148 C200 134 176 128 152 126 L150 133 C172 136 198 142 206 158 L214 160 Z" fill="#fff" ${g}/>
  ${e}
  <path d="M104 128 L152 128 L160 175 L96 175 Z" fill="${st}" ${g}/>
  <path d="M108 140 L100 175 M148 140 L156 175" stroke="${F}" stroke-width="2.2"/>
  ${r}
  <rect x="121" y="144" width="10" height="30" fill="none" ${g} stroke-width=".9"/>
  <!-- hilt and gripping hand -->
  <rect x="55" y="125" width="38" height="7" rx="3" fill="${F}" ${g} transform="rotate(-6 74 128)"/>
  <circle cx="56" cy="130.5" r="3.3" fill="${z}" ${g} stroke-width=".9"/>
  <circle cx="92.5" cy="126.4" r="3.3" fill="${z}" ${g} stroke-width=".9"/>
  <path d="M66 140 C62 134 66 130 74 131 C82 132 86 137 84 143 C82 149 72 149 66 140 Z" fill="${dt}" ${g}/>
  <path d="M71 134 C73 137 75 139 79 139 M69 137 C71 141 73 143 77 143" stroke="${M}" stroke-width=".8" fill="none"/>
  <!-- collar -->
  <path d="M94 133 C108 145 148 145 162 133 C156 123 100 123 94 133 Z" fill="${F}" ${g}/>
  <path d="${a}" fill="none" stroke="${M}" stroke-width=".9"/>
  <!-- neck -->
  <path d="M120 112 L136 112 L138 126 L118 126 Z" fill="${dt}" ${g}/>
  <!-- hair curls -->
  ${[[111,84],[109,95],[110,106],[149,84],[151,95],[150,106]].map(([t,o])=>`<circle cx="${t}" cy="${o}" r="5.2" fill="${F}" ${g} stroke-width="1"/><path d="M${t-2.6} ${o}a2.6 2.6 0 1 1 2.6 2.6" fill="none" stroke="${M}" stroke-width=".7"/>`).join("")}
  <!-- face, three-quarter to the left -->
  <path d="M114 84 C114 74 121 69 130 69 C140 69 147 76 147 88 C147 101 141 111 131 113 C121 113 114 103 114 92 Z" fill="${dt}" ${g}/>
  <path d="M117 86 q5 -3 9 0 M133 86 q5 -3 9 0" fill="none" stroke="${M}" stroke-width="1.2"/>
  <path d="M118 91 q4 -2.6 8 0 q-4 2 -8 0Z M134 91 q4 -2.6 8 0 q-4 2 -8 0Z" fill="#fff" stroke="${M}" stroke-width=".9"/>
  <circle cx="120.6" cy="91" r="1.4" fill="${M}"/><circle cx="136.6" cy="91" r="1.4" fill="${M}"/>
  <path d="M129 91 C128 96 125 100 126 102 C127 103.5 130 103 131 102" fill="none" stroke="${M}" stroke-width="1"/>
  <!-- moustache and beard -->
  <path d="M130 105 C126 103 119 104 114 109 C120 108 125 109 130 108 C135 109 140 108 146 109 C141 104 134 103 130 105 Z" fill="${F}" ${g} stroke-width="1"/>
  <path d="M115 100 C115 117 121 128 130 133 C139 128 145 117 145 100 C142 110 137 113 130 113 C123 113 118 110 115 100 Z" fill="${F}" ${g}/>
  <path d="M120 112 q1 6 4 11 M126 114 q0 7 2 13 M134 114 q0 7 -2 13 M140 112 q-1 6 -4 11" fill="none" stroke="${M}" stroke-width=".8"/>
  <path d="M126 110 q4 2 8 0" fill="none" stroke="${z}" stroke-width="1.6"/>
  <!-- crown -->
  <path d="M112 66 C114 52 146 52 148 66 Z" fill="${z}" ${g}/>
  <path d="M110 68 L107 50 L117 58 L123 44 L130 55 L137 44 L143 58 L153 50 L150 68 Z" fill="${F}" ${g}/>
  ${ft([107,123,137,153],50,2.4,"#fff").replace(/cy="50"/g,'cy="50"')}
  <path d="M130 34 v9 M126 38 h8" stroke="${M}" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M130 34 v9 M126 38 h8" stroke="${F}" stroke-width="1.6" stroke-linecap="round"/>
  <rect x="109" y="66" width="42" height="9" rx="1.5" fill="${F}" ${g}/>
  <circle cx="130" cy="70.5" r="3" fill="${z}" ${g} stroke-width=".9"/>
  <rect x="116" y="68" width="5" height="5" fill="${st}" ${g} stroke-width=".8" transform="rotate(45 118.5 70.5)"/>
  <rect x="139" y="68" width="5" height="5" fill="${st}" ${g} stroke-width=".8" transform="rotate(45 141.5 70.5)"/>
  <!-- suit symbol in the frame corner -->
  ${Zt(186,46,18)}`}function _e(e=3){const r=250*e,a=350*e,t=`<text x="25" y="50" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="38" fill="${M}">K</text>${Zt(15.5,56,19)}`;return`<svg xmlns="http://www.w3.org/2000/svg" width="${r}" height="${a}" viewBox="0 0 250 350">
  <defs>
    <clipPath id="half"><rect x="38" y="40" width="174" height="135"/></clipPath>
    <linearGradient id="paperG" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#fffefa"/><stop offset="1" stop-color="#f4efe2"/></linearGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .3 0 0 0 0 .25 0 0 0 0 .2 0 0 0 .12 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  </defs>
  <rect width="250" height="350" rx="14" fill="url(#paperG)"/>
  <rect width="250" height="350" rx="14" fill="#fff" filter="url(#grain)"/>
  <rect x="38" y="40" width="174" height="270" fill="#fff"/>
  <g clip-path="url(#half)" stroke-width="1.3">${Lt()}</g>
  <g transform="rotate(180 125 175)"><g clip-path="url(#half)" stroke-width="1.3">${Lt()}</g></g>
  <path d="M38 175 H212" stroke="${M}" stroke-width="1.4"/>
  <rect x="38" y="40" width="174" height="270" fill="none" stroke="${M}" stroke-width="1.6"/>
  <rect x="35" y="37" width="180" height="276" fill="none" stroke="${M}" stroke-width=".6"/>
  ${t}
  <g transform="rotate(180 125 175)">${t}</g>
  <rect x=".5" y=".5" width="249" height="349" rx="13.5" fill="none" stroke="#cfc6b0" stroke-width="1"/>
</svg>`}const Gt="peece.loaderSeen",Le=2200;function Ee(){try{return!sessionStorage.getItem(Gt)}catch{return!0}}async function Ae(e=[]){try{sessionStorage.setItem(Gt,"1")}catch{}const r=jt(),a=(navigator.hardwareConcurrency||4)<=4||matchMedia("(max-width: 520px)").matches,t=pt(`<svg class="loader__ring" viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(226,195,107,.15)" stroke-width="1.5"/>
      <circle class="loader__ring-fill" cx="60" cy="60" r="54" fill="none" stroke="url(#ringGrad)" stroke-width="2.5"
        stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" transform="rotate(-90 60 60)"/>
      <defs><linearGradient id="ringGrad"><stop offset="0" stop-color="#8a6a24"/><stop offset=".5" stop-color="#f6e3a3"/><stop offset="1" stop-color="#c9a24a"/></linearGradient></defs>
    </svg>`),o=pt(`<svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <filter id="heat"><feTurbulence id="heatNoise" type="fractalNoise" baseFrequency=".012 .06" numOctaves="2" seed="3"/>
      <feDisplacementMap in="SourceGraphic" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter></svg>`),i=we({id:11});i.classList.add("loader__card");const l=_("div",{class:"loader__char"});i.append(l);const n=[..."PEECE"].map(k=>_("span",{class:"loader__letter"},k)),b=_("canvas",{class:"loader__canvas loader__canvas--back","aria-hidden":"true"}),h=_("canvas",{class:"loader__canvas loader__canvas--front","aria-hidden":"true"}),s=_("canvas",{class:"loader__canvas loader__canvas--gl","aria-hidden":"true"}),c=_("button",{class:"btn btn--ghost btn--sm loader__skip",type:"button"},"Skip"),u=_("span",{class:"loader__pct tabular"},"0%"),$=_("div",{class:`loader${r?" is-calm":""}`,role:"dialog","aria-label":"Loading PEECE"},o,b,_("div",{class:"loader__brand"},_("div",{class:"loader__mark",html:Xt("loader__crown","loaderCrown")},t),_("h1",{class:"loader__word","aria-label":"PEECE"},n),_("span",{class:"loader__underline"}),_("p",{class:"loader__tag"},"The midnight card lounge"),u),_("div",{class:"loader__stage"},_("div",{class:"loader__glow","aria-hidden":"true"}),i),s,h,_("div",{class:"loader__flash"}),c);document.body.append($);let m=null;if(!r)try{const k=await Promise.race([Ce(_e(a?2:3)),tt(1500).then(()=>Promise.reject(new Error("slow")))]);m=ve({canvas:s,image:k,target:i})}catch{m=null}m&&($.classList.add("is-gl"),m.start(),m.burnTo(.27,2600));const P=r?null:be({back:b,front:h,target:i,budget:a?.55:1,embersOnly:!!m});P?.start();let C=0;const S=$.querySelector("#heatNoise");if(!r&&S){const k=d=>{const y=.06+Math.sin(d/380)*.012;S.setAttribute("baseFrequency",`${(.012+Math.sin(d/900)*.003).toFixed(4)} ${y.toFixed(4)}`),C=requestAnimationFrame(k)};C=requestAnimationFrame(k)}const V=$.querySelector(".loader__ring-fill");let I=0;const N=Math.max(1,e.length),v=k=>{V.setAttribute("stroke-dashoffset",String(100-k*100)),u.textContent=`${Math.round(k*100)}%`,n.forEach((d,y)=>d.classList.toggle("is-lit",k>=(y+.5)/n.length||k===1))},G=Promise.all(e.map(k=>Promise.resolve(k).catch(()=>{}).then(()=>v(++I/N))));requestAnimationFrame(()=>$.classList.add("is-in"));let q=!1;const U=new Promise(k=>{setTimeout(()=>c.classList.add("is-ready"),1e3),c.addEventListener("click",()=>{q=!0,k()})});v(.04),await Promise.race([Promise.all([G,tt(r?900:Le)]),U]),v(1),!q&&!r&&($.classList.add("is-flaring"),P?.flare(),m?(m.flare(),m.burnTo(1.45,1100),await tt(1e3)):await tt(700)),$.classList.add("is-out"),await tt(r?300:650),P?.stop(),m?.stop(),cancelAnimationFrame(C),$.remove()}const j={lobby:()=>Q(()=>import("./lobby-BVheSBHT.js"),__vite__mapDeps([0,1,2,3])),table:()=>Q(()=>import("./table-BMq4ps-M.js"),__vite__mapDeps([4,1,2,3,5])),howto:()=>Q(()=>import("./howto-CAuch1W-.js"),__vite__mapDeps([6,1])),treasury:()=>Q(()=>import("./treasury-I10_jPJ2.js"),__vite__mapDeps([7,1,2,5])),dev:()=>Q(()=>import("./devcards-BLxMpYKE.js"),__vite__mapDeps([8,3]))};K("/",j.lobby);K("/play/:game/:rival",j.table);K("/how-to-play",j.howto);K("/how-to-play/:game",j.howto);K("/treasury",j.treasury);K("/dev/cards",j.dev);gt();if(Ee()){const e=r=>new Promise(a=>(window.requestIdleCallback||setTimeout)(()=>a(r())));Ae([document.fonts?.ready??Promise.resolve(),j.lobby(),j.table(),e(()=>Ft()),e(()=>[12,11,10,9].forEach(ut)),e(()=>Array.from({length:52},(r,a)=>ut(a)))])}Ht();export{Tt as R,mt as S,Q as _,Se as a,Ze as b,we as c,wt as d,Re as e,Pe as f,et as g,_ as h,Xt as i,ue as j,Te as k,pe as l,Fe as m,Ut as n,jt as r,tt as s};
