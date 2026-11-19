/* ================= PHYSICS 3: FIELD GOLF (MS-PS2-3, PS2-5) =================
   No aiming! Place charges (or magnets) in fixed spots, PREDICT which way the ball will bend,
   then launch. Like charges push apart, unlike charges pull together, and the force is stronger
   when the charges are closer or bigger. Forces act at a distance through fields. */
const FG_K=10.5,FG_W=520,FG_H=280,FG_Y0=140,FG_X0=24,FG_X1=500;
function fgSim(L,set){
  let x=FG_X0,y=FG_Y0,vy=0;const pts=[[x,y]],src=L.slots.map((s,i)=>({x:s[1],y:s[2],q:s[4]!=null?s[4]:(set[i]||0)})).filter(s=>s.q);
  const qb=L.steel?1:1;
  for(let t=0;t<800&&x<FG_X1;t++){let ay=0,hit=false;
    src.forEach(s=>{const dx=x-s.x,dy=y-s.y,r=Math.hypot(dx,dy);if(r<16)hit=true;const q=L.steel?-Math.abs(s.q):s.q*qb;ay+=FG_K*q*dy/Math.pow(Math.max(r,16),3);});
    vy+=ay;x+=1;y+=vy;if(t%4===0)pts.push([x,y]);
    if(hit)return {pts,end:'hit',y};if(y<8||y>FG_H-8)return {pts,end:'wall',y};}
  pts.push([x,y]);const inHole=Math.abs(y-L.hole)<=18;return {pts,end:inHole?'hole':'miss',y};
}
const fgDir=r=>r.y<FG_Y0-8?'up':r.y>FG_Y0+8?'down':'straight';
function fgOpts(L,i){const s=L.slots[i];if(s[4]!=null)return [s[4]];if(L.steel)return [0,'N','S'];return s[3]>1?[0,1,-1,2,-2]:[0,1,-1];}
const fgQ=v=>v==='N'||v==='S'?1:v;
function fgSolve(L){const free=L.slots.map((s,i)=>s[4]==null?i:-1).filter(i=>i>=0),sols=[];
  const go=(k,set)=>{if(k===free.length){const st=set.map(fgQ);if(fgSim(L,st).end==='hole')sols.push(set.slice());return;}for(const o of fgOpts(L,free[k])){set[free[k]]=o;go(k+1,set);}set[free[k]]=0;};
  go(0,L.slots.map(()=>0));return sols;}
