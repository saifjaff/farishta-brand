const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const {createCanvas}=require('/Users/saifjaffery/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const source=fs.readFileSync('work/farishta-live-engine.js','utf8');const Engine=vm.runInNewContext(source+';FarishtaLiveMotion;');
const character=createCanvas(736,440),composite=createCanvas(736,440),c=composite.getContext('2d');const e=new Engine(character);e.setSize(736,440,1);
const strip=createCanvas(1472,880);const s=strip.getContext('2d');let previous;let largestDifference=0;let deltaCount=0;
const events=new Map([[90,'hello'],[210,'spin'],[390,'listening'],[510,'thinking'],[630,'celebrate']]);
const snapshots=new Map([[60,[0,0]],[300,[736,0]],[450,[0,440]],[690,[736,440]]]);
for(let i=0;i<780;i++){
 if(events.has(i))e.setMode(events.get(i));e.setPointer(.4*Math.sin(i/100),.2*Math.cos(i/130));e.step(1/60);e.render();
 c.fillStyle='#f6faf7';c.fillRect(0,0,736,440);c.drawImage(character,0,0);
 if(i%3===0){const current=c.getImageData(0,0,736,440).data;if(previous){let diff=0;for(let p=0;p<current.length;p+=16)diff+=Math.abs(current[p]-previous[p])+Math.abs(current[p+1]-previous[p+1])+Math.abs(current[p+2]-previous[p+2]);const mean=diff/(current.length/16*3);largestDifference=Math.max(largestDifference,mean);if(mean>.001)deltaCount++;}previous=current;}
 if(snapshots.has(i)){const [x,y]=snapshots.get(i);s.drawImage(composite,x,y);}
}
assert.ok(deltaCount>230,'The rendered motion must change continuously.');assert.ok(largestDifference<8,'No large frame-to-frame image discontinuity.');
fs.writeFileSync('work/farishta-live-check/motion-contact.png',strip.toBuffer('image/png'));
fs.writeFileSync('work/farishta-live-check/motion-report.json',JSON.stringify({rendered_frames:780,sampled_rate_fps:60,continuous_changes:deltaCount,max_sampled_color_difference:largestDifference,states:['calm','hello','spin','listening','thinking','celebrate'],external_dependencies:false},null,2));
console.log('780 frames rendered through all states; continuous movement and no large sampled image discontinuity. Maximum mean color change:',largestDifference.toFixed(3));
