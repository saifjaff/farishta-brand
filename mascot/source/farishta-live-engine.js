class FarishtaLiveMotion {
  constructor(canvas) {
    this.canvas=canvas;this.ctx=canvas.getContext('2d');
    this.time=0;this.mode='calm';this.look={x:0,y:0};this.target={x:0,y:0};
    this.pos={x:0,y:0,vx:0,vy:0};this.attention=0;this.thought=0;
    this.nextBlink=2.15;this.blinkStart=-10;this.blink=1;
    this.helloStart=-10;this.joyStart=-10;this.spinStart=-10;this.spinBase=0;
    this.seed=184;this.background='#f6faf7';this.dark=false;
    this.random=()=>{this.seed=(1664525*this.seed+1013904223)>>>0;return this.seed/4294967296;};
    this.particles=Array.from({length:19},(_,i)=>({phase:this.random()*Math.PI*2,r:1.10+this.random()*.65,y:this.random()*1.4-.55,size:.009+this.random()*.015,speed:.15+this.random()*.27}));
    this.burst=Array.from({length:28},(_,i)=>({a:i/28*Math.PI*2,z:this.random()*1.6-.8,s:.009+this.random()*.016}));
    this.width=720;this.height=440;this.unit=94;this.center={x:360,y:237};
    this.yaw=0;this.pitch=0;this.roll=0;this.joy=0;this.hello=0;this.voice=0;
  }
  setSize(w,h,dpr=1){this.width=w;this.height=h;this.canvas.width=Math.round(w*dpr);this.canvas.height=Math.round(h*dpr);this.dpr=dpr;this.unit=Math.min(w/4.5,h/4.05);this.center={x:w*.5,y:h*.55};}
  setMode(mode){
    if(mode==='hello'){this.helloStart=this.time;return;}
    if(mode==='celebrate'){this.joyStart=this.time;this.mode='calm';return;}
    if(mode==='spin'){if(this.time-this.spinStart<2.65)return;this.spinStart=this.time;this.spinBase=this.yaw;return;}
    this.mode=['calm','listening','thinking'].includes(mode)?mode:'calm';
  }
  setPointer(x,y){this.target.x=Math.max(-1,Math.min(1,x));this.target.y=Math.max(-1,Math.min(1,y));}
  step(dt){
    dt=Math.min(.04,Math.max(0,dt));this.time+=dt;const t=this.time;
    const smooth=1-Math.exp(-dt*5);
    this.look.x+=(this.target.x-this.look.x)*smooth;this.look.y+=(this.target.y-this.look.y)*smooth;
    this.attention+=((this.mode==='listening'?1:0)-this.attention)*smooth;
    this.thought+=((this.mode==='thinking'?1:0)-this.thought)*smooth;
    if(t>this.nextBlink){this.blinkStart=t;this.nextBlink=t+3.1+this.random()*2.7;}
    const b=(t-this.blinkStart)/.19;this.blink=b>=0&&b<=1?Math.max(.045,1-Math.sin(Math.PI*b)):1;
    const hello=(t-this.helloStart)/1.65;this.hello=hello>=0&&hello<1?Math.sin(Math.PI*hello)**2:0;
    const j=t-this.joyStart;this.joy=j>=0&&j<2.8?Math.sin(Math.PI*j/2.8)**1.3:0;
    this.voice=this.attention*(.46+.21*Math.sin(t*5.1)+.13*Math.sin(t*9.7+.6));
    const tx=.045*Math.sin(t*.85)+.12*this.look.x+.16*this.thought*Math.sin(t*1.25);
    const ty=.065*Math.sin(t*1.6)+.023*Math.sin(t*3.07)+.055*this.look.y+.075*this.thought*Math.cos(t*2.5)+this.joy*.13*Math.sin(j*6.4);
    this.pos.vx+=(30*(tx-this.pos.x)-11*this.pos.vx)*dt;this.pos.x+=this.pos.vx*dt;
    this.pos.vy+=(30*(ty-this.pos.y)-11*this.pos.vy)*dt;this.pos.y+=this.pos.vy*dt;
    const spin=(t-this.spinStart)/2.65;
    const ease=spin>0&&spin<1?spin**3*(spin*(spin*6-15)+10):spin>=1?1:0;
    this.yaw=.10*Math.sin(t*.64)+this.look.x*.28+this.thought*.13+Math.PI*2*ease;
    this.pitch=-this.look.y*.15-.065*this.attention-.08*this.hello;
    this.roll=.027*Math.sin(t*.93)-this.pos.vx*.08+this.thought*.08*Math.sin(t*.7)+this.joy*.065*Math.sin(j*5);
  }
  rotate(p){
    let {x,y,z}=p;const cy=Math.cos(this.yaw),sy=Math.sin(this.yaw);[x,z]=[x*cy+z*sy,-x*sy+z*cy];
    const cx=Math.cos(this.pitch),sx=Math.sin(this.pitch);[y,z]=[y*cx-z*sx,y*sx+z*cx];
    const cz=Math.cos(this.roll),sz=Math.sin(this.roll);return{x:x*cz-y*sz,y:x*sz+y*cz,z};
  }
  project(p,rotate=true){
    const v=rotate?this.rotate(p):p;const k=7/(7-v.z);return{x:this.center.x+(v.x+this.pos.x)*this.unit*k,y:this.center.y-(v.y+this.pos.y)*this.unit*k,z:v.z,k};
  }
  curve(a,b,c,d,t){const s=1-t;return{x:s*s*s*a.x+3*s*s*t*b.x+3*s*t*t*c.x+t*t*t*d.x,y:s*s*s*a.y+3*s*s*t*b.y+3*s*t*t*c.y+t*t*t*d.y,z:0};}
  path(points,close=false){const c=this.ctx;c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));if(close)c.closePath();}
  glow(x,y,r,color,alpha=.25,sy=1){const c=this.ctx;c.save();c.translate(x,y);c.scale(1,sy);const g=c.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,`rgba(${color},${alpha})`);g.addColorStop(.33,`rgba(${color},${alpha*.55})`);g.addColorStop(1,`rgba(${color},0)`);c.fillStyle=g;c.fillRect(-r,-r,r*2,r*2);c.restore();}
  wing(side,lower=false){
    const t=this.time,scale=lower?.49:.93;
    const phase=t*(8.6+this.attention*1.7+this.joy*1.7)+(lower?.7:0)+(side<0?.09:0);
    const beat=.31+.66*Math.sin(phase);
    const greeting=side<0&&!lower?this.hello*.38*Math.sin((t-this.helloStart)*10):0;
    const cp=Math.cos(beat),sp=Math.sin(beat);
    const transform=p=>{let x=p.x*scale,y=p.y*scale*(lower?-.78:1);const a=greeting+(lower?-.07:0);[x,y]=[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)];const z=.07*Math.sin(Math.min(1,x/1.3)*Math.PI);return{x:side*(.57+x*cp+z*sp),y:.08+y,z:-.17-x*sp+z*cp};};
    const local=[];const zero={x:0,y:0};
    for(let i=0;i<=32;i++)local.push(this.curve(zero,{x:.10,y:.60},{x:.73,y:1.23},{x:1.34,y:1.30},i/32));
    for(let i=1;i<=32;i++)local.push(this.curve({x:1.34,y:1.30},{x:1.43,y:.56},{x:.67,y:-.17},zero,i/32));
    const world=local.map(transform),points=world.map(p=>this.project(p));
    return{z:-2+world.reduce((s,p)=>s+this.rotate(p).z,0)/world.length*.1,draw:()=>{
      const c=this.ctx,u=this.unit;const root=this.project(transform(zero)),tip=this.project(transform({x:1.34,y:1.30}));
      c.save();const g=c.createLinearGradient(root.x,root.y,tip.x,tip.y);g.addColorStop(0,'rgba(102,213,176,.45)');g.addColorStop(.5,'rgba(179,242,212,.60)');g.addColorStop(1,'rgba(244,255,233,.86)');
      this.path(points,true);c.fillStyle=g;c.shadowColor='rgba(119,219,171,.35)';c.shadowBlur=u*.12;c.fill();c.shadowBlur=0;
      c.strokeStyle='rgba(218,179,90,.68)';c.lineWidth=u*.015;c.lineJoin='round';c.stroke();
      const inner=[];for(let i=0;i<=24;i++){const a=i/24;inner.push(this.project(transform(this.curve(zero,{x:.41,y:.35},{x:1.05,y:.95},{x:1.34,y:1.30},a))));}
      this.path(inner);c.strokeStyle='rgba(255,255,230,.78)';c.lineWidth=u*.008;c.stroke();
      for(const n of [.32,.53,.73]){
        const start={x:.95*n,y:.87*n};
        const ends=[{x:1.05*n-.18,y:1.35*n+.02},{x:1.42*n+.05,y:.65*n-.04}];
        for(const end of ends){const pts=[];for(let i=0;i<=12;i++)pts.push(this.project(transform(this.curve(start,{x:start.x+(end.x-start.x)*.7,y:start.y+.03},{x:end.x,y:end.y-.1},end,i/12))));this.path(pts);c.lineWidth=u*.005;c.strokeStyle='rgba(255,255,228,.35)';c.stroke();}
      }c.restore();
    }};
  }
  sphere(){
    const c=this.ctx,u=this.unit,t=this.time,center=this.project({x:0,y:0,z:0},false);
    const stretch=1+.012*Math.sin(t*1.8)+this.voice*.022+this.joy*.028*Math.sin((t-this.joyStart)*6.4);
    const r=u*.79;
    this.glow(center.x,center.y,r*1.62,'109,225,174',this.dark?.26:.15);
    c.save();c.translate(center.x,center.y);c.rotate(-this.roll*.35);c.scale(1/stretch,stretch);
    const pts=[];for(let i=0;i<=100;i++){const a=i/100*Math.PI*2;const rr=r*(1+.004*Math.sin(a*3+t*.9)+this.voice*.012*Math.sin(a*4-t*2.2));pts.push({x:Math.cos(a)*rr,y:Math.sin(a)*rr});}
    this.path(pts,true);const g=c.createRadialGradient(-r*.34,-r*.42,r*.02,-r*.06,r*.02,r*1.17);
    g.addColorStop(0,'#efffe2');g.addColorStop(.25,'#c9f7d9');g.addColorStop(.54,'#8fdfc3');g.addColorStop(.83,'#55bca5');g.addColorStop(1,'#a4eace');
    c.fillStyle=g;c.shadowColor='rgba(105,231,182,.32)';c.shadowBlur=r*.22;c.fill();c.shadowBlur=0;
    c.clip();
    const inner=c.createRadialGradient(r*.24,r*.45,0,r*.24,r*.45,r*.85);inner.addColorStop(0,'rgba(204,255,180,.55)');inner.addColorStop(.7,'rgba(134,255,200,.12)');inner.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=inner;c.fillRect(-r,-r,r*2,r*2);
    c.strokeStyle='rgba(245,255,239,.73)';c.lineWidth=r*.045;c.beginPath();c.arc(0,0,r*.965,Math.PI*.96,Math.PI*1.72);c.stroke();
    c.save();c.translate(-r*.36,-r*.49);c.rotate(-.46);c.fillStyle='rgba(255,255,250,.82)';c.beginPath();c.ellipse(0,0,r*.185,r*.078,0,0,Math.PI*2);c.fill();c.restore();
    c.fillStyle='rgba(255,255,250,.64)';c.beginPath();c.ellipse(r*.40,-r*.41,r*.048,r*.072,-.4,0,Math.PI*2);c.fill();
    c.restore();
  }
  surface(x,y){return{x,y,z:Math.sqrt(Math.max(.001,.79*.79-x*x-y*y))+.018};}
  surfaceEllipse(x,y,rx,ry,fill,alpha=1){const c=this.ctx,pts=[];for(let i=0;i<=32;i++){const a=i/32*Math.PI*2;pts.push(this.project(this.surface(x+rx*Math.cos(a),y+ry*Math.sin(a))));}c.save();c.globalAlpha*=alpha;this.path(pts,true);c.fillStyle=fill;c.fill();c.restore();}
  face(){
    const c=this.ctx,u=this.unit,n=this.rotate({x:0,y:0,z:1});const visibility=Math.max(0,Math.min(1,(n.z-.10)*5));if(!visibility)return;
    const lookX=this.look.x*.022+this.thought*.026,lookY=this.look.y*.016+this.thought*.045;
    c.save();c.globalAlpha=visibility;
    for(const side of [-1,1]){
      const cheek=this.project(this.surface(side*.34,-.11));this.glow(cheek.x,cheek.y,u*.14,'255,171,143',.5,.62);
      const x=side*.235+lookX,y=.105+lookY;
      const wink=side<0?1-this.hello*.95:1;
      const joyBlend=Math.min(1,this.joy*2);
      c.save();c.globalAlpha=visibility*(1-joyBlend);
      {
        const h=.105*this.blink*wink*(1+this.attention*.09);
        this.surfaceEllipse(x,y,.061,h,'#173f35');
        if(h>.04)this.surfaceEllipse(x-.018,y+h*.35,.018,h*.17,'rgba(255,255,240,.96)');
      }c.restore();
      if(joyBlend>0){c.save();c.globalAlpha=visibility*joyBlend;const pts=[];for(let i=0;i<=16;i++){const q=i/16;pts.push(this.project(this.surface(x+(q-.5)*.15,y+.055*Math.sin(q*Math.PI))));}this.path(pts);c.strokeStyle='#173f35';c.lineWidth=u*.032;c.lineCap='round';c.stroke();c.restore();}
    }
    if(this.joy>.01){this.surfaceEllipse(0,-.116,.104,.11*this.joy,'#264138',this.joy*visibility);this.surfaceEllipse(.01,-.116-.05*this.joy,.056,.021*this.joy,'#e8a3a0',this.joy*visibility);}
    {
      const points=[];const open=.015+this.voice*.025;
      for(let i=0;i<=24;i++){const x=(i/24-.5)*.24;const y=-.105-(.055+open)*(1-(x/.12)**2);points.push(this.project(this.surface(x,y)));}
      this.path(points);c.save();c.globalAlpha=visibility*(1-this.joy);c.lineCap='round';c.lineWidth=u*.026;c.strokeStyle='#204d3d';c.stroke();c.restore();
    }c.restore();
  }
  star(){
    const p=this.project({x:0,y:1.12+.025*Math.sin(this.time*2.05),z:.02});const c=this.ctx,r=this.unit*.16;
    this.glow(p.x,p.y,r*2.2,'244,210,116',this.dark?.46:.21);
    c.save();c.translate(p.x,p.y);c.scale(.78+.22*Math.cos(this.time*.72)**2,1);c.rotate(.035*Math.sin(this.time*.9));
    const g=c.createLinearGradient(-r,-r,r,r);g.addColorStop(0,'#fff5ca');g.addColorStop(.4,'#eec870');g.addColorStop(1,'#b99246');c.fillStyle=g;
    const shape=radius=>{c.beginPath();c.moveTo(0,-radius);c.quadraticCurveTo(radius*.17,-radius*.15,radius,0);c.quadraticCurveTo(radius*.15,radius*.17,0,radius);c.quadraticCurveTo(-radius*.17,radius*.15,-radius,0);c.quadraticCurveTo(-radius*.15,-radius*.17,0,-radius);};
    shape(r);c.fill();c.fillStyle='rgba(255,255,242,.88)';shape(r*.48);c.fill();c.restore();
  }
  dot(p,r,color,opacity=.6){const q=this.project(p);if(opacity<=0)return;this.glow(q.x,q.y,r*this.unit*4,color,opacity*.35);const c=this.ctx;c.save();c.globalAlpha=opacity;c.fillStyle=`rgb(${color})`;c.beginPath();c.arc(q.x,q.y,Math.max(.6,r*this.unit*q.k),0,Math.PI*2);c.fill();c.restore();}
  render(){
    const c=this.ctx,t=this.time,u=this.unit;c.setTransform(this.dpr||1,0,0,this.dpr||1,0,0);c.clearRect(0,0,this.width,this.height);
    this.glow(this.center.x,this.center.y+u*.05,u*2.1,'132,216,177',this.dark?.12:.075,.78);
    this.glow(this.center.x+this.pos.x*u*.22,this.center.y+u*1.02,u*.73,'46,109,81',this.dark?.13:.10,.115);
    const entities=[this.wing(-1),this.wing(1),this.wing(-1,true),this.wing(1,true)];
    entities.push({z:0,draw:()=>{this.sphere();this.face();}});
    // The orbit is split into depth-sorted segments, so it passes around the body.
    for(let i=0;i<100;i++){
      const a=i/100*Math.PI*2+t*.16,b=(i+1)/100*Math.PI*2+t*.16;
      const point=q=>({x:1.04*Math.cos(q),y:-.57+.11*Math.sin(q),z:.85*Math.sin(q)});
      const pa=point(a),pb=point(b),z=(this.rotate(pa).z+this.rotate(pb).z)*.5;
      entities.push({z,draw:()=>{const x=this.project(pa),y=this.project(pb);c.beginPath();c.moveTo(x.x,x.y);c.lineTo(y.x,y.y);c.strokeStyle='rgba(223,188,112,.55)';c.lineWidth=u*.011;c.lineCap='round';c.stroke();}});
    }
    for(const p of this.particles){const a=p.phase+t*p.speed;const q={x:Math.cos(a)*p.r,y:p.y+.06*Math.sin(t*.8+p.phase),z:Math.sin(a)*.9};entities.push({z:this.rotate(q).z,draw:()=>this.dot(q,p.size,'236,207,135',.12+.36*(.5+.5*Math.sin(a*1.3)))});}
    entities.sort((a,b)=>a.z-b.z);for(const entity of entities)entity.draw();this.star();
    const age=t-this.joyStart;
    if(age>=0&&age<2.7){for(const p of this.burst){const r=.75+age*.54;this.dot({x:Math.cos(p.a)*r,y:Math.sin(p.a)*r*.76+age*.12,z:p.z},p.s,'244,211,128',Math.sin(Math.min(1,age/.25)*Math.PI/2)*Math.max(0,1-age/2.7)*.8);}}
  }
}
