
  const root = document.getElementById('farishta-float-preview');
  const stage = root.querySelector('.f-stage');
  const message = root.querySelector('.f-message');
  try {
    const T = await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js');
    const renderer = new T.WebGLRenderer({alpha:true,antialias:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.setClearColor(0x000000,0);
    renderer.toneMapping=T.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.1;
    stage.appendChild(renderer.domElement);
    const scene=new T.Scene();
    const camera=new T.PerspectiveCamera(36,1,.1,60);
    camera.position.set(0,.25,8.6); camera.lookAt(0,.15,0);
    scene.add(new T.HemisphereLight(0xf4fff3,0x58876e,2.7));
    const key=new T.DirectionalLight(0xfff4dc,4.5); key.position.set(-3,5,5);scene.add(key);
    const rim=new T.DirectionalLight(0xb7ffe5,3);rim.position.set(4,2,-3);scene.add(rim);
    const fill=new T.DirectionalLight(0xffffff,2);fill.position.set(2,1,5);scene.add(fill);
    // Procedural studio environment creates real reflections on the model.
    const envCanvas=document.createElement('canvas'); envCanvas.width=512;envCanvas.height=256;
    const ec=envCanvas.getContext('2d');
    const grad=ec.createLinearGradient(0,0,0,256);
    grad.addColorStop(0,'#e8fff0');grad.addColorStop(.5,'#779c8c');grad.addColorStop(1,'#263f36');
    ec.fillStyle=grad;ec.fillRect(0,0,512,256);
    ec.fillStyle='#ffffff';ec.fillRect(70,25,65,100);ec.fillStyle='#fce4ac';ec.fillRect(330,40,40,80);
    const env=new T.CanvasTexture(envCanvas);env.mapping=T.EquirectangularReflectionMapping;
    const pmrem=new T.PMREMGenerator(renderer);const envTarget=pmrem.fromEquirectangular(env);
    scene.environment=envTarget.texture;
    const mint=new T.MeshPhysicalMaterial({color:0x9ae7c1,metalness:.08,roughness:.2,clearcoat:1,clearcoatRoughness:.13,emissive:0x3a8e69,emissiveIntensity:.16});
    const wingMat=new T.MeshPhysicalMaterial({color:0xb6f3d4,metalness:.1,roughness:.22,transparent:true,opacity:.72,side:T.DoubleSide,clearcoat:1});
    const gold=new T.MeshStandardMaterial({color:0xe9bb54,metalness:.78,roughness:.25});
    const dark=new T.MeshStandardMaterial({color:0x123b2c,roughness:.35});
    const blush=new T.MeshStandardMaterial({color:0xf4b3a3,roughness:.9,transparent:true,opacity:.65});
    const veinMat=new T.MeshStandardMaterial({color:0xe5ffdf,roughness:.6});
    const mascot=new T.Group();scene.add(mascot);
    const body=new T.Mesh(new T.SphereGeometry(.94,64,48),mint);mascot.add(body);
    function tube(points,r,mat,parent=mascot,closed=false){
      const curve=new T.CatmullRomCurve3(points,closed);
      const mesh=new T.Mesh(new T.TubeGeometry(curve,64,r,8,closed),mat);parent.add(mesh);return mesh;
    }
    function faceStroke(cx,cy,w,h,up,r){
      const points=[];
      for(let i=0;i<=24;i++){
        const t=Math.PI*i/24;
        const x=cx+w*Math.cos(t), y=cy+(up?1:-1)*h*Math.sin(t);
        const z=Math.sqrt(Math.max(.1,.94*.94-x*x-y*y))+.026;
        points.push(new T.Vector3(x,y,z));
      }
      return tube(points,r,dark);
    }
    faceStroke(-.32,.12,.135,.115,true,.035);
    faceStroke(.32,.12,.135,.115,true,.035);
    faceStroke(0,-.14,.12,.075,false,.026);
    for(const x of [-.48,.48]){
      const cheek=new T.Mesh(new T.SphereGeometry(1,24,16),blush);
      cheek.position.set(x,-.12,.814);cheek.scale.set(.14,.08,.018);cheek.rotation.y=x*.65;mascot.add(cheek);
    }
    const wings=[];
    function makeWing(sign,lower){
      const group=new T.Group();group.position.set(sign*.70,lower?-.28:.12,-.22);mascot.add(group);
      const shape=new T.Shape();shape.moveTo(0,0);
      shape.bezierCurveTo(sign*.18,.48,sign*.68,1.02,sign*.98,1.10);
      shape.bezierCurveTo(sign*1.13,.62,sign*.60,.04,0,0);
      const geo=new T.ExtrudeGeometry(shape,{depth:.065,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3,steps:1,curveSegments:32});
      const mesh=new T.Mesh(geo,wingMat);group.add(mesh);
      const edge=shape.getPoints(70).map(p=>new T.Vector3(p.x,p.y,.05));tube(edge,.018,gold,group,true);
      tube([new T.Vector3(0,0,.09),new T.Vector3(sign*.38,.40,.09),new T.Vector3(sign*.94,1.06,.09)],.011,veinMat,group);
      for(const t of [.37,.65]){
        tube([new T.Vector3(sign*t*.87,t,.09),new T.Vector3(sign*(t*.87+.18),t+.04,.09),new T.Vector3(sign*(t*.87+.28),t+.17,.09)],.007,veinMat,group);
      }
      if(lower){group.scale.setScalar(.58);group.rotation.z=sign*-1.00;}
      wings.push({group,sign,lower});
    }
    for(const sign of [-1,1]){makeWing(sign,false);makeWing(sign,true);}
    const starShape=new T.Shape();starShape.moveTo(0,.26);
    starShape.quadraticCurveTo(.05,.05,.19,0);starShape.quadraticCurveTo(.05,-.05,0,-.26);
    starShape.quadraticCurveTo(-.05,-.05,-.19,0);starShape.quadraticCurveTo(-.05,.05,0,.26);
    const star=new T.Mesh(new T.ExtrudeGeometry(starShape,{depth:.07,bevelEnabled:true,bevelSize:.025,bevelThickness:.02,bevelSegments:4,curveSegments:24}),gold);
    star.position.set(0,1.43,0);mascot.add(star);
    const orbit=new T.Group();mascot.add(orbit);orbit.rotation.set(.22,.1,-.16);
    const ringPts=[];
    for(let i=0;i<100;i++){const a=i*Math.PI*2/100;ringPts.push(new T.Vector3(1.23*Math.cos(a),-.63,.70*Math.sin(a)));}
    tube(ringPts,.016,gold,orbit,true);
    const dots=[];
    for(let i=0;i<9;i++){
      const dot=new T.Mesh(new T.SphereGeometry(.028+(i%3)*.009,12,10),gold);
      const a=i*Math.PI*2/9;dot.position.set(1.34*Math.cos(a),-.60+.18*Math.sin(i*3),.82*Math.sin(a));mascot.add(dot);dots.push(dot);
    }
    const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;
    const sc=shadowCanvas.getContext('2d');const sg=sc.createRadialGradient(64,64,5,64,64,64);
    sg.addColorStop(0,'rgba(25,88,61,.25)');sg.addColorStop(1,'rgba(25,88,61,0)');sc.fillStyle=sg;sc.fillRect(0,0,128,128);
    const shadow=new T.Mesh(new T.PlaneGeometry(2.8,.65),new T.MeshBasicMaterial({map:new T.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));
    shadow.position.set(0,-1.47,-.6);scene.add(shadow);
    let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let targetX=0,targetY=0,time=0,last=performance.now(),reaction=0,reactionAt=-10,mode='idle';
    const pauseButton=root.querySelector('[data-action="pause"]');
    function updatePause(){pauseButton.textContent=paused?'Resume motion':'Pause motion';pauseButton.setAttribute('aria-pressed',String(paused));}
    updatePause();
    function react(kind){
      reactionAt=time;mode=kind;
      message.textContent=kind==='celebrate'?'A little joy for every step we take together.':'Hello! I can help you create your first dhikr room.';
      root.dataset.state=kind;
    }
    root.querySelector('[data-action="hello"]').onclick=()=>react('hello');
    root.querySelector('[data-action="celebrate"]').onclick=()=>react('celebrate');
    pauseButton.onclick=()=>{paused=!paused;updatePause();};
    stage.onpointermove=e=>{const r=stage.getBoundingClientRect();targetY=((e.clientX-r.left)/r.width-.5)*.45;targetX=((e.clientY-r.top)/r.height-.5)*.12;};
    stage.onpointerleave=()=>{targetX=targetY=0;};
    const ray=new T.Raycaster();
    stage.onclick=e=>{const r=stage.getBoundingClientRect();ray.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);if(ray.intersectObjects(mascot.children,true).length)react('hello');};
    const resize=new ResizeObserver(()=>{
      const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;
      camera.position.z=camera.aspect<1.3?10.9:8.6;camera.updateProjectionMatrix();
    });resize.observe(stage);
    renderer.setAnimationLoop(now=>{
      if(!root.isConnected){renderer.setAnimationLoop(null);resize.disconnect();envTarget.dispose();env.dispose();pmrem.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of (Array.isArray(o.material)?o.material:[o.material]))m.dispose();}});renderer.dispose();return;}
      const dt=Math.min((now-last)/1000,.04);last=now;if(!paused)time+=dt;
      const elapsed=time-reactionAt;reaction=elapsed>=0&&elapsed<2?Math.sin(elapsed*Math.PI*3)*Math.exp(-elapsed*1.5):0;
      mascot.position.y=paused?0:Math.sin(time*1.65)*.11+Math.abs(reaction)*.33;
      const scale=1+(paused?0:reaction*.07);mascot.scale.set(1/Math.sqrt(scale),scale,1/Math.sqrt(scale));
      mascot.rotation.y+=(targetY-mascot.rotation.y)*.06;mascot.rotation.x+=(targetX-mascot.rotation.x)*.06;
      mascot.rotation.z=paused?0:Math.sin(time*.85)*.035+(mode==='celebrate'?reaction*.12:0);
      for(const w of wings){w.group.rotation.y=paused?0:Math.sin(time*5.5+(w.lower?.5:0))*.12*w.sign;}
      star.rotation.y=paused?0:Math.sin(time*.8)*.5;
      shadow.scale.setScalar(1-mascot.position.y*.2);
      dots.forEach((d,i)=>{d.scale.setScalar(1+(paused?0:Math.sin(time*2+i)*.18+Math.abs(reaction)));});
      renderer.render(scene,camera);
    });
    root.dataset.ready='true';
  } catch(error){message.textContent='The 3D preview could not load in this browser. The companion render is available below.';root.dataset.error=String(error);}
  