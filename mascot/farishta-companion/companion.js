/* Farishta companion — no framework or external service required. */
(() => {
  const assetBase = new URL('assets/', document.currentScript.src);
  const states = ['happy', 'greeting', 'thinking', 'celebrating', 'sleepy', 'sad'];
  class FarishtaCompanion extends HTMLElement {
    static get observedAttributes() { return ['state', 'motion']; }
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `<style>
        :host {display:inline-block;width:var(--farishta-size,280px);aspect-ratio:1;}
        button {display:block;position:relative;width:100%;height:100%;padding:0;border:0;background:none;cursor:pointer;border-radius:50%;}
        button:focus-visible {outline:3px solid #2f8f78;outline-offset:4px;}
        .float {width:100%;height:100%;animation:float 4s ease-in-out infinite;}
        .reaction {width:100%;height:100%;}
        img {display:block;width:100%;height:100%;object-fit:contain;pointer-events:none;}
        :host([state="greeting"]) .reaction {animation:hello 1.2s ease-in-out infinite;}
        :host([state="thinking"]) .reaction {animation:think 3s ease-in-out infinite;}
        :host([state="celebrating"]) .reaction {animation:cheer 1.1s ease-in-out infinite;}
        :host([state="sleepy"]) .float {animation-duration:7s;}
        :host([state="sad"]) .float {animation-duration:6s;}
        :host([motion="off"]) *, :host([paused]) * {animation:none!important;}
        @keyframes float {0%,100%{transform:translateY(5px)}50%{transform:translateY(-8px)}}
        @keyframes hello {0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
        @keyframes think {0%,100%{transform:rotate(-3deg)}50%{transform:rotate(2deg)}}
        @keyframes cheer {0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-12px) scale(1.035)}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;}}
      </style><button type="button" aria-label="Say hello to Farishta"><div class="float"><div class="reaction"><img draggable="false"></div></div></button>`;
      this.onVisibility = () => this.toggleAttribute('paused', document.hidden);
      this.shadowRoot.querySelector('button').addEventListener('click', () => {
        this.setState('greeting');
        clearTimeout(this.returnTimer);
        this.returnTimer = setTimeout(() => this.setState('happy'), 3500);
      });
    }
    connectedCallback() {
      states.forEach(state => { const image = new Image(); image.src = new URL(`${state}.webp`, assetBase).href; });
      document.addEventListener('visibilitychange', this.onVisibility);
      this.onVisibility();
      this.render();
    }
    disconnectedCallback() {
      document.removeEventListener('visibilitychange', this.onVisibility);
      clearTimeout(this.returnTimer);
    }
    attributeChangedCallback() { this.render(); }
    setState(state) {
      if (!states.includes(state)) throw new RangeError(`Unknown Farishta state: ${state}`);
      clearTimeout(this.returnTimer);
      this.setAttribute('state', state);
    }
    render() {
      const requested = this.getAttribute('state') || 'happy';
      const state = states.includes(requested) ? requested : 'happy';
      const image = this.shadowRoot.querySelector('img');
      image.src = new URL(`${state}.webp`, assetBase).href;
      image.alt = `Farishta, ${state}`;
      this.dispatchEvent(new CustomEvent('farishta-state', {detail: {state}, bubbles:true, composed:true}));
    }
  }
  if (!customElements.get('farishta-companion')) customElements.define('farishta-companion', FarishtaCompanion);
})();
