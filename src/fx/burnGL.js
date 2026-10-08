// Realistic burning card in WebGL: the card texture is eaten by a noise-shaped burn front
// with a glowing ember rim, a charred, browned band and heat haze; flames lick upward from the
// front, and smoke drifts above. Returns null when WebGL is unavailable (caller falls back).

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `
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
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

/**
 * createBurn({ canvas, image, target }) — `target` is a placeholder element whose box is the card.
 * Returns { start, stop, burnTo(value, ms), flare() } or null if WebGL is not available.
 */
export function createBurn({ canvas, image, target }) {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const u = Object.fromEntries(['uCard', 'uRes', 'uRect', 'uTime', 'uBurn', 'uFlare'].map((n) => [n, gl.getUniformLocation(prog, n)]));
  gl.uniform1i(u.uCard, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const dpr = Math.min(1.75, window.devicePixelRatio || 1);
  let raf = 0;
  let running = false;
  let burn = -0.16;
  let flare = 0;
  let tween = null;
  const t0 = performance.now();

  function resize() {
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function frame(now) {
    if (!running) return;
    if (tween) {
      const k = Math.min(1, (now - tween.start) / tween.ms);
      const ease = 1 - Math.pow(1 - k, 2.2);
      burn = tween.from + (tween.to - tween.from) * ease;
      if (k >= 1) tween = null;
    } else {
      burn += 0.00004 * (now - (frame.last || now)); // a slow creep while waiting
    }
    frame.last = now;
    const r = target.getBoundingClientRect();
    const H = innerHeight;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    gl.uniform4f(u.uRect, r.left * dpr, (H - r.bottom) * dpr, r.right * dpr, (H - r.top) * dpr);
    gl.uniform1f(u.uTime, (now - t0) / 1000);
    gl.uniform1f(u.uBurn, burn);
    gl.uniform1f(u.uFlare, flare);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(frame);
  }

  const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : running && (raf = requestAnimationFrame(frame)));

  return {
    start() {
      resize();
      running = true;
      addEventListener('resize', resize);
      document.addEventListener('visibilitychange', onVis);
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
    burnTo(to, ms) {
      tween = { from: burn, to, ms, start: performance.now() };
    },
    flare() {
      flare = 1;
    },
    get level() {
      return burn;
    },
  };
}

/** Rasterise an SVG string into an <img> ready for texImage2D. */
export function svgImage(svg) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}
