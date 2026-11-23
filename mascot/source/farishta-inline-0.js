
const companion=document.getElementById('companion');
const messages={happy:'A quiet moment, together.',greeting:'Salaam! Lovely to see you.',thinking:'One moment…',celebrating:'Your family reached its shared goal!',sleepy:'Resting quietly nearby.',sad:'We couldn’t connect. Let’s try again.'};
const descriptions={happy:'Gentle everyday presence',greeting:'A warm welcome',thinking:'A thoughtful pause',celebrating:'A shared milestone',sleepy:'A peaceful moment',sad:'A little reassurance'};
const titles={happy:'Happy',greeting:'Greeting',thinking:'Thinking',celebrating:'Celebrating',sleepy:'Sleepy',sad:'Sad'};
companion.addEventListener('farishta-state',event=>{document.getElementById('speech').textContent=messages[event.detail.state];document.querySelectorAll('[data-state]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.state===event.detail.state)));});
document.querySelectorAll('[data-state]').forEach(button=>button.addEventListener('click',()=>companion.setState(button.dataset.state)));
document.getElementById('goal').addEventListener('click',()=>companion.setState('celebrating'));
document.getElementById('motion').addEventListener('click',event=>{const off=companion.getAttribute('motion')!=='off';companion.setAttribute('motion',off?'off':'on');event.currentTarget.textContent=off?'Resume motion':'Pause motion';event.currentTarget.setAttribute('aria-pressed',String(!off));});
for(const state of Object.keys(titles)){const card=document.createElement('article');card.className='card';card.innerHTML=`<img src="assets/${state}.webp" alt="Farishta feeling ${state}" loading="lazy"><h3>${titles[state]}</h3><p>${descriptions[state]}</p><a href="assets/${state}.png" download="farishta-${state}.png">Download PNG ↓</a>`;document.getElementById('gallery').append(card);}
