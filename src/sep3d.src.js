/* Separation Station: realistic 3D belt run (three.js). Built into ../sep3d.js with: npm run build (see src/README.txt) */
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

let REN=null,ENV=null;
export let slow=false;
export function webglOK(){try{const c=document.createElement('canvas');return !!(c.getContext('webgl2')||c.getContext('webgl'));}catch(e){return false;}}

const R=(a,b)=>a+Math.random()*(b-a),clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),TAU=Math.PI*2;
const BW=1.3,ZEND=3.4,FLOOR=-.55,ZLEN=46;
const PK={iron:{n:8,sz:.075,rest:.25},clips:{n:5,sz:.15,rest:.13},sand:{n:12,sz:.05,rest:.7},pebbles:{n:5,sz:.12,rest:.75},copper:{n:4,sz:.14,rest:.11},alum:{n:4,sz:.13,rest:.7},salt:{n:8,sz:.07,rest:.75},sugar:{n:8,sz:.075,rest:.75}};

function canvasTex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;}return t;}
function labelTex(text,bg,fg){return canvasTex(512,128,(g,w,h)=>{g.fillStyle=bg;g.fillRect(0,0,w,h);g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=6;g.strokeRect(5,5,w-10,h-10);g.fillStyle=fg;g.font='800 64px system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,w/2,h/2+3);});}

export function run(o){
  return new Promise((resolve,reject)=>{
   let fxl=null;
   try{
    const {canvas,stage,box,cap,skipB,L,belt,res,S0,names,fail,alive}=o;
    fxl=document.createElement('div');fxl.style.cssText='position:absolute;inset:0;pointer-events:none;overflow:hidden';
    const flashEl=document.createElement('div'),sirenEl=document.createElement('div');
    flashEl.style.cssText='position:absolute;inset:0;opacity:0';sirenEl.style.cssText='position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse at center,rgba(255,40,40,0) 55%,rgba(255,50,50,.55) 100%)';
    fxl.append(flashEl,sirenEl);box.append(fxl);
    stage.hidden=false;
    const rc=box.getBoundingClientRect(),pr=Math.min(window.devicePixelRatio||1,1.5);
    let ren=REN;
    if(!ren){ren=REN=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFShadowMap;ren.toneMapping=THREE.ACESFilmicToneMapping;ren.toneMappingExposure=1.05;}
    ren.setPixelRatio(pr);ren.setSize(rc.width,rc.height,false);
    if(!ENV){const pm=new THREE.PMREMGenerator(ren);ENV=pm.fromScene(new RoomEnvironment(),.04).texture;pm.dispose();}
    const sw=rc.width/1024;

    /* ---------- scene ---------- */
    const scene=new THREE.Scene(),BG=0x0b1020;scene.background=new THREE.Color(BG);scene.fog=new THREE.Fog(BG,15,44);
    scene.environment=ENV;scene.environmentIntensity=.55;
    const cam=new THREE.PerspectiveCamera(46,rc.width/rc.height,.1,80);
    const key=new THREE.DirectionalLight(0xfff0dc,2.4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);
    Object.assign(key.shadow.camera,{left:-4.5,right:4.5,top:4.5,bottom:-4.5,near:1,far:24});key.shadow.bias=-.0006;key.shadow.normalBias=.02;key.shadow.radius=3;
    scene.add(key,key.target,new THREE.HemisphereLight(0x9bb4e6,0x161a26,.7));
    const rim=new THREE.DirectionalLight(0x78a6ff,1.1);rim.position.set(2,4,-22);scene.add(rim);

    const mat={
      steel:new THREE.MeshStandardMaterial({color:0xa4afc2,metalness:.95,roughness:.3}),
      post:new THREE.MeshStandardMaterial({color:0x44506b,metalness:.75,roughness:.42}),
      red:new THREE.MeshStandardMaterial({color:0xd0352b,metalness:.35,roughness:.32}),
      pipe:new THREE.MeshStandardMaterial({color:0x8aa4c4,metalness:.85,roughness:.3}),
      hood:new THREE.MeshStandardMaterial({color:0x3b4254,metalness:.85,roughness:.38}),
      floor:new THREE.MeshStandardMaterial({color:0x161c2b,metalness:.2,roughness:.82}),
      water:new THREE.MeshPhysicalMaterial({color:0x4aa0e6,transparent:true,opacity:.58,roughness:.04,metalness:0,clearcoat:1,clearcoatRoughness:.05}),
      gold:new THREE.MeshStandardMaterial({color:0xf2b72a,metalness:1,roughness:.26}),
    };
    /* floor + belt */
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,80),mat.floor);floor.rotation.x=-Math.PI/2;floor.position.y=FLOOR;floor.receiveShadow=true;scene.add(floor);
    const beltTex=canvasTex(128,256,(g,w,h)=>{g.fillStyle='#242a39';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=64){const gr=g.createLinearGradient(0,y,0,y+64);gr.addColorStop(0,'#2e3547');gr.addColorStop(.9,'#222837');gr.addColorStop(1,'#141824');g.fillStyle=gr;g.fillRect(0,y,w,64);}g.fillStyle='rgba(255,255,255,.04)';for(let i=0;i<500;i++)g.fillRect(Math.random()*w,Math.random()*h,2,1);},true);
    beltTex.repeat.set(1,ZLEN/1.0);
    const beltM=new THREE.MeshStandardMaterial({map:beltTex,roughness:.78,metalness:.05});
    const beltMesh=new THREE.Mesh(new THREE.BoxGeometry(BW*2,.14,ZLEN),beltM);beltMesh.position.set(0,-.07,-(ZEND+ZLEN/2));beltMesh.receiveShadow=true;beltMesh.castShadow=true;scene.add(beltMesh);
    [-1,1].forEach(sd=>{const rail=new THREE.Mesh(new THREE.BoxGeometry(.24,.2,ZLEN),mat.steel);rail.position.set(sd*(BW+.12),.0,-(ZEND+ZLEN/2));rail.castShadow=true;rail.receiveShadow=true;scene.add(rail);
      for(let k=0;k<7;k++){const leg=new THREE.Mesh(new THREE.BoxGeometry(.12,.5,.12),mat.post);leg.position.set(sd*(BW+.12),FLOOR+.25-.0,-(ZEND+.6+k*6));leg.castShadow=true;scene.add(leg);}});
    const housing=new THREE.Mesh(new THREE.BoxGeometry(BW*2+.5,.3,ZLEN),new THREE.MeshStandardMaterial({color:0x1b2132,metalness:.6,roughness:.55}));housing.position.set(0,-.29,-(ZEND+ZLEN/2));scene.add(housing);
    const roller=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,BW*2+.1,24),mat.steel);roller.rotation.z=Math.PI/2;roller.position.set(0,-.07,-(ZEND-.05));roller.castShadow=true;scene.add(roller);

    /* ---------- logic state (same model as the 2D version) ---------- */
    let t00=0,T=0,last=0,done=false,phase='run',spd=0,shake=0,flash=0,fcol='255,255,255',siren=false,lowq=false,fpsA=0,fpsN=0,raf=0,dtS=.016;
    const parts=[],coins=[],puffs=[],lensD=[],Q=[],load={z:18,water:S0.water?1:0,wetT:S0.water?1:0,spilled:false};
    const at=(t,f)=>Q.push({t:T+t,f});
    const mk=(k,st,ii)=>({k,ii,lx:R(-.8,.8)*(.6+.4*Math.random()),lz:R(-.6,.6),x:0,y:0,z:30,sz:PK[k].sz*R(.85,1.2),rot:R(0,TAU),vr:0,mode:'held',dis:st==='dissolved'?1:0,disT:st==='dissolved'?1:0,c:Math.random(),ax:new THREE.Vector3(R(-1,1),R(-1,1),R(-1,1)).normalize(),vx:0,vy:0,vz:0,fr:0});
    const kinds=Object.keys(S0.items),cnt={};
    kinds.forEach(k=>{cnt[k]=0;for(let i=0;i<PK[k].n;i++)parts.push(mk(k,S0.items[k],cnt[k]++));});
    const ms=[];belt.forEach((m,i)=>{if(m)ms.push({m,i,z:0,u:0,e:0,fired:false,crate:null,clog:-9,sw:0});});
    const nS=ms.length;
    ms.forEach((s,j)=>{s.z=5+(nS-1-j)*1.5;
      if(s.m==='magnet'||s.m==='filter'){const side=s.m==='filter'?-1:1;s.crate={x:side*2.4,z:s.z,side,n:0,shake:0,label:s.m==='magnet'?'MAGNET BIN':'FILTER BIN',col:s.m==='magnet'?0xc8473a:0x2e8f9c};}});
    load.z=5+(nS-1)*1.5+3.4;
    const crates=ms.filter(s=>s.crate).map(s=>s.crate);
    cap.textContent='Here comes the mixture!';cap.style.color='';

    /* ---------- 3D objects ---------- */
    const dummy=new THREE.Object3D(),tmpQ=new THREE.Quaternion(),UP=new THREE.Vector3(0,1,0);
    const GEO={sand:new THREE.IcosahedronGeometry(1,1),pebbles:new THREE.DodecahedronGeometry(1,0),iron:new THREE.BoxGeometry(2.2,.45,.6),clips:new THREE.TorusGeometry(.85,.13,8,20),copper:new THREE.CylinderGeometry(1,1,.22,24),alum:new THREE.CylinderGeometry(.7,.7,1.5,16).rotateZ(Math.PI/2),salt:new THREE.BoxGeometry(1.5,1.5,1.5),sugar:new THREE.BoxGeometry(1.5,1.5,1.5)};
    GEO.clips.rotateX(Math.PI/2);GEO.clips.scale(1.5,1,.8);
    const STD=(c,m,r)=>new THREE.MeshStandardMaterial({color:c,metalness:m,roughness:r});
    const KM={sand:STD(0xffffff,0,.95),pebbles:STD(0xffffff,0,.9),iron:STD(0x2e3540,.9,.45),clips:STD(0xd2d9e2,1,.25),copper:STD(0xc9784a,1,.34),alum:STD(0xdde3ea,1,.28),salt:STD(0xf6fbff,0,.35),sugar:STD(0xfff3f8,0,.4)};
    const KS={sand:[1,.7,.9],pebbles:[1,.78,.88]},tans=[0xe2c58a,0xcfa968,0xb98f52],greys=[0x7a726b,0x655f59,0x8b837a];
    const IM={};
    kinds.forEach(k=>{const im=new THREE.InstancedMesh(GEO[k],KM[k],PK[k].n);im.castShadow=true;im.receiveShadow=true;im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(im);IM[k]=im;});
    parts.forEach(p=>{if(p.k==='sand')IM.sand.setColorAt(p.ii,new THREE.Color(tans[(p.c*3)|0]));if(p.k==='pebbles')IM.pebbles.setColorAt(p.ii,new THREE.Color(greys[(p.c*3)|0]));});
    ['sand','pebbles'].forEach(k=>{if(IM[k]&&IM[k].instanceColor)IM[k].instanceColor.needsUpdate=true;});
    /* puddle */
    const puddle=new THREE.Mesh(new THREE.CircleGeometry(1,48).rotateX(-Math.PI/2),mat.water);puddle.position.y=.006;puddle.visible=false;puddle.receiveShadow=true;scene.add(puddle);
    /* coin bed + flying coins */
    const bedN=240,bed=new THREE.InstancedMesh(new THREE.CylinderGeometry(.085,.085,.022,20),mat.gold,bedN);bed.castShadow=true;bed.receiveShadow=true;
    for(let i=0;i<bedN;i++){const a=R(0,TAU),rr=Math.sqrt(Math.random()),x=Math.cos(a)*rr*1.75,zz=3.1+Math.sin(a)*rr*.55,h=(1-rr*rr)*.28;dummy.position.set(x,FLOOR+.05+h,-zz);dummy.rotation.set(R(-.35,.35),R(0,TAU),R(-.35,.35));dummy.scale.setScalar(R(.95,1.1));dummy.updateMatrix();bed.setMatrixAt(i,dummy.matrix);}
    bed.visible=!!res.ok;scene.add(bed);
    const CN=lowq?40:80,fly=new THREE.InstancedMesh(new THREE.CylinderGeometry(.085,.085,.022,20),mat.gold,CN);fly.castShadow=true;fly.instanceMatrix.setUsage(THREE.DynamicDrawUsage);fly.frustumCulled=false;scene.add(fly);
    /* sprites for steam, smoke and drops */
    const softTex=canvasTex(64,64,(g,w,h)=>{const gr=g.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.5,'rgba(255,255,255,.45)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);});
    const SP=[];for(let i=0;i<64;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:softTex,transparent:true,depthWrite:false,opacity:0}));s.visible=false;scene.add(s);SP.push(s);}
    /* crates */
    const crateObjs=new Map();
    crates.forEach(c=>{
      const g=new THREE.Group(),pm=new THREE.MeshStandardMaterial({color:c.col,roughness:.45,metalness:.1,emissive:0x000000});
      const add=(w,h,d,x,y,z,m)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m||pm);b.position.set(x,y,z);b.castShadow=true;b.receiveShadow=true;g.add(b);};
      add(1,.04,.8,0,FLOOR+.02,0);add(1,.4,.04,0,FLOOR+.2,.4);add(1,.4,.04,0,FLOOR+.2,-.4);add(.04,.4,.8,.5,FLOOR+.2,0);add(.04,.4,.8,-.5,FLOOR+.2,0);
      add(.92,.28,.72,0,FLOOR+.17,0,new THREE.MeshStandardMaterial({color:0x2a3042,roughness:.9}));
      const lab=new THREE.Mesh(new THREE.PlaneGeometry(.8,.2),new THREE.MeshStandardMaterial({map:labelTex(c.label,'#10213f','#ffffff'),roughness:.6}));lab.position.set(0,FLOOR+.2,.425);g.add(lab);
      g.position.set(c.x,0,-c.z);scene.add(g);crateObjs.set(c,{g,pm});
    });
    /* machines */
    function buildStation(s){
      const g=new THREE.Group(),mats=[],M=(m)=>{const c=m.clone();c.transparent=true;mats.push(c);return c;};
      const bx=(w,h,d,x,y,z,m)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=true;b.receiveShadow=true;g.add(b);return b;};
      const cy=(r0,r1,h,x,y,z,m,seg=14)=>{const b=new THREE.Mesh(new THREE.CylinderGeometry(r0,r1,h,seg),m);b.position.set(x,y,z);b.castShadow=true;g.add(b);return b;};
      const post=M(mat.post),beam=M(mat.steel),red=M(mat.red),steel=M(mat.steel),pipe=M(mat.pipe);
      bx(.14,2.15,.14,-1.62,(FLOOR+1.6)/2,0,post);bx(.14,2.15,.14,1.62,(FLOOR+1.6)/2,0,post);bx(3.5,.2,.2,0,1.5,0,beam);
      const sg=M(new THREE.MeshStandardMaterial({map:labelTex(names[s.m].toUpperCase(),'#14213d','#ffffff'),emissive:0xffffff,emissiveIntensity:.35,roughness:.5}));sg.emissiveMap=sg.map;
      const sign=new THREE.Mesh(new THREE.BoxGeometry(1.5,.38,.06),sg);sign.position.set(0,1.9,0);sign.castShadow=true;g.add(sign);
      const lampM=new THREE.MeshStandardMaterial({color:0x2e6a42,emissive:0x2eff6a,emissiveIntensity:.2});const lamp=new THREE.Mesh(new THREE.SphereGeometry(.06,12,10),lampM);lamp.position.set(1.4,1.5,.14);g.add(lamp);
      const st={g,mats,lampM,upd:()=>{}};
      if(s.m==='magnet'){
        const mg=new THREE.Group();g.add(mg);
        const arc=new THREE.Mesh(new THREE.TorusGeometry(.42,.085,14,44,Math.PI),red);arc.castShadow=true;mg.add(arc);
        [-1,1].forEach(sd=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(.085,.085,.4,14),red);l.position.set(sd*.42,-.2,0);l.castShadow=true;mg.add(l);const t=new THREE.Mesh(new THREE.CylinderGeometry(.092,.092,.13,14),steel);t.position.set(sd*.42,-.46,0);t.castShadow=true;mg.add(t);});
        const rod=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,1,10),steel);g.add(rod);
        const rings=[0,1,2].map(k=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.2+k*.17,.012,6,32,Math.PI),new THREE.MeshBasicMaterial({color:0x7fc0ff,transparent:true,opacity:0}));r.rotation.z=Math.PI;mg.add(r);return r;});
        st.upd=(e)=>{const y=.78-e*.3;mg.position.y=y;rod.position.y=(1.4+y+.42)/2;rod.scale.y=1.4-(y+.42);rings.forEach((r,k)=>{r.position.y=-.5;r.material.opacity=e>.02?.6*e*(.7+.3*Math.sin(T*14+k)):0;});};
      }else if(s.m==='water'){
        cy(.08,.08,.45,0,1.18,0,pipe);cy(.075,.11,.2,0,.9,0,pipe);
        const st1=cy(.025,.025,.34,.17,1.25,0,pipe);st1.rotation.z=Math.PI/2;
        const wheel=new THREE.Mesh(new THREE.TorusGeometry(.11,.026,8,24),red);wheel.position.set(.34,1.25,0);wheel.castShadow=true;g.add(wheel);
        const stream=new THREE.Mesh(new THREE.CylinderGeometry(.04,.05,.8,12,1,true),new THREE.MeshPhysicalMaterial({color:0x6db8f5,transparent:true,opacity:.7,roughness:.05,side:THREE.DoubleSide,clearcoat:1}));stream.position.y=.4;g.add(stream);
        const rip=new THREE.Mesh(new THREE.RingGeometry(.1,.16,28).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0xbfe3ff,transparent:true,opacity:0}));rip.position.y=.012;g.add(rip);
        st.upd=(e)=>{stream.visible=e>.04;const f=1+.1*Math.sin(T*40);stream.scale.set(f,1,f);stream.material.opacity=.7*Math.min(1,e*2.5);wheel.rotation.z=e*5;rip.material.opacity=e>.04?.5:0;rip.scale.setScalar(1+.5*((T*3)%1));};
      }else if(s.m==='filter'){
        const fm=M(mat.post);[-1,1].forEach(sd=>bx(.07,1.14,.09,sd*.97,.58,0,fm));[0,1].forEach(k=>bx(1.95,.07,.09,0,.04+k*1.08,0,fm));
        const gt=canvasTex(256,144,(c,w,h)=>{c.clearRect(0,0,w,h);c.strokeStyle='rgba(210,238,246,.85)';c.lineWidth=2;for(let x=0;x<=w;x+=16){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}for(let y=0;y<=h;y+=16){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}});
        const gm=new THREE.MeshBasicMaterial({map:gt,transparent:true,opacity:.5,side:THREE.DoubleSide,depthWrite:false});mats.push(gm);const grid=new THREE.Mesh(new THREE.PlaneGeometry(1.92,1.08),gm);grid.position.set(0,.58,0);g.add(grid);
        const wiper=new THREE.Mesh(new THREE.BoxGeometry(.1,.32,.14),new THREE.MeshStandardMaterial({color:0xe0a13a,metalness:.5,roughness:.4}));wiper.position.set(1.05,.17,.12);wiper.castShadow=true;g.add(wiper);
        st.upd=(e,sw,cl,al)=>{wiper.visible=sw>0&&sw<1;wiper.position.x=1.05-sw*2.3;gm.opacity=(.5+(cl>0?.4*cl:0))*al;};
      }else if(s.m==='heat'){
        const hd=new THREE.Mesh(new THREE.BoxGeometry(2.1,.5,1.1),M(mat.hood));hd.position.set(0,1.08,0);hd.castShadow=true;g.add(hd);const plM=new THREE.MeshStandardMaterial({color:0x2a1a14,emissive:0xff6a1a,emissiveIntensity:.1,roughness:.6});mats.push(plM);const pl2=new THREE.Mesh(new THREE.BoxGeometry(1.9,.04,.9),plM);pl2.position.set(0,.82,0);g.add(pl2);
        const pts=[];for(let k=0;k<=14;k++)pts.push(new THREE.Vector3(-.88+k*.126,.8,k%2?.16:-.16));
        const cm=new THREE.MeshStandardMaterial({color:0x5a2a1a,emissive:0xff5a14,emissiveIntensity:.15,roughness:.5});const coil=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),90,.03,8),cm);g.add(coil);
        const pl=new THREE.PointLight(0xff8a3a,0,4.5,2);pl.position.set(0,.55,0);g.add(pl);
        st.upd=(e)=>{cm.emissiveIntensity=.15+2.2*e*(.85+.15*Math.sin(T*22));plM.emissiveIntensity=.1+1.6*e;pl.intensity=8*e;};
      }
      g.position.set(0,0,-s.z);scene.add(g);return st;
    }
    ms.forEach(s=>{s.st=buildStation(s);});

    /* ---------- machines do their thing ---------- */
    const puff=(kind,n,x,y,z,o={})=>{if(lowq)n=Math.ceil(n/2);for(let i=0;i<n;i++)puffs.push({kind,x:x+R(-(o.sx||.1),o.sx||.1),y:y+R(0,o.sy||.1),z:z+R(-(o.sz||.1),o.sz||.1),vx:R(-1,1)*(o.vx||.2),vy:o.vy==null?R(.3,.9):R(o.vy*.6,o.vy*1.3),vz:o.vz==null?R(-.2,.1):R(o.vz*.6,o.vz*1.3),life:0,max:R(.7,1.3)*(o.max||1),r:R(.06,.13)*(o.r||1)});};
    const flyTo=(p,tx,ty,tz,dur,arc,delay,next,follow)=>{p.pend={tx,ty,tz,dur,arc,t0:T+delay,next,follow};};
    function startFly(p){const f=p.pend;p.pend=null;p.mode='fly';p.vr=R(-9,9);p.fl={sx:p.x,sy:p.y,sz:p.z,tx:f.tx,ty:f.ty,tz:f.follow?p.z-spd*f.dur:f.tz,t0:T,dur:f.dur,arc:f.arc,next:f.next};}
    const toBin=(p,s)=>{p.mode='bin';p.crate=s.crate;p.y=-.25+p.sz*.4+R(0,.02);s.crate.n++;};
    function intoCrate(p,s,delay,viaUp){
      const c=s.crate,land=q=>toBin(q,s),go=q=>flyTo(q,c.x+R(-.36,.36),-.2,c.z+R(-.26,.26),.3,.55,0,land);
      if(viaUp)flyTo(p,R(-.18,.18),.78,s.z,.2,.15,delay,go);else flyTo(p,c.side*(BW+.25),.06,0,.2,.04,delay,go,true);
    }
    const splash=(x,z,n)=>{const cap_=lowq?40:80;for(let i=0;i<n&&coins.length<cap_;i++)coins.push({x:x+R(-.25,.25),y:-.22,z:z+R(-.15,.15),vx:R(-2.6,2.6),vy:R(3,7.6),vz:R(-5.4,-.6),rot:R(0,TAU),vr:R(-16,16),ax:new THREE.Vector3(R(-1,1),R(-.3,.3),R(-1,1)).normalize()});};
    function fire(s){
      s.fired=true;const i=s.i,m=s.m,caught=res.bins[i]||[],prev=i>0?res.states[i-1]:S0,now=res.states[i];
      cap.textContent=names[m]+': '+res.notes[i];shake+=.25;
      const held=()=>parts.filter(p=>p.mode==='held'&&!p.pend);
      if(m==='magnet'){held().filter(p=>caught.includes(p.k)).forEach((p,n)=>intoCrate(p,s,n*.02,true));}
      else if(m==='water'){load.wetT=1;held().forEach(p=>{if(now.items[p.k]==='dissolved')p.disT=1;});puff('drop',8,0,1.1,s.z,{sx:.1,vy:-.2,vx:.5,max:.8,r:.5});}
      else if(m==='filter'){
        const dry=res.notes[i].startsWith('No liquid');
        held().filter(p=>caught.includes(p.k)).forEach(p=>intoCrate(p,s,clamp((1-p.x)/2.4)*.3,false));
        if(prev.water)puff('drop',14,0,.3,s.z,{sx:.7,vy:-.4,vz:0,max:.7,r:.4});
        if(dry){s.clog=T;puff('smoke',6,0,.8,s.z,{sx:.5,vy:.7,vz:-.3,max:1.3,r:1.3});shake+=.6;cap.textContent='Filter: No liquid! The dry pile jammed it!';}
      }else if(m==='heat'){
        if(prev.water){load.wetT=0;puff('steam',12,0,.5,s.z,{sx:.7,vy:1.3,vz:-.9,max:1.6,r:1.3});held().forEach(p=>{if(prev.items[p.k]==='dissolved'&&now.items[p.k]==='solid')p.disT=0;});}
        else puff('smoke',6,0,.5,s.z,{sx:.5,vy:.5,max:1,r:.8});
      }
    }
    function ending(){
      if(res.ok){
        cap.textContent='Pure! Every goal substance made it into its own bin!';cap.style.color='#ffe27a';
        let t0=.15;crates.forEach(c=>{at(t0,()=>{let n=0;parts.filter(p=>p.mode==='bin'&&p.crate===c).forEach(p=>{p.crate=null;flyTo(p,R(-.7,.7),-.05,R(2.8,3.3),.5,1.2,n++*.02,q=>{q.mode='fall';q.vx=q.vy=0;q.vz=-.2;});});shake+=.3;});t0+=.4;});
        at(t0+.7,finish);return;
      }
      siren=true;cap.style.color='#ff9d9d';cap.textContent=fail.text;
      if(fail.type==='steam'){at(.1,()=>{puff('steam',22,0,.3,3,{sx:1,sy:.4,vy:.9,vz:-1.6,max:2.2,r:2.2});flash=.15;fcol='255,255,255';});}
      else if(fail.type==='puddle'){at(.1,()=>{for(let i=0;i<24;i++)puffs.push({kind:'drop',x:R(-.9,.9),y:-.2,z:3,vx:R(-1.8,1.8),vy:R(2,5),vz:R(-6,-2.5),life:0,max:2,r:R(.05,.1)});flash=.25;fcol='90,160,230';shake+=.8;
        for(let i=0;i<(lowq?6:12);i++){const d=document.createElement('div'),r=R(10,52)*sw;d.style.cssText=`position:absolute;border-radius:50%;width:${r*2}px;height:${r*2}px;left:${R(40,980)*sw-r}px;top:${R(30,450)*sw-r}px;background:radial-gradient(circle at 35% 30%,rgba(235,247,255,.7),rgba(100,170,235,.3) 60%,rgba(90,160,230,.15));border:1.5px solid rgba(255,255,255,.5)`;fxl.append(d);lensD.push({d,y:parseFloat(d.style.top),vy:R(8,34)*sw,life:0,max:R(2.2,3.4)});}});}
      else if(fail.type==='pile'){at(.1,()=>{puff('smoke',10,0,-.1,2.8,{sx:1,vy:.8,vz:-1.2,max:1.6,r:1.6});shake+=.7;});}
      else{const s=ms.find(x=>x.i===fail.st);
        if(s&&s.crate)at(.15,()=>{s.crate.shake=1;puff('smoke',8,s.crate.x,-.1,s.z,{sx:.3,vy:.9,vz:-.5,max:1.4,r:.9});
          at(.45,()=>{shake+=.9;parts.filter(p=>p.mode==='bin'&&p.crate===s.crate).forEach(p=>{p.mode='fall';p.crate=null;p.vx=-s.crate.side*R(.4,2.4);p.vy=R(3.5,7);p.vz=R(-5,-1.4);p.vr=R(-12,12);p.fr=0;});});});}
      at(1.7,finish);
    }

    /* ---------- update ---------- */
    let beltOff=0;
    function update(dt){
      Q.sort((a,b)=>a.t-b.t);while(Q.length&&Q[0].t<=T){Q.shift().f();}
      if(phase==='run'){
        let target=10.5;ms.forEach(s=>{if(load.z<s.z+.5&&load.z>s.z-.5)target=3;});
        spd+=(target-spd)*(1-Math.exp(-12*dt));load.z-=spd*dt;
        ms.forEach(s=>{s.u=clamp((s.z+.4-load.z)/.8);s.e=s.u>0&&s.u<1?Math.sin(Math.PI*s.u):0;s.sw=clamp((s.u-.25)/.5);if(!s.fired&&s.u>=.3)fire(s);});
        if(load.z<ZEND-.7){phase='end';ending();}
      }else{spd+=(.7-spd)*(1-Math.exp(-3*dt));load.z-=spd*dt;}
      if(spd<.05)spd=.05;beltOff+=spd*dt;
      load.water+=(load.wetT-load.water)*(1-Math.exp(-2.4*dt));
      if(!load.spilled&&load.z<ZEND+.5&&load.water>.3){load.spilled=true;if(res.ok)puff('drop',16,0,0,ZEND,{sx:.8,vy:.5,vz:-1.2,max:1,r:.5});}
      shake*=Math.exp(-5*dt);flash*=Math.exp(-4*dt);crates.forEach(c=>{c.shake*=Math.exp(-1.2*dt);});
      const landY=res.ok?-.2:FLOOR+.03;
      parts.forEach(p=>{
        if(p.mode==='held'){p.x=p.lx;p.z=load.z+p.lz;p.y=p.sz*PK[p.k].rest;p.dis+=(p.disT-p.dis)*(1-Math.exp(-3*dt));
          if(p.pend&&T>=p.pend.t0)startFly(p);
          if(p.z<ZEND){p.mode='fall';if(res.ok){p.vx=R(-.3,.3);p.vy=R(0,.6);p.vz=-spd*.9;p.vr=R(-6,6);}else{p.vx=R(-1.4,1.4);p.vy=R(1.5,3.5);p.vz=-R(1.2,3.4);p.vr=R(-14,14);}}}
        else if(p.mode==='fly'){const q=p.fl,u=(T-q.t0)/q.dur;
          if(u>=1){p.x=q.tx;p.y=q.ty;p.z=q.tz;if(q.next)q.next(p);if(p.mode==='fly'&&p.fl===q)p.mode=p.pend?'wait':'gone';}
          else{p.x=q.sx+(q.tx-q.sx)*u;p.z=q.sz+(q.tz-q.sz)*u;p.y=q.sy+(q.ty-q.sy)*u+Math.sin(Math.PI*u)*q.arc;p.rot+=p.vr*dt;}}
        else if((p.mode==='bin'||p.mode==='wait')&&p.pend&&T>=p.pend.t0)startFly(p);
        else if(p.mode==='fall'){p.vy-=11*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.rot+=p.vr*dt;
          if(p.y<=landY){
            if(res.ok){p.mode='gone';splash(p.x,p.z,3);}
            else if(Math.abs(p.vy)>1.2&&p.fr<3){p.y=landY;p.vy=-p.vy*.5;p.vz*=.8;p.fr++;}
            else{p.y=landY;p.mode='rest';p.vx=p.vy=p.vz=0;}}
          if(p.z<.3||p.y<-4)p.mode='gone';}
      });
      for(let i=parts.length-1;i>=0;i--)if(parts[i].mode==='gone'){IM[parts[i].k].setMatrixAt(parts[i].ii,new THREE.Matrix4().makeScale(0,0,0));IM[parts[i].k].instanceMatrix.needsUpdate=true;parts.splice(i,1);}
      for(let i=coins.length-1;i>=0;i--){const c=coins[i];c.vy-=12*dt;c.x+=c.vx*dt;c.y+=c.vy*dt;c.z+=c.vz*dt;c.rot+=c.vr*dt;
        if(c.z<.9&&!c.hit){c.hit=1;flash=Math.max(flash,.1);fcol='255,230,160';}
        if((c.y<-.25&&c.vy<0)||c.z<.6||Math.abs(c.x)>7)coins.splice(i,1);}
      for(let i=puffs.length-1;i>=0;i--){const p=puffs[i];p.life+=dt;if(p.kind==='drop')p.vy-=8*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;if(p.life>p.max||p.z<.8)puffs.splice(i,1);}
      for(let i=lensD.length-1;i>=0;i--){const d=lensD[i];d.life+=dt;d.y+=d.vy*dt;d.d.style.top=d.y+'px';d.d.style.opacity=clamp((1-d.life/d.max)*1.5);if(d.life>d.max){d.d.remove();lensD.splice(i,1);}}
    }

    /* ---------- sync three.js with the model ---------- */
    const camBase=new THREE.Vector3(0,1.95,.4),lookBase=new THREE.Vector3(0,.15,-7),camT=new THREE.Vector3(),lookT=new THREE.Vector3(),focus=new THREE.Vector3();
    let zkS=0,endK=0;const lookEnd=new THREE.Vector3(0,-.4,-3.1);
    function render(dt){
      /* camera: gentle push-in at each machine */
      const ez=ms.reduce((m,s)=>Math.max(m,s.e),0),zt=ez*ez*(3-2*ez);zkS+=(zt-zkS)*(1-Math.exp(-9*dt));
      focus.set(0,.3,-load.z);camT.set(0,1.55,-(Math.max(load.z,ZEND)-3.9));camT.lerpVectors(camBase,camT,.8*zkS);
      lookT.lerpVectors(lookBase,focus,zkS);endK+=((phase==='end'?1:0)-endK)*(1-Math.exp(-3.5*dt));lookT.lerp(lookEnd,endK);
      cam.position.set(camT.x+Math.sin(T*.6)*.03+shake*.07*Math.sin(T*31),camT.y+Math.sin(T*.5)*.02+shake*.06*Math.sin(T*37+2),camT.z);
      cam.fov=46-9*zkS;cam.updateProjectionMatrix();cam.lookAt(lookT);
      key.position.set(-3.5,8,-load.z+3.5);key.target.position.set(0,0,-load.z);key.target.updateMatrixWorld();
      beltTex.offset.y=beltOff/1.0;
      /* machines */
      let cur=null;ms.forEach(s=>{const d=load.z-s.z;if(d>=-.6&&(!cur||d<load.z-cur.z))cur=s;});
      ms.forEach(s=>{const d=load.z-s.z,al=d>.5?clamp(1-(d-.5)/.9,0,1):1;s.st.mats.forEach(m=>{m.opacity=al*(m.userData.base||1);});
        s.st.lampM.emissiveIntensity=s.e>0?2:.2;s.st.upd(s.e,s.sw,T-s.clog<1.4?1-(T-s.clog)/1.4:0,al);s.st.g.visible=al>.01;});
      /* crates */
      crateObjs.forEach((o,c)=>{o.g.position.x=c.x+(c.shake>.02?Math.sin(T*70)*.05*c.shake:0);o.pm.emissive.setRGB(c.shake>.5?.35*c.shake*(.6+.4*Math.sin(T*18)):0,0,0);});
      /* puddle */
      const w=load.water*clamp((load.z-ZEND+.2)/1.2);puddle.visible=w>.03;if(puddle.visible){const wob=1+.04*Math.sin(T*3);puddle.scale.set(.95*w*wob,1,.72*w*wob);puddle.position.z=-load.z;}
      /* parts */
      kinds.forEach(k=>{IM[k].count=PK[k].n;});
      parts.forEach(p=>{
        const flat=p.mode==='held'||p.mode==='bin'||p.mode==='rest',sc=p.sz*(1-p.dis),ss=KS[p.k]||[1,1,1];
        dummy.position.set(p.x,p.y,-p.z);
        if(flat)dummy.quaternion.setFromAxisAngle(UP,p.rot);else dummy.quaternion.setFromAxisAngle(p.ax,p.rot);
        dummy.scale.set(sc*ss[0],sc*ss[1],sc*ss[2]);dummy.updateMatrix();IM[p.k].setMatrixAt(p.ii,dummy.matrix);
      });
      kinds.forEach(k=>{IM[k].instanceMatrix.needsUpdate=true;});
      /* flying coins */
      for(let i=0;i<CN;i++){const c=coins[i];if(c){dummy.position.set(c.x,c.y,-c.z);dummy.quaternion.setFromAxisAngle(c.ax,c.rot);dummy.scale.setScalar(1.15);}else{dummy.position.set(0,-50,0);dummy.scale.setScalar(0);}dummy.updateMatrix();fly.setMatrixAt(i,dummy.matrix);}
      fly.instanceMatrix.needsUpdate=true;
      /* steam, smoke, drops */
      for(let i=0;i<SP.length;i++){const s=SP[i],p=puffs[i];if(!p){s.visible=false;continue;}
        const k=p.life/p.max;s.visible=true;s.position.set(p.x,p.y,-p.z);
        if(p.kind==='drop'){s.material.color.setHex(0x8cc4f5);s.scale.setScalar(.12+p.r*.6);s.material.opacity=.85*(1-k*.5);}
        else{const smoke=p.kind==='smoke';s.material.color.setHex(smoke?0x454955:0xe9eff8);s.scale.setScalar(p.r*2.6*(1+k*(smoke?1.4:2.2)));s.material.opacity=(1-k)*(smoke?.4:.34);}}
      /* overlays */
      flashEl.style.background=`rgb(${fcol})`;flashEl.style.opacity=clamp(flash,0,.5);
      sirenEl.style.opacity=siren?(.35+.35*(.5+.5*Math.sin(T*6))):0;
      ren.render(scene,cam);
    }

    /* ---------- run it ---------- */
    function disposeAll(){
      scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m.map)m.map.dispose();m.dispose();});}});
      Object.values(IM).forEach(im=>im.dispose());
    }
    function finish(){
      if(done)return;done=true;cancelAnimationFrame(raf);document.removeEventListener('keydown',onKey,true);skipB.onclick=null;
      stage.hidden=true;fxl.remove();disposeAll();resolve();
    }
    function onKey(e){if(e.key===' '||e.key==='Enter'||e.key==='Escape'){e.preventDefault();e.stopPropagation();finish();}}
    function frame(now){
      if(done)return;if(!alive()){finish();return;}
      if(!t00)t00=now;if(now-t00>6500&&!window.__sxForce){finish();return;}const dr=Math.min(.1,(now-(last||now))/1000);last=now;dtS+=(dr-dtS)*.35;const dt=dtS;T+=dt;
      fpsA+=dr;if(fpsN===14&&fpsA/fpsN>.1&&!window.__sxForce){slow=true;finish();return;}if(++fpsN===40){if(fpsA/fpsN>.034&&!lowq){lowq=true;ren.setPixelRatio(1);ren.setSize(rc.width,rc.height,false);key.castShadow=false;}fpsA=0;fpsN=0;}
      update(dt);render(dt);raf=requestAnimationFrame(frame);
    }
    skipB.onclick=finish;document.addEventListener('keydown',onKey,true);
    spd=10.5;try{skipB.focus({preventScroll:true});}catch(e){}
    update(.001);render(.016);ren.compile(scene,cam);
    raf=requestAnimationFrame(frame);
   }catch(err){try{fxl&&fxl.remove();}catch(_){}try{o.stage.hidden=true;}catch(_){}reject(err);}
  });
}
