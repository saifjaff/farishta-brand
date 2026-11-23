
(() => {
  const root=document.getElementById('farishta-live-motion');
  const stage=root.querySelector('.farishta-stage');
  const canvas=root.querySelector('canvas');
  const caption=root.querySelector('[data-caption]');
  const pause=root.querySelector('[data-pause]');
  const engine=new FarishtaLiveMotion(canvas);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let playing=!reduced.matches,visible=true,last=0,raf=0,captionTimer;
  let saved=window.openai?.widgetState?.modelContent;
  if(saved&&['calm','listening','thinking'].includes(saved.mode))engine.setMode(saved.mode);
  function resize(){const rect=stage.getBoundingClientRect();if(!rect.width||!rect.height)return;engine.setSize(rect.width,rect.height,Math.min(2,devicePixelRatio||1));engine.dark=matchMedia('(prefers-color-scheme:dark)').matches;engine.render();}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);
  function reflect(){root.querySelectorAll('[aria-pressed][data-action]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.action===engine.mode)));pause.textContent=playing?'Pause':'Play';pause.setAttribute('aria-pressed',String(!playing));}
  function persist(){window.openai?.setWidgetState?.({modelContent:{mode:engine.mode},privateContent:{playing}})?.catch(()=>{});}
  function act(action){clearTimeout(captionTimer);if(action===engine.mode&&['listening','thinking'].includes(action))action='calm';engine.setMode(action);caption.textContent=({hello:'Salaam, lovely to see you',listening:'Listening motion',thinking:'A thoughtful moment',celebrate:'A little joy',spin:'A graceful turn',calm:'A little presence'})[action];reflect();persist();if(!playing){engine.step(1/60);engine.render();}if(['hello','spin','celebrate'].includes(action))captionTimer=setTimeout(()=>{caption.textContent=engine.mode==='calm'?'A little presence':engine.mode==='listening'?'Listening motion':'A thoughtful moment';},3000);}
  root.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>act(button.dataset.action)));
  stage.addEventListener('click',()=>act('hello'));
  stage.addEventListener('pointermove',event=>{const r=stage.getBoundingClientRect();engine.setPointer((event.clientX-r.left-r.width*.5)/(r.width*.4),-(event.clientY-r.top-r.height*.5)/(r.height*.4));});
  stage.addEventListener('pointerleave',()=>engine.setPointer(0,0));
  pause.addEventListener('click',()=>{playing=!playing;last=0;reflect();persist();});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;},{threshold:.02});observer.observe(root);
  document.addEventListener('visibilitychange',()=>{last=0;});
  reduced.addEventListener('change',event=>{playing=!event.matches;reflect();last=0;});
  window.addEventListener('openai:set_globals',event=>{const state=event.detail?.globals?.widgetState?.modelContent;if(state&&['calm','listening','thinking'].includes(state.mode)){engine.setMode(state.mode);reflect();}});
  function frame(now){if(!root.isConnected){cancelAnimationFrame(raf);resizeObserver.disconnect();observer.disconnect();clearTimeout(captionTimer);return;}if(playing&&visible&&!document.hidden){engine.step(last?Math.min((now-last)/1000,.04):1/60);engine.render();}last=now;raf=requestAnimationFrame(frame);}
  reflect();resize();raf=requestAnimationFrame(frame);
})();