const fgName=v=>v==='N'?'N pole':v==='S'?'S pole':v===1?'+':v===-1?'−':v===2?'big +':v===-2?'big −':'empty';
const FGL=(name,story,o)=>Object.assign({name,story},o);
const FG_LEVELS=[
  FGL('Pull It Up','The ball has a POSITIVE (+) charge. The hole is up high.',{hole:60,slots:[['a',260,80,1]],
    intro:'The golf ball has a **positive (+)** charge. You cannot aim it: it always rolls straight from the left. Put a charge in a spot, **predict** which way the ball will bend, then launch.',
    fact:'Opposite charges attract (pull together). A negative charge pulls on a positive ball even without touching it, through its electric field.',
    clue:'The hole is above. You need a force that PULLS the ball up toward the spot. Which charge attracts a + ball?'}),
  FGL('Push It Down','The hole is down low, and the only spot is above the path.',{hole:220,slots:[['a',260,80,1]],
    fact:'Like charges repel (push apart). Two positive charges push away from each other.',
    clue:'The spot is ABOVE the path, but the hole is BELOW. You need to push the ball away from the spot.'}),
  FGL('Two Ways','The hole is up high. There are spots above AND below.',{hole:56,slots:[['a',250,80,1],['b',250,200,1]],
    fact:'There is often more than one way to make the same force. A pull from above and a push from below both move the ball up.',
    clue:'Think pull AND push. Which charge above pulls the ball up? Which charge below pushes it up?'}),
  FGL('Gentle Curve','The hole is just a little above the path.',{hole:104,slots:[['near',260,92,1],['far',260,30,1]],
    fact:'Electric and magnetic forces get weaker with distance. The farther apart two charges are, the weaker the push or pull.',
    clue:'A charge close to the path pulls very hard. Do you need a strong pull or a gentle one here?'}),
  FGL('Big Charge','The hole is high, and the only spot is far from the path.',{hole:44,slots:[['a',230,26,2]],
    fact:'A bigger charge makes a bigger electric force. Doubling the charge doubles the force.',
    clue:'The spot is far away. A small charge will not be strong enough. What about a bigger one?'}),
  FGL('Balance It','A + charge is stuck below the path. The hole is straight ahead.',{hole:140,slots:[['fixed',260,200,1,1],['a',260,80,1]],
    fact:'When two forces on an object are equal and opposite, they balance. The object keeps moving in a straight line.',
    clue:'The stuck + charge pushes the ball UP. What could push it back DOWN with the same strength from the same distance?'}),
  FGL('Steel Ball','Now the ball is plain steel, not charged. You have a magnet.',{hole:62,steel:true,slots:[['a',260,80,1]],
    intro:'A **magnet** pulls on steel. Choose which pole of the magnet faces the path.',
    fact:'Both poles of a magnet attract steel and iron. Only two MAGNETS can repel each other (like poles push apart).',
    clue:'Does a magnet’s S pole push steel away, or pull it in like the N pole?'}),
  FGL('Slalom','The hole is low, but a + charge is stuck just below the path near the start.',{hole:230,slots:[['fixed',120,180,1,1],['a',340,90,1],['b',340,40,1]],
    fact:'Forces add up. The ball’s path depends on every charge acting on it at once, each one stronger when the ball is closer.',
    clue:'The stuck charge pushes the ball up first. Later you need a push back down. Which spot, and which charge?'}),
  FGL('Field Master','Four spots, one far-away hole.',{hole:250,slots:[['a',160,80,2],['b',160,200,2],['c',360,80,2],['d',360,210,2]],
    fact:'Engineers use electric and magnetic fields to steer things without touching them: electrons in old TV tubes, particles in research labs and maglev trains.',
    clue:'You need a strong push DOWN. Pushes from above and pulls from below both help, and closer is stronger.'})
];
const FG_PACKS={0:'Pack 1: Push and pull',3:'Pack 2: Distance and size',6:'Pack 3: Fields and magnets'};
const FG_DIR=[['up','Bends up ↑'],['straight','Goes straight →'],['down','Bends down ↓']];
function fgBoard(G){
  const L=G.L,S=G.st,set=S.set.map(fgQ);let t=`<rect width="${FG_W}" height="${FG_H}" fill="#0f5132"/><rect x="0" y="0" width="${FG_W}" height="8" fill="#3a2a1a"/><rect x="0" y="${FG_H-8}" width="${FG_W}" height="8" fill="#3a2a1a"/>`;
  if(S.field){const src=L.slots.map((s,i)=>({x:s[1],y:s[2],q:s[4]!=null?s[4]:set[i]})).filter(s=>s.q);
    for(let gx=40;gx<FG_W;gx+=40)for(let gy=30;gy<FG_H;gy+=36){let fx=0,fy=0;src.forEach(s=>{const dx=gx-s.x,dy=gy-s.y,r=Math.max(16,Math.hypot(dx,dy)),q=L.steel?-Math.abs(s.q):s.q;fx+=q*dx/r**3;fy+=q*dy/r**3;});
      const m=Math.hypot(fx,fy);if(m<1e-6)continue;const ux=fx/m,uy=fy/m,len=Math.min(14,4+Math.log10(m*1e5+1)*3);
      t+=`<path d="M${gx-ux*len/2} ${gy-uy*len/2}L${gx+ux*len/2} ${gy+uy*len/2}" stroke="#bff0d4" stroke-width="1.6" opacity=".55" marker-end="url(#fga)"/>`;}}
  t+=`<rect x="${FG_X1}" y="${L.hole-20}" width="20" height="40" fill="#0a2a1a"/><circle cx="${FG_X1+6}" cy="${L.hole}" r="14" fill="#06150d"/><path d="M${FG_X1+6} ${L.hole-14}v-26" stroke="#fff" stroke-width="2"/><path d="M${FG_X1+6} ${L.hole-40}l16 6-16 6z" fill="#e2483f"/>`;
  t+=`<path d="M${FG_X0} ${FG_Y0}H${FG_X1}" stroke="#fff" stroke-dasharray="3 8" opacity=".3"/>`;
  if(S.path)t+=`<polyline points="${S.path.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#ffd34d" stroke-width="3" stroke-linecap="round" opacity=".9"/>`;
  L.slots.forEach((s,i)=>{const v=s[4]!=null?s[4]:S.set[i],fixed=s[4]!=null,big=Math.abs(fgQ(v)||0)>1;
    t+=`<g class="fgslot${fixed?' fixed':''}" data-i="${i}" role="button" tabindex="${fixed?-1:0}" aria-label="Spot ${s[0]}: ${fgName(v)}">`;
    if(!v)t+=`<circle cx="${s[1]}" cy="${s[2]}" r="20" fill="none" stroke="#bff0d4" stroke-width="2.5" stroke-dasharray="5 5"/><text x="${s[1]}" y="${s[2]+5}" text-anchor="middle" font-size="13" font-weight="800" fill="#bff0d4">tap</text>`;
    else if(v==='N'||v==='S')t+=`<rect x="${s[1]-26}" y="${s[2]-14}" width="52" height="28" rx="5" fill="${v==='N'?'#e2483f':'#2f6bff'}"/><text x="${s[1]}" y="${s[2]+7}" text-anchor="middle" font-size="18" font-weight="900" fill="#fff">${v}</text>`;
    else{const pos=v>0;t+=`<circle cx="${s[1]}" cy="${s[2]}" r="${big?22:17}" fill="${pos?'#e2483f':'#2f6bff'}" stroke="#fff" stroke-width="${fixed?4:2}" ${fixed?'stroke-dasharray="4 3"':''}/><text x="${s[1]}" y="${s[2]+7}" text-anchor="middle" font-size="${big?24:20}" font-weight="900" fill="#fff">${pos?'+':'−'}</text>`;}
    t+='</g>';});
  const bx=S.ball?S.ball[0]:FG_X0,by=S.ball?S.ball[1]:FG_Y0;
  t+=`<circle cx="${bx}" cy="${by}" r="10" fill="${L.steel?'#c3cad5':'#fff'}" stroke="#333" stroke-width="1.5"/>`+(L.steel?'':`<text x="${bx}" y="${by+5}" text-anchor="middle" font-size="13" font-weight="900" fill="#e2483f">+</text>`);
  if(S.boom)t+=`<text x="${bx}" y="${by-14}" text-anchor="middle" font-size="22">💥</text>`;
  return ngSvg(FG_W,FG_H,`<defs><marker id="fga" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5 0 10z" fill="#bff0d4"/></marker></defs>`+t,'ngsvg fgsvg','The field golf course');
}
ngDef({key:'fields',name:'Field Golf',ic:'magnet',std:'MS-PS2-3 · PS2-5',subj:'phys',cap3:true,
  short:'Steer a charged ball with pushes and pulls you cannot see.',menuDesc:'No aiming allowed! Place charges and magnets so invisible pushes and pulls steer the ball into the hole.',
  intro:'Steer a ball into the hole using only electric and magnetic forces. You cannot aim: the ball always starts straight. Place charges or magnets, predict which way the ball will bend, and launch. In the hole on the first launch, with a correct prediction, earns 3 stars.',
  how:['**Tap a spot** to change what is in it: empty, +, − (or a magnet pole).','**Predict** which way the ball will bend.','Press **Launch**. After a launch you can switch on the **field view**.'],
  levels:FG_LEVELS,packs:FG_PACKS,
  mini:L=>svgEl(`<svg viewBox="0 0 44 26" width="48" height="28" aria-hidden="true"><rect width="44" height="26" rx="4" fill="#0f5132"/><circle cx="40" cy="${L.hole/280*26}" r="3" fill="#06150d" stroke="#fff"/>${L.slots.map(s=>`<circle cx="${s[1]/520*44}" cy="${s[2]/280*26}" r="2.6" fill="${s[4]?'#e2483f':'#bff0d4'}"/>`).join('')}</svg>`),
  start(G){G.st={set:G.L.slots.map(s=>s[4]!=null?s[4]:0),pred:null,path:null,ball:null,running:false,field:false,msg:null,launched:0,boom:false};},
  hud(G){return {label:'Misses',val:G.miss,target:'3 ★ = first launch, right prediction'};},
  render(G,main,side){
    const L=G.L,S=G.st,b=fgBoard(G);
    b.querySelectorAll('.fgslot:not(.fixed)').forEach(el=>{const go=()=>{if(S.running||G.done)return;const i=+el.dataset.i,o=fgOpts(L,i),k=o.indexOf(S.set[i]);S.set[i]=o[(k+1)%o.length];S.path=null;S.ball=null;S.pred=null;S.msg=null;S.boom=false;ngRender();};
      el.addEventListener('click',go);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});});
    ngRC(main,b,h('div',{class:'fgkey'},L.steel?'Magnets: N (red) and S (blue) poles. The ball is plain steel.':'Red + and blue − charges. The ball is + (positive). Dashed outline = stuck in place.'));
    const any=S.set.some((v,i)=>v&&L.slots[i][4]==null);
    ngRC(side,h('div',{class:'osl'},h('span',{class:'stepchip'},'1'),'Set up the spots',h('small',null,'tap a spot to cycle')),
      h('div',{class:'fglist'},...L.slots.map((s,i)=>h('div',{class:'fgrow'},h('b',null,s[4]!=null?'Stuck':'Spot '+(i+1)),' ',fgName(s[4]!=null?s[4]:S.set[i])))),
      h('div',{class:'osl'},h('span',{class:'stepchip'},'2'),'Predict: which way will the ball bend?'),
      ngChoices(FG_DIR,S.pred,v=>{if(S.running||G.done)return;S.pred=v;ngRender();},{cls:'col',locked:S.running||G.done}),
      S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null,
      ngBtn([I('play'),' Launch!'],fgLaunch,'good',{style:'width:100%;font-size:19px',disabled:!S.pred||S.running||G.done||(!any&&!L.slots.some(s=>s[4]!=null))}),
      S.launched||G.hint>=1?h('label',{class:'fgtog'},h('input',{type:'checkbox',checked:S.field?true:false,onchange:e=>{S.field=e.target.checked;ngRender();}}),' Show the field (which way a + charge would be pushed)'):null);
    if(!S.running&&!S.msg)ngSay(!any?'Tap a dashed spot to place a charge.':!S.pred?'Now predict which way the ball will bend.':'Prediction made. Press **Launch**!');
  },
  hints(G){const L=G.L,sol=fgSolve(L)[0];
    return [L.clue,'Like charges push apart. Opposite charges pull together. Closer and bigger charges push or pull harder. Magnets pull steel with either pole.',
      sol?'One setup that works: '+L.slots.map((s,i)=>s[4]!=null?null:`spot ${i+1} = ${fgName(sol[i])}`).filter(Boolean).join(', ')+'.':''];}
});
function fgLaunch(){
  const L=G.L,S=G.st;if(S.running||G.done)return;G.tries++;S.launched++;const r=fgSim(L,S.set.map(fgQ)),dir=fgDir(r),key=G.key,lv=G.i;
  const predOK=S.pred===dir;S.running=true;S.path=[];S.boom=false;let k=0;
  const step=()=>{if(!G||G.key!==key||G.i!==lv||$('s-ng').hidden)return;k+=3;S.path=r.pts.slice(0,k);S.ball=r.pts[Math.min(k,r.pts.length-1)];
    if(k<r.pts.length){ngRender();requestAnimationFrame(()=>setTimeout(step,16));return;}
    S.running=false;if(r.end==='hit'||r.end==='wall')S.boom=true;
    const why=dir==='straight'?'The forces balanced (or were too weak), so the ball went straight.':`The ball bent ${dir}.`;
    if(!predOK)G.miss++;
    if(r.end==='hole'){S.msg=['ok',(predOK?'✓ Great prediction! ':'Your prediction was off: '+why+' ')+'In the hole!'];ngRender();ngSay(predOK?'Hole in one, and you predicted it!':'In the hole! Next time, predict the bend correctly too.','go');G.detail={launches:G.tries,predMiss:G.miss};
      ngWin(ngStars(G.miss,0,2),['In the hole on launch ',h('b',null,G.tries),G.miss?` with ${G.miss} miss${G.miss>1?'es':''}.`:' with every prediction right.']);return;}
    G.miss++;const m=r.end==='hit'?'The ball crashed into a charge. That pull was too strong at that distance.':r.end==='wall'?'The ball hit the wall. The force was too strong. Try a weaker or farther charge.':`Missed the hole. ${why} ${r.y<L.hole?'It ended too high.':'It ended too low.'}`;
    S.msg=['no',(predOK?'Prediction ✓. ':'Prediction ✗: '+why+' ')+m];fx.pop({icon:'magnet',text:'Missed',kind:'oops'});ngRender();ngSay(m,'alert');};
  ngRender();setTimeout(step,150);
}
NGTHUMB.fields=()=>{
  let t=`<rect x="0" y="0" width="320" height="180" fill="#0f5132"/><path d="M20 120Q150 120 200 80T296 40" fill="none" stroke="#ffd34d" stroke-width="4" stroke-dasharray="2 8" stroke-linecap="round"/>`+
    `<circle cx="296" cy="40" r="12" fill="#06150d"/><path d="M302 40v-28" stroke="#fff" stroke-width="2"/><path d="M302 12l16 6-16 6z" fill="#e2483f"/>`+
    `<circle cx="200" cy="40" r="20" fill="#2f6bff" stroke="#fff" stroke-width="3"/><text x="200" y="48" text-anchor="middle" font-size="24" font-weight="900" fill="#fff" font-family="system-ui,Arial">−</text>`+
    `<circle cx="120" cy="156" r="20" fill="#e2483f" stroke="#fff" stroke-width="3"/><text x="120" y="164" text-anchor="middle" font-size="24" font-weight="900" fill="#fff" font-family="system-ui,Arial">+</text>`+
    `<circle cx="24" cy="120" r="11" fill="#fff" stroke="#333" stroke-width="2"/>`+ngStar(60,30,7,'#f6efe0',.8);
  return ngWrap('fields','#0f5132',t);
};
