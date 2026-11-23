
const rig=document.getElementById('rig');let reactionTimer;
function react(kind){clearTimeout(reactionTimer);rig.classList.remove('greeting','celebrating');void rig.offsetWidth;rig.classList.add(kind);document.getElementById('status').textContent=kind==='greeting'?'Salaam! Lovely to see you.':'A little happy bounce.';reactionTimer=setTimeout(()=>{rig.classList.remove(kind);document.getElementById('status').textContent='Tap Farishta for a little wave.';},kind==='greeting'?1650:1250);}
document.getElementById('greet').addEventListener('click',()=>react('greeting'));document.querySelector('.tap').addEventListener('click',()=>react('greeting'));document.getElementById('celebrate').addEventListener('click',()=>react('celebrating'));
const pause=document.getElementById('pause');pause.addEventListener('click',()=>{const off=rig.dataset.motion!=='off';rig.dataset.motion=off?'off':'on';pause.textContent=off?'Resume motion':'Pause motion';pause.setAttribute('aria-pressed',String(off));});
document.getElementById('speed').addEventListener('input',event=>{const speed=Number(event.target.value);rig.style.setProperty('--flap-duration',1.2/speed+'s');document.getElementById('rate').textContent=speed+'×';});
const media=matchMedia('(prefers-reduced-motion: reduce)');if(media.matches){rig.dataset.motion='off';pause.textContent='Motion reduced by system setting';pause.disabled=true;}
