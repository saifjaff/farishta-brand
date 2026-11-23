const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const {createCanvas}=require('/Users/saifjaffery/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const src=fs.readFileSync('work/farishta-live-engine.js','utf8');const Engine=vm.runInNewContext(src+';FarishtaLiveMotion;');
const e=new Engine(createCanvas(736,440));e.setSize(736,440,1);
for(const mode of ['calm','hello','listening','thinking','celebrate','spin']){
 e.setMode(mode);
 for(let i=0;i<180;i++){e.step(1/60);if(i%10===0)e.render();assert.ok([e.pos.x,e.pos.y,e.yaw,e.pitch,e.roll,e.blink].every(Number.isFinite));}
}
const c=new Engine(createCanvas(736,440));c.setSize(736,440,1);c.setMode('spin');for(let i=0;i<80;i++)c.step(1/60);assert.ok(c.rotate({x:0,y:0,z:1}).z<-.95,'the rear view must turn the face away');
for(let i=0;i<100;i++)c.step(1/60);assert.ok(c.rotate({x:0,y:0,z:1}).z>.9,'spin must return to front');
c.setPointer(1,1);for(let i=0;i<120;i++)c.step(1/60);assert.ok(c.look.x>.99&&c.look.y>.99);
for(const [w,h] of [[320,340],[736,440],[1024,460]]){c.setSize(w,h,1);c.render();assert.equal(c.canvas.width,w);assert.equal(c.canvas.height,h);}
console.log('All six motion states render; full turn occlusion, finite motion, gaze response and narrow/desktop sizes passed.');
