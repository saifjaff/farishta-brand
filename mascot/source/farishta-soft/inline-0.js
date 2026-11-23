
const pet=document.getElementById('companion');
const controls=document.querySelectorAll('[data-state]');
controls.forEach(button=>button.addEventListener('click',()=>pet.play(button.dataset.state)));
pet.addEventListener('farishta-state',event=>{controls.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.state===event.detail.state)));document.getElementById('status').textContent=event.detail.state==='greeting'?'Salaam! Lovely to see you.':'Tap Farishta for a little greeting.';});
const pause=document.getElementById('pause');
function syncPause(){const stopped=pet.hasAttribute('paused');pause.textContent=stopped?'Play motion':'Pause motion';document.querySelectorAll('.card img').forEach(image=>{const next=stopped?'frames/'+image.dataset.animation+'/00.webp':image.dataset.animation+'.gif';if(image.getAttribute('src')!==next)image.src=next;});}
pause.addEventListener('click',()=>{pet.toggleAttribute('paused');syncPause();});
new MutationObserver(syncPause).observe(pet,{attributes:true,attributeFilter:['paused']});syncPause();
document.getElementById('speed').addEventListener('input',event=>{pet.setAttribute('speed',event.target.value);document.getElementById('rate').textContent=event.target.value+'×';});
pet.addEventListener('farishta-error',()=>{document.getElementById('status').textContent='Animation images could not load. Keep the frames folder beside this page.';});

