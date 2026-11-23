/* Generated artwork played frame by frame. No CSS rotation or pixel filter. */
(() => {
  const sequences = {
    flutter: [170, 140, 140, 140, 170, 140],
    greeting: [220, 180, 200, 360],
    spin: [180, 140, 140, 180, 140, 140]
  };
  function frameAt(durations, elapsed) {
    const total = durations.reduce((a, b) => a + b, 0);
    let position = Math.max(0, elapsed) % total;
    for (let i = 0; i < durations.length; i++) {
      if (position < durations[i]) return i;
      position -= durations[i];
    }
    return 0;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {frameAt, sequences};
    return;
  }
  const base = new URL('frames/', document.currentScript.src);
  class FarishtaSoft extends HTMLElement {
    static get observedAttributes() { return ['state', 'paused', 'speed']; }
    constructor() {
      super();
      this.attachShadow({mode:'open'});
      this.shadowRoot.innerHTML = `<style>
        :host{display:inline-block;width:var(--farishta-size,320px);max-width:100%;aspect-ratio:1}
        button{display:block;width:100%;height:100%;padding:0;background:none;border:0;border-radius:50%;cursor:pointer}
        button:focus-visible{outline:3px solid #2f8f78;outline-offset:4px}
        img{display:block;width:100%;height:100%;object-fit:contain;image-rendering:auto;pointer-events:none}
      </style><button type="button" aria-label="Say hello to Farishta"><img alt="Farishta’s wings gently fluttering" draggable="false"></button>`;
      this.elapsed = 0;
      this.images = {};
      this.ready = false;
      this.frame = -1;
      this.onVisibility = () => { this.lastTime = null; };
      this.tick = timestamp => {
        const state = this.state;
        if (this.lastTime != null && !this.paused && !document.hidden) {
          this.elapsed += Math.min(timestamp - this.lastTime, 100) * this.speed;
        }
        this.lastTime = timestamp;
        const total = sequences[state].reduce((a, b) => a + b, 0);
        if (this.once && this.elapsed >= total) {
          this.once = false;
          this.play('flutter');
        }
        this.showFrame();
        if (this.isConnected) this.raf = requestAnimationFrame(this.tick);
      };
      this.shadowRoot.querySelector('button').addEventListener('click', () => this.play('greeting', {once:true}));
    }
    get state() { return Object.hasOwn(sequences,this.getAttribute('state')) ? this.getAttribute('state') : 'flutter'; }
    get paused() { return this.hasAttribute('paused'); }
    get speed() { const n=Number(this.getAttribute('speed') || 1); return Number.isFinite(n) && n>0 ? Math.min(2,Math.max(.25,n)) : 1; }
    connectedCallback() {
      this.media = matchMedia('(prefers-reduced-motion: reduce)');
      this.onReduced = () => this.toggleAttribute('paused', this.media.matches);
      this.media.addEventListener('change', this.onReduced);
      if (this.media.matches) this.setAttribute('paused','');
      document.addEventListener('visibilitychange', this.onVisibility);
      this.load().then(success => { if (!success || !this.isConnected) return; this.ready=true; this.showFrame(); this.lastTime=null; this.raf=requestAnimationFrame(this.tick); });
    }
    disconnectedCallback() {
      cancelAnimationFrame(this.raf);
      document.removeEventListener('visibilitychange', this.onVisibility);
      this.media?.removeEventListener('change', this.onReduced);
      this.lastTime=null;
    }
    attributeChangedCallback(name) {
      if (name==='state') { this.elapsed=0; this.frame=-1; }
      this.showFrame();
    }
    async load() {
      const tasks=[];
      for(const [state,durations] of Object.entries(sequences)) {
        this.images[state]=[];
        durations.forEach((_,index)=>{
          const image=new Image();
          this.images[state][index]=image;
          tasks.push(new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;}));
          image.src=new URL(`${state}/${String(index).padStart(2,'0')}.webp`,base).href;
        });
      }
      try { await Promise.all(tasks); return true; }
      catch { this.dispatchEvent(new CustomEvent('farishta-error',{detail:'Could not load animation frames',bubbles:true})); return false; }
    }
    showFrame() {
      if (!this.ready) return;
      const state=this.state;
      const index=frameAt(sequences[state],this.elapsed);
      if (this.frame===`${state}:${index}`) return;
      this.frame=`${state}:${index}`;
      const image=this.shadowRoot.querySelector('img');
      image.src=this.images[state][index].src;
      image.alt=state==='spin'?'Farishta turning around':state==='greeting'?'Farishta waving a wing':'Farishta’s wings gently fluttering';
    }
    play(state,{once=false}={}) {
      if (!Object.hasOwn(sequences,state)) throw new RangeError(`Unknown Farishta animation: ${state}`);
      this.once=once;
      this.elapsed=0;
      this.frame=-1;
      this.setAttribute('state',state);
      this.showFrame();
      this.dispatchEvent(new CustomEvent('farishta-state',{detail:{state},bubbles:true}));
    }
  }
  if (!customElements.get('farishta-soft')) customElements.define('farishta-soft',FarishtaSoft);
})();
