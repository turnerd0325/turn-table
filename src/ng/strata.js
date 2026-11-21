/* ================= EARTH 2: DEEP TIME (MS-ESS1-4, LS4-1) =================
   "Build the cliff." Event cards sit in a tray. The student drags each card into a timeline
   (oldest at the bottom), then presses Build. The cliff plays that history: sediment rains down
   and settles, faults slide, magma pushes up, forces tilt the rock and erosion wears it away.
   If the order is wrong, the build visibly breaks a law (a layer floating in mid-air, a fault
   cracking rock that isn't there yet, magma punching through a layer it never reached) and stops
   right there with the rule's name. Fossil levels: drag the fossils into time order, watch each
   living thing get buried, then answer "which lived first?".
   Contract kept: 9 levels in the same order, the same event ids and correct orders, stars from
   the number of builds (3 = right on the first build), Pre/Post-Test levels 2, 5, 8 score the
   fraction of events in the right spot. */
const DT_W=600,DT_H=400,DT_DEEP=1400;
const DT_ROCK={sand:['#e3bd73','Sandstone'],shale:['#8b877f','Shale'],lime:['#c9d3db','Limestone'],
  cong:['#b4875a','Conglomerate'],silt:['#c6a485','Siltstone'],coal:['#3c3732','Coal']};
const DT_FOS={tri:['Trilobites','trilobites'],fish:['Fish','fish'],fern:['Ferns','ferns'],dino:['Dinosaurs','dinosaurs'],
  mam:['Mammoths','mammoths'],shell:['Shelled sea animals','shelled sea animals']};
let dtUid=0;
const dtRnd=s=>()=>(s=(s*9301+49297)%233280)/233280;
const dtSh=(c,a)=>Art.shade(c,a);

/* ---------------- rock textures (SVG patterns, one set per <svg>) ---------------- */
function dtPat(u,rock){
  const c=rock==='magma'?'#8e2f22':DT_ROCK[rock][0];let w=48,hh=48,g='';const r=dtRnd({sand:11,shale:23,lime:37,cong:41,silt:53,coal:67,magma:79}[rock]);
  const dots=(n,a,b,lo,hi)=>{for(let i=0;i<n;i++)g+=`<circle cx="${(r()*w).toFixed(1)}" cy="${(r()*hh).toFixed(1)}" r="${(lo+r()*(hi-lo)).toFixed(2)}" fill="${r()>.5?dtSh(c,a):dtSh(c,b)}" opacity="${(.45+r()*.4).toFixed(2)}"/>`;};
  if(rock==='sand'){dots(70,-.32,.38,.5,1.3);g+=`<path d="M0 34Q16 26 32 22T48 18M0 46Q14 40 30 37T48 33" stroke="${dtSh(c,-.3)}" stroke-width="1" fill="none" opacity=".35"/>`;}
  else if(rock==='shale'){w=80;hh=20;for(let y=2;y<20;y+=3+Math.round(r()*2))g+=`<path d="M0 ${y}h80" stroke="${r()>.5?dtSh(c,-.3):dtSh(c,.22)}" stroke-width="${(.7+r()*.8).toFixed(1)}" opacity="${(.4+r()*.4).toFixed(2)}"/>`;dots(14,-.35,.3,.4,.8);}
  else if(rock==='lime'){w=44;hh=24;g+=`<path d="M0 .5h44M0 12.5h44M22 0v12M8 12v12M36 12v12" stroke="${dtSh(c,-.3)}" stroke-width="1.1" fill="none" opacity=".55"/>`;dots(22,-.3,.4,.4,.9);
    g+=`<path d="M12 6a2.5 2.5 0 0 1 5 0M30 18a2 2 0 0 1 4 0" stroke="${dtSh(c,-.45)}" stroke-width=".9" fill="none" opacity=".6"/>`;}
  else if(rock==='cong'){w=56;hh=56;dots(30,-.3,.3,.4,1);const pc=['#ddc8a6','#8f7c6b','#a9653f','#ece3d2','#6f6a64','#c49a6c'];
    for(let i=0;i<10;i++){const x=r()*w,y=r()*hh,rx=3+r()*5,ry=rx*(.6+r()*.3),f=pc[i%pc.length],a=(r()*180).toFixed(0);
      [[0,0],[x>w-9?-w:x<9?w:0,0],[0,y>hh-9?-hh:y<9?hh:0]].forEach(([ox,oy],j)=>{if(j&&!ox&&!oy)return;
        g+=`<g transform="translate(${(x+ox).toFixed(1)} ${(y+oy).toFixed(1)}) rotate(${a})"><ellipse rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${f}" stroke="${dtSh(f,-.4)}" stroke-width=".9"/><ellipse cx="${(-rx*.3).toFixed(1)}" cy="${(-ry*.35).toFixed(1)}" rx="${(rx*.4).toFixed(1)}" ry="${(ry*.3).toFixed(1)}" fill="#fff" opacity=".35"/></g>`;});}}
  else if(rock==='silt'){w=40;hh=24;dots(60,-.28,.3,.3,.75);g+=`<path d="M0 8h40M0 19h40" stroke="${dtSh(c,-.25)}" stroke-width=".8" opacity=".35"/>`;}
  else if(rock==='coal'){w=64;hh=18;for(let y=3;y<18;y+=4)g+=`<path d="M${(r()*20).toFixed(0)} ${y}h${(20+r()*30).toFixed(0)}" stroke="#77706a" stroke-width="${(.6+r()).toFixed(1)}" opacity="${(.35+r()*.35).toFixed(2)}" stroke-linecap="round"/>`;
    g+=`<path d="M44 6l6-2" stroke="#b9b2a9" stroke-width="1.2" opacity=".55" stroke-linecap="round"/>`;}
  else{w=30;hh=30;for(let i=0;i<16;i++){const x=(r()*w).toFixed(1),y=(r()*hh).toFixed(1),s=(1+r()*2.2).toFixed(1),f=['#c95d3c','#4c1a12','#e48b5d','#6d2418'][i%4];
    g+=`<rect x="${x}" y="${y}" width="${s}" height="${(s*.7).toFixed(1)}" fill="${f}" opacity=".75" transform="rotate(${(r()*90).toFixed(0)} ${x} ${y})"/>`;}}
  return `<pattern id="${u}p${rock}" width="${w}" height="${hh}" patternUnits="userSpaceOnUse"><rect width="${w}" height="${hh}" fill="${c}"/>${g}</pattern>`;
}
function dtDefs(u){
  return `<defs>${['sand','shale','lime','cong','silt','coal','magma'].map(k=>dtPat(u,k)).join('')}
<linearGradient id="${u}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5aaee8"/><stop offset=".55" stop-color="#a9d8f5"/><stop offset="1" stop-color="#e3f3fb"/></linearGradient>
<radialGradient id="${u}sun"><stop offset="0" stop-color="#fffbe0"/><stop offset=".3" stop-color="#fff0a0" stop-opacity=".8"/><stop offset="1" stop-color="#fff0a0" stop-opacity="0"/></radialGradient>
<linearGradient id="${u}lit" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient>
<linearGradient id="${u}hot" gradientUnits="userSpaceOnUse" x1="0" y1="${DT_H}" x2="0" y2="70"><stop offset="0" stop-color="#d43a00"/><stop offset=".45" stop-color="#ff7a10"/><stop offset=".85" stop-color="#ffc040"/><stop offset="1" stop-color="#fff0a0"/></linearGradient>
<clipPath id="${u}frame"><rect width="${DT_W}" height="${DT_H}" rx="16"/></clipPath></defs>`;
}

/* ---------------- fossils (in the rock) and living things (on the surface) ---------------- */
function dtOrg(kind,live){
  const P=live?{tri:['#b8743d','#6b3d1c'],shell:['#f1c27d','#8a5524'],fish:['#4a9bdc','#1d4f86'],fern:['#3fae57','#1f6b34'],dino:['#6bbf59','#2f6d2c'],mam:['#8a5a36','#4a2c18']}[kind]:['#f1e4cc','#6a5642'];
  const [f,s]=P;const st=`fill="${f}" stroke="${s}" stroke-width="2" stroke-linejoin="round"`;
  if(kind==='tri')return `<path d="M50 6C64 6 75 14 75 25L71 40 66 27C64 27 63 29 63 31L60 56C58 62 54 65 50 65S42 62 40 56L37 31C37 29 36 27 34 27L29 40 25 25C25 14 36 6 50 6Z" ${st}/><path d="M38 33h24M38.6 38h22.8M39.2 43h21.6M39.8 48h20.4M40.5 53h19M45 27l1.5 32M55 27l-1.5 32" stroke="${s}" stroke-width="1.5" fill="none"/><path d="M44 13q6-4 12 0l-1 12h-10z" fill="${s}" opacity=".18"/>${live?`<ellipse cx="38" cy="18" rx="3.2" ry="2.4" fill="#2a1608"/><ellipse cx="62" cy="18" rx="3.2" ry="2.4" fill="#2a1608"/><path d="M37 36l-9 3M37 44l-9 4M38 52l-8 5M63 36l9 3M63 44l9 4M62 52l8 5" stroke="${s}" stroke-width="1.6" stroke-linecap="round"/>`:'<path d="M34 18q4-3 7 0M59 18q4-3 7 0" stroke="'+s+'" stroke-width="1.5" fill="none"/>'}`;
  if(kind==='shell')return `<path d="M50 62a26 26 0 1 1 25-33c3 12-6 24-19 24-10 0-16-7-16-15 0-7 6-12 12-12 5 0 9 4 9 9" ${st}/><path d="M50 62l-4-9M66 52l-6-7M74 36l-8-2M70 18l-7 5M54 9l-2 8M36 13l4 7M26 30l7 2M28 48l7-4" stroke="${s}" stroke-width="1.6"/>${live?'<path d="M28 58c-6 2-10 6-12 10M32 61c-4 4-6 8-6 12" stroke="#c98b5a" stroke-width="2.4" fill="none" stroke-linecap="round"/>':''}`;
  if(kind==='fish')return live?`<path d="M14 34c10-14 30-18 48-12 8 3 14 8 18 12-4 4-10 9-18 12-18 6-38 2-48-12z" ${st}/><path d="M78 34l16-14v28z" ${st}/><path d="M40 22c4-6 12-8 18-6l-4 8zM44 46l8 8 4-8z" ${st}/><circle cx="26" cy="31" r="3.4" fill="#fff"/><circle cx="26" cy="31" r="1.7" fill="#102a44"/><path d="M34 26c2 4 2 12 0 16" stroke="${s}" stroke-width="1.6" fill="none"/>`
    :`<path d="M14 34c4-8 12-12 20-12 4 4 4 20 0 24-8 0-16-4-20-12z" ${st}/><path d="M34 34h44M78 34l14-12M78 34l14 12M84 28v12" stroke="${s}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M42 34l-3-11M50 34l-2-12M58 34l-2-11M66 34l-2-9M42 34l-3 11M50 34l-2 12M58 34l-2 11M66 34l-2 9" stroke="${s}" stroke-width="1.6" stroke-linecap="round"/><circle cx="23" cy="31" r="3" fill="${s}" opacity=".6"/>`;
  if(kind==='fern'){let t=`<path d="M50 64C48 46 50 26 60 6" stroke="${s}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    for(let i=0;i<7;i++){const y=58-i*8,x=50+i*1.3,l=16-i*1.6;t+=`<path d="M${x} ${y}q-${l*.6} -2 -${l} -${l*.55}q${l*.5} -1 ${l} ${l*.4}z" ${st} stroke-width="1.3"/><path d="M${x} ${y}q${l*.6} -2 ${l} -${l*.55}q-${l*.5} -1 -${l} ${l*.4}z" ${st} stroke-width="1.3"/>`;}return t;}
  if(kind==='dino')return live?`<path d="M18 44c4-12 18-16 32-14 8 1 12-4 16-14 2-6 8-10 14-8 4 2 4 6 0 8-6 2-8 8-10 16-2 10-8 16-20 18l-4 14h-6l1-12-10 1 1 11h-6l-1-12c-6-1-10 0-16 4-6 3-12 2-14 0 6-2 12-4 13-10z" ${st}/><circle cx="83" cy="10" r="1.6" fill="#16330f"/><path d="M30 40c6 4 18 4 26 0" stroke="#a6e08f" stroke-width="2" fill="none" opacity=".7"/>`
    :`<path d="M12 40c2-12 14-20 30-22 14-2 30 2 42 8 6 3 8 8 4 12l-10 2c-4 6-12 10-22 10H28c-8 0-14-4-16-10z" ${st}/><ellipse cx="62" cy="30" rx="7" ry="5.5" fill="${s}" opacity=".55"/><path d="M28 32c4-4 12-6 18-4 0 6-4 10-10 10-4 0-8-2-8-6z" fill="${s}" opacity=".35"/><path d="M30 50l2 5M38 50l2 6M46 50l2 6M54 50l2 5M62 48l2 5M70 46l2 5" stroke="${s}" stroke-width="2" stroke-linecap="round"/>`;
  return live?`<path d="M20 50c-6-16 2-34 22-38 16-3 30 2 36 10 6 2 10 8 10 16 0 6-2 10-6 12-2 6-4 12-6 18h-6l-1-10c-4 1-6 1-10 0l-2 10h-6l-1-10H34l-2 10h-6l-1-11c-3-1-4-3-5-7z" ${st}/><path d="M84 34c8 10 2 22-6 26" stroke="${s}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M80 44c10 4 14 12 8 18" stroke="#f6eedd" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="78" cy="28" r="2" fill="#20120a"/><path d="M30 22c2 6 2 14 0 20M42 16c2 8 2 16 0 24M54 16c2 8 2 16 0 24" stroke="${s}" stroke-width="1.4" fill="none" opacity=".6"/>`
    :`<path d="M18 52C14 30 34 12 62 14c8 1 14 4 20 8-4 2-10 0-18 0-22 0-36 14-38 30z" ${st}/><rect x="56" y="34" width="28" height="18" rx="6" ${st}/><path d="M62 36v14M68 36v14M74 36v14M80 36v14" stroke="${s}" stroke-width="1.6"/>`;
}
const dtOrgG=(kind,x,y,s,live,cls)=>`<g class="${cls||''}" transform="translate(${x} ${y}) scale(${s}) translate(-50 -36)">${dtOrg(kind,live)}</g>`;
const dtOrgSvg=(kind,live,sz)=>`<svg viewBox="0 0 100 72" width="${sz}" height="${sz*.72}" aria-hidden="true">${dtOrg(kind,live)}</svg>`;

/* ---------------- geometry helpers ---------------- */
const dtFaultX=(e,y)=>e.x0+(e.x1-e.x0)*(y-e.top)/(DT_H-e.top);
function dtWavePts(e){const r=dtRnd(e.y*7+3),pts=[];for(let x=-30;x<=630;x+=15){const i=pts.length;pts.push([x,e.y+Math.sin(i*.9)*4+Math.sin(i*2.3)*1.6+(r()-.5)*1.5]);}return pts;}
const dtWaveY=(e,x)=>{const p=dtWavePts(e);for(let i=1;i<p.length;i++)if(x<=p[i][0]){const t=(x-p[i-1][0])/15;return p[i-1][1]+(p[i][1]-p[i-1][1])*t;}return e.y;};
function dtRotP(p,a,px,py){const t=a*Math.PI/180,dx=p.x-px,dy=p.y-py;p.x=px+dx*Math.cos(t)-dy*Math.sin(t);p.y=py+dx*Math.sin(t)+dy*Math.cos(t);}
const dtBot=e=>Math.min(e.y1==null?DT_H:e.y1,DT_H);

/* one layer: deep=true extends it far down (it gets drawn BEHIND older rock, so it fills every
   low spot: the gap above a dropped fault block, the corner left by tilting, an eroded hollow) */
function dtBand(u,e,o){
  o=o||{};const c=DT_ROCK[e.rock][0],y0=e.y0,y1=o.deep?DT_DEEP:dtBot(e);
  let t=`<rect x="-900" y="${y0}" width="2400" height="${y1-y0}" fill="url(#${u}p${e.rock})"/>`+
    `<rect x="-900" y="${y0}" width="2400" height="${Math.min(y1,dtBot(e)+40)-y0}" fill="url(#${u}g${e.id})"/>`+
    `<path d="M-900 ${y0}H1500" stroke="${dtSh(c,-.42)}" stroke-width="2.2" opacity=".75"/><path d="M-900 ${y0+2.2}H1500" stroke="#fff" stroke-width="1" opacity=".18"/>`;
  (e.fos||[]).forEach(([k,x,y,s])=>{t+=dtOrgG(k,x,y,s||.5,false,'dtfos');});
  if(o.bad)t+=`<rect class="dtbadov" x="-900" y="${y0+2}" width="2400" height="${dtBot(e)-y0-4}"/>`;
  const grad=`<linearGradient id="${u}g${e.id}" gradientUnits="userSpaceOnUse" x1="0" y1="${y0}" x2="0" y2="${dtBot(e)}"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>`;
  return `<g class="dtf dtlayer${o.cls?' '+o.cls:''}" data-f="${e.id}"${o.clip?` clip-path="url(#${o.clip})"`:''}>${grad}${t}</g>`;
}
function dtDike(u,e,o){
  o=o||{};const r=dtRnd(e.x*13+7),top=o.extend?60:e.top;let L=[],R=[];
  for(let y=DT_DEEP;y>top+16;y-=y>DT_H?400:26){L.push([e.x+(r()-.5)*7,y]);R.push([e.x+e.w+(r()-.5)*7,y]);}
  const d=`M${L.map(p=>p[0].toFixed(1)+' '+p[1]).join('L')}L${(e.x+4).toFixed(1)} ${top+4}Q${e.x+e.w*.5} ${top-4} ${e.x+e.w-3} ${top+5}L${R.reverse().map(p=>p[0].toFixed(1)+' '+p[1]).join('L')}Z`;
  return `<g class="dtf dtdike${o.cls?' '+o.cls:''}" data-f="${e.id}"${o.clip?` clip-path="url(#${o.clip})"`:''}><path d="${d}" fill="#f0c19a" opacity=".55" transform="translate(-3 0)"/><path d="${d}" fill="#f0c19a" opacity=".55" transform="translate(3 0)"/><path d="${d}" fill="url(#${u}pmagma)" stroke="#3d130c" stroke-width="1.6"/>`+
    `<path class="dthot" d="${d}" fill="url(#${u}hot)" opacity="${o.hot==null?0:o.hot}"/></g>`;
}
function dtFaultLine(e,o){
  o=o||{};const top=o.extend?60:e.top,y2=DT_H+40,m=e.top+(DT_H-e.top)*.52,mx=dtFaultX(e,m),dx=(e.x1-e.x0)/(DT_H-e.top);
  const ln=Math.hypot(dx,1),ux=dx/ln,uy=1/ln,nx=uy,ny=-ux;
  const ar=(side,dir)=>{const cx=mx+nx*side*15,cy=m+ny*side*15,ex=cx+ux*13*dir,ey=cy+uy*13*dir,sx=cx-ux*13*dir,sy=cy-uy*13*dir,hx=ex-ux*7*dir+nx*side*5,hy=ey-uy*7*dir+ny*side*5;
    return `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)}L${ex.toFixed(1)} ${ey.toFixed(1)}L${hx.toFixed(1)} ${hy.toFixed(1)}" stroke="#24150c" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;};
  return `<g class="dtf dtfault${o.cls?' '+o.cls:''}" data-f="${e.id}"><path d="M${dtFaultX(e,top).toFixed(1)} ${top}L${dtFaultX(e,y2).toFixed(1)} ${y2}" stroke="#fff" stroke-opacity=".35" stroke-width="7"/><path class="dtcrack" d="M${dtFaultX(e,top).toFixed(1)} ${top}L${dtFaultX(e,y2).toFixed(1)} ${y2}" stroke="#24150c" stroke-width="3.6" stroke-linecap="round"/>${ar(-1,-1)}${ar(1,1)}</g>`;
}
function dtGhost(u,e){
  if(e.t!=='layer'&&e.t!=='dike')return '';
  if(e.t==='dike')return dtDike(u,e,{cls:'dtghost'});
  const y1=dtBot(e);return `<g class="dtghost" data-f="${e.id}"><rect x="-900" y="${e.y0+2}" width="2400" height="${y1-e.y0-4}"/></g>`;
}

/* ---------------- the cliff renderer ----------------
   Folds the events in order. Each feature wraps the rock built so far: tilt rotates it, a fault
   splits it and slides one side, erosion clips everything above a wavy line, magma is drawn
   through it. New layers go BEHIND older rock. Works for ANY order, which is how a wrong
   timeline gets drawn exactly as wrong as it is. */
function dtScene(L,seq,o){
  o=o||{};const u='dt'+(++dtUid);let c='',clips='',labs=[];const n=seq.length;
  const lab=e=>({id:e.id,x:e.lx==null?64:e.lx,y:e.ly!=null?e.ly:e.y0+(dtBot(e)-e.y0)/2,vis:true});
  seq.forEach((e,k)=>{const last=o.anim&&k===n-1,bad=o.bad===e.id?' dtbadf':'';
    if(o.ghostBefore&&o.ghostBefore.at===k)c+=dtGhost(u,o.ghostBefore.e);
    if(e.t==='layer'){
      if(o.float===e.id){o.floatSvg=dtBand(u,e,{cls:'dtfloat'});return;}
      if(last){clips+=`<clipPath id="${u}rise"><rect id="${u}A" x="-900" y="${DT_H+20}" width="2400" height="${DT_DEEP}"/></clipPath>`;}
      c=dtBand(u,e,{deep:true,clip:last?u+'rise':null,bad:!!bad})+c;if(!last)labs.push(lab(e));
    }else if(e.t==='tilt'){
      c=`<g${last?` id="${u}A"`:''} transform="rotate(${last?0:e.a} ${e.px} ${e.py})">${c}</g>`;
      if(!last)labs.forEach(p=>dtRotP(p,e.a,e.px,e.py));
    }else if(e.t==='ero'){
      const P=dtWavePts(e),wave=P.map(p=>`L${p[0]} ${p[1].toFixed(1)}`).join(''),rev=P.slice().reverse().map(p=>`L${p[0]} ${p[1].toFixed(1)}`).join('');
      clips+=`<clipPath id="${u}eb${k}"><path d="M-900 ${e.y}${wave}L1500 ${e.y}V3000H-900Z"/></clipPath><clipPath id="${u}ea${k}"><path d="M-900 -3000H1500V${e.y}${rev}L-900 ${e.y}Z"/></clipPath>`;
      const line=`<g class="dtf dtero" data-f="${e.id}"><path d="M-900 ${e.y}${wave}L1500 ${e.y}" fill="none" stroke="#f3dcb0" stroke-width="6" opacity=".45"/><path d="M-900 ${e.y}${wave}L1500 ${e.y}" fill="none" stroke="#4b2a14" stroke-width="3.2" stroke-linejoin="round"/></g>`;
      const old=c;c=`<g clip-path="url(#${u}eb${k})">${old}</g>`+(last?`<g id="${u}A" clip-path="url(#${u}ea${k})">${old}</g>`:'')+line;
      labs.forEach(p=>{if(p.y<dtWaveY(e,p.x)+12)p.vis=false;});
    }else if(e.t==='fault'){
      const xa=y=>dtFaultX(e,y).toFixed(1);
      clips+=`<clipPath id="${u}fl${k}"><path d="M-3000 -3000L${xa(-3000)} -3000L${xa(3000)} 3000L-3000 3000Z"/></clipPath><clipPath id="${u}fr${k}"><path d="M${xa(-3000)} -3000L3000 -3000L3000 3000L${xa(3000)} 3000Z"/></clipPath>`;
      c=`<g clip-path="url(#${u}fl${k})">${c}</g><g clip-path="url(#${u}fr${k})"><g${last?` id="${u}A"`:''} transform="translate(0 ${last?0:e.d})">${c}</g></g>`+dtFaultLine(e,{extend:o.extend===e.id,cls:(last?'dtnew':'')+bad});
      if(!last)labs.forEach(p=>{if(p.x>dtFaultX(e,p.y))p.y+=e.d;});
    }else if(e.t==='dike'){
      if(last)clips+=`<clipPath id="${u}rise"><rect id="${u}A" x="-900" y="${DT_H+20}" width="2400" height="${DT_DEEP}"/></clipPath>`;
      c+=dtDike(u,e,{extend:o.extend===e.id,clip:last?u+'rise':null,hot:last?1:0});
    }
  });
  if(o.ghostBefore&&o.ghostBefore.at>=n)c+=dtGhost(u,o.ghostBefore.e);
  if(o.ghostAfter)c+=`<g transform="translate(0 0)">${dtGhost(u,o.ghostAfter)}</g>`;
  if(o.floatSvg)c+=`<ellipse cx="300" cy="${dtBot(L.ev.find(e=>e.id===o.float))+26}" rx="240" ry="7" fill="#0b1430" opacity=".18"/>`+o.floatSvg;
  /* sky, sun, clouds and far hills behind the cliff */
  let t=dtDefs(u)+`<defs>${clips}</defs><g clip-path="url(#${u}frame)"><rect width="${DT_W}" height="${DT_H}" fill="url(#${u}sky)"/><circle cx="520" cy="38" r="70" fill="url(#${u}sun)"/><circle cx="520" cy="38" r="15" fill="#fff8d2"/>`+
    `<g fill="#fff" opacity=".85"><ellipse cx="120" cy="34" rx="34" ry="10"/><ellipse cx="146" cy="28" rx="22" ry="10"/><ellipse cx="360" cy="22" rx="26" ry="7"/><ellipse cx="378" cy="18" rx="15" ry="7"/></g>`+
    `<path d="M0 78L40 60 78 70 130 48 186 66 240 54 300 70 352 50 410 64 470 46 530 62 600 52V90H0Z" fill="#8fb5cf" opacity=".55"/>`+
    `<g class="dtrock">${c}</g>`;const main0=t.length;void main0;
  if(o.grass)t+=`<path d="M0 ${L.top||80}H600" stroke="#4f9a3a" stroke-width="5"/><path d="M0 ${(L.top||80)-2}H600" stroke="#86c96a" stroke-width="2"/>`+
    [30,96,150,236,318,402,470,548].map((x,i)=>`<path d="M${x} ${(L.top||80)-1}l${-3-i%2} -8m${4+i%2} 8l1 -10m2 10l4 -7" stroke="#3f8a2e" stroke-width="2" stroke-linecap="round" fill="none"/>`).join('')+
    `<g transform="translate(560 ${(L.top||80)-36})"><rect x="-2.5" y="20" width="5" height="17" rx="2" fill="#6b4a2b"/><circle cy="14" r="12" fill="#3f9a45"/><circle cx="-7" cy="20" r="8" fill="#378a3c"/><circle cx="7" cy="19" r="8" fill="#4caf50"/><circle cx="-3" cy="9" r="5" fill="#7fd08a" opacity=".5"/></g>`;
  if(o.labels!==false)labs.forEach(p=>{if(!p.vis||p.x<10||p.x>590||p.y<16||p.y>DT_H-12)return;
    t+=`<g class="dtlab" data-f="${p.id}"><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="13" fill="#fff" stroke="#1b2433" stroke-width="2.2" filter="url(#art-drop)"/><text x="${p.x.toFixed(1)}" y="${(p.y+5).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="900" fill="#1b2433">${p.id}</text></g>`;});
  if(o.ghostLab){const g=o.ghostLab,w=g.t.length*8.6+30;t+=`<g class="dtghl"><rect x="${g.x-w/2}" y="${g.y-14}" width="${w}" height="28" rx="14"/><text x="${g.x}" y="${g.y+5}" text-anchor="middle">${ngEsc(g.t)}</text></g>`;}
  t+=`<rect width="${DT_W}" height="${DT_H}" fill="url(#${u}lit)" pointer-events="none"/></g><rect x="1" y="1" width="${DT_W-2}" height="${DT_H-2}" rx="15" fill="none" stroke="#1b2433" stroke-opacity=".18" stroke-width="2"/>`;
  const svg=ngSvg(DT_W,DT_H,t,'ngsvg dtsvg','Cross-section of a rock cliff');svg.dataset.u=u;return svg;
}

/* ---------------- levels ----------------
   Events are listed in the TRUE order (oldest first). Layers: y0..y1 in the flat, undisturbed
   position (no y1 = runs to the bottom). sup = the layer it sits on. cover = features it lies
   across without being broken. Features: cut = what they act on (so it must exist first). */
const dtL=(id,rock,y0,y1,o)=>Object.assign({id,t:'layer',rock,y0,y1},o||{});
const DTL=(name,story,ev,o)=>Object.assign({name,story,ev,events:ev.map(e=>({id:e.id}))},o);
const DT_LEVELS=[
  DTL('Layer Cake','A road cut shows three rock layers.',[dtL('A','sand',290),dtL('B','shale',185,290,{sup:['A']}),dtL('C','lime',80,185,{sup:['B']})],
    {intro:'Each card is an event. Put them in time order, then press **Build the cliff** to watch your history play out.',
     fact:'This rule is called the Law of Superposition: in undisturbed layers, the oldest rock is at the bottom and the youngest is on top.',
     clue:'Sediment piles up like laundry in a basket: the first thing in ends up at the bottom.'}),
  DTL('Fossil Layers','Each layer holds different fossils.',[
      dtL('A','lime',300,null,{fos:[['tri',230,348,.55],['tri',470,362,.42]]}),dtL('B','shale',225,300,{sup:['A'],fos:[['fish',380,262,.55]]}),
      dtL('C','sand',150,225,{sup:['B'],fos:[['dino',250,188,.6]]}),dtL('D','silt',80,150,{sup:['C'],fos:[['mam',340,114,.6]]})],
    {fossil:true,ask:{q:'Which of these lived first?',opts:['C','B','D'],ans:'B'},
     fact:'Fossils in lower layers are older than fossils in higher layers. This is how scientists know trilobites lived long before dinosaurs, and dinosaurs long before mammoths.',
     clue:'The deeper the layer, the older the fossils inside it.'}),
  DTL('Tipped Over','These layers are tilted, not flat.',[dtL('A','sand',290,null,{lx:250,ly:330}),dtL('B','shale',210,290,{sup:['A'],lx:200}),dtL('C','lime',100,210,{sup:['B'],lx:150}),
      {id:'T',t:'tilt',a:-12,px:300,py:250,cut:['A','B','C']}],
    {intro:'Sediment always settles in **flat** layers.',top:0,fact:'Layers are always laid down flat (original horizontality). Tilted or folded layers were moved later by forces inside Earth.',
     clue:'Could the layers have been laid down tilted? Or were they flat first?'}),
  DTL('The Fault','A crack has moved part of the rock.',[dtL('A','sand',300),dtL('B','shale',230,300,{sup:['A']}),dtL('C','lime',150,230,{sup:['B']}),
      {id:'F',t:'fault',x0:330,x1:400,top:150,d:36,cut:['A','B','C']},dtL('D','cong',80,150,{sup:['C'],cover:['F']})],
    {intro:'A **fault** is a crack where rock has moved. Something that cuts across rock must be **younger** than the rock it cuts.',
     fact:'This is the Law of Cross-Cutting Relationships: a fault or an intrusion is younger than the rocks it cuts through.',
     clue:'Which layers does the fault break? Which layer is NOT broken?'}),
  DTL('Magma Rising','A band of red igneous rock cuts upward through the layers.',[dtL('A','sand',320),dtL('B','shale',260,320,{sup:['A']}),dtL('C','lime',200,260,{sup:['B']}),dtL('D','silt',140,200,{sup:['C']}),
      {id:'I',t:'dike',x:270,w:38,top:140,cut:['A','B','C','D']},dtL('E','sand',80,140,{sup:['D'],cover:['I']})],
    {intro:'The red band is an **intrusion**: magma that squeezed up through cracks and cooled.',
     fact:'Magma that pushes into older rock and cools is called an intrusion. Like a fault, it is younger than every layer it cuts.',
     clue:'Look at the top of the red band. Which layer does it stop under?'}),
  DTL('Fault vs Magma','Both a fault and an intrusion. Which came first?',[dtL('A','sand',310),dtL('B','shale',240,310,{sup:['A']}),dtL('C','lime',160,240,{sup:['B']}),
      {id:'I',t:'dike',x:300,w:36,top:160,cut:['A','B','C']},{id:'F',t:'fault',x0:282,x1:366,top:160,d:34,cut:['A','B','C','I']},dtL('D','silt',80,160,{sup:['C'],cover:['I','F']})],
    {fact:'If one cross-cutting feature cuts another, the one doing the cutting is younger. Geologists use this to untangle complicated histories.',
     clue:'The fault moved the bottom of the red band. Could it move something that was not there yet?'}),
  DTL('Missing Time','A wavy line separates tilted layers from flat ones.',[dtL('A','sand',270,null,{lx:420,ly:300}),dtL('B','shale',200,270,{sup:['A'],lx:330,ly:236}),dtL('C','lime',60,200,{sup:['B'],lx:150,ly:178}),
      {id:'T',t:'tilt',a:-15,px:300,py:260,cut:['A','B','C']},{id:'R',t:'ero',y:170,cut:['T']},dtL('D','cong',120,170,{cover:['R'],ly:145}),dtL('E','silt',80,120,{sup:['D']})],
    {intro:'The wavy line is an **erosion surface**: a time when rock was worn away instead of laid down.',
     fact:'An erosion surface between rock layers is called an unconformity. It marks missing time: rock that was worn away and is gone.',
     clue:'Tilted layers first, then tilting, then erosion, then new flat layers on top.'}),
  DTL('Fossil Timeline','A tall cliff holds a long fossil record.',[
      dtL('A','lime',320,null,{fos:[['shell',200,362,.5],['shell',440,352,.4]]}),dtL('B','shale',260,320,{sup:['A'],fos:[['fish',330,290,.5]]}),
      dtL('C','coal',200,260,{sup:['B'],fos:[['fern',230,232,.55],['fern',470,234,.45]]}),dtL('D','sand',140,200,{sup:['C'],fos:[['dino',380,172,.56]]}),
      dtL('E','silt',80,140,{sup:['D'],fos:[['mam',220,110,.55]]})],
    {fossil:true,ask:{q:'Which of these lived first?',opts:['C','D','B'],ans:'B'},
     fact:'The fossil record shows that life on Earth has changed over time. Older layers hold simpler life forms; younger layers hold life more like today’s.',
     clue:'Use superposition on the fossils: lower layer, older life.'}),
  DTL('Canyon Challenge','A canyon wall with a long, tricky history.',[dtL('A','sand',290,null,{lx:540,ly:300}),dtL('B','shale',120,290,{sup:['A'],lx:130,ly:250}),
      {id:'T',t:'tilt',a:-14,px:300,py:320,cut:['A','B']},{id:'R',t:'ero',y:230,cut:['T']},dtL('C','cong',175,230,{cover:['R'],ly:203}),dtL('D','silt',125,175,{sup:['C']}),
      {id:'I',t:'dike',x:440,w:30,top:125,cut:['A','B','C','D']},dtL('E','lime',80,125,{sup:['D'],cover:['I']})],
    {fact:'The Grand Canyon shows almost 2 billion years of Earth’s history, including tilted layers, erosion surfaces and intrusions, all read with these same rules.',
     clue:'Work from the bottom up. Each feature that cuts or wears away rock is younger than the rock it affects.'})
];
const DT_PACKS={0:'Pack 1: Superposition',3:'Pack 2: Cross-cutting',6:'Pack 3: Missing time'};

/* ---------------- cards ---------------- */
const dtEv=(L,id)=>L.ev.find(e=>e.id===id);
const dtFosOf=e=>e.fos&&e.fos[0]&&e.fos[0][0];
function dtCardTxt(L,e){
  if(L.fossil){const f=DT_FOS[dtFosOf(e)];return [f[0],'live, die and get buried'];}
  if(e.t==='layer')return [`Layer ${e.id}`,`${DT_ROCK[e.rock][1].toLowerCase()} is laid down`];
  return {fault:['Fault','cracks and slides the rock'],dike:['Magma','pushes up and cools'],tilt:['Tilting','forces tip the layers'],ero:['Erosion','wears the rock flat']}[e.t];
}
function dtIcon(L,e){
  if(L.fossil)return svgEl(`<svg viewBox="0 0 44 44" width="40" height="40" aria-hidden="true"><rect x="1" y="1" width="42" height="42" rx="10" fill="${DT_ROCK[e.rock][0]}"/><rect x="1" y="1" width="42" height="42" rx="10" fill="#000" opacity=".08"/><g transform="translate(22 22) scale(.36) translate(-50 -36)">${dtOrg(dtFosOf(e),false)}</g></svg>`);
  const u='di'+(++dtUid);let b;
  if(e.t==='layer')b=`<defs>${dtPat(u,e.rock)}</defs><rect x="1" y="1" width="42" height="42" rx="10" fill="url(#${u}p${e.rock})"/><path d="M1 12h42" stroke="#000" stroke-opacity=".25"/><text x="22" y="32" text-anchor="middle" font-size="17" font-weight="900" fill="#fff" stroke="#1b2433" stroke-width="3" paint-order="stroke">${e.id}</text>`;
  else if(e.t==='fault')b=`<rect x="1" y="1" width="42" height="42" rx="10" fill="#d9c7a5"/><path d="M1 16h18l4 0M24 22h19M1 28h16M25 34h18" stroke="#8b6f4e" stroke-width="2"/><path d="M18 4l10 36" stroke="#24150c" stroke-width="3" stroke-linecap="round"/><path d="M33 10v8l-3-3m3 3 3-3M11 30v-8l-3 3m3-3 3 3" stroke="#24150c" stroke-width="1.8" fill="none"/>`;
  else if(e.t==='dike')b=`<rect x="1" y="1" width="42" height="42" rx="10" fill="#d9c7a5"/><path d="M1 14h42M1 26h42" stroke="#8b6f4e" stroke-width="2"/><path d="M17 43l2-30q3-6 6 0l2 30z" fill="#b8402a" stroke="#4c1a12" stroke-width="1.5"/><path d="M20 15q2-4 4 0" stroke="#ffd36a" stroke-width="2.4" fill="none"/>`;
  else if(e.t==='tilt')b=`<rect x="1" y="1" width="42" height="42" rx="10" fill="#cfe6f6"/><g transform="rotate(-18 22 26)"><rect x="4" y="16" width="36" height="8" fill="#c9d3db"/><rect x="4" y="24" width="36" height="8" fill="#8b877f"/><rect x="4" y="32" width="36" height="10" fill="#e3bd73"/></g><path d="M8 10a14 14 0 0 1 18-4" stroke="#1b2433" stroke-width="2" fill="none"/><path d="M26 6l-5-2m5 2-2 4" stroke="#1b2433" stroke-width="2" fill="none"/>`;
  else b=`<rect x="1" y="1" width="42" height="42" rx="10" fill="#cfe6f6"/><path d="M1 26l7-3 7 4 7-4 7 4 7-3 7 2V43H1z" fill="#b4875a"/><path d="M1 26l7-3 7 4 7-4 7 4 7-3 7 2" stroke="#4b2a14" stroke-width="2.2" fill="none"/><path d="M8 12h18M14 18h16" stroke="#6b7a99" stroke-width="2.2" stroke-linecap="round"/><circle cx="32" cy="12" r="1.6" fill="#b4875a"/><circle cx="36" cy="16" r="1.3" fill="#b4875a"/>`;
  return svgEl(`<svg viewBox="0 0 44 44" width="40" height="40" aria-hidden="true">${b}</svg>`);
}
function dtCard(L,id,S){
  const e=dtEv(L,id),[a,b]=dtCardTxt(L,e);
  return h('div',{class:'dtcard'+(S.bad===id?' bad':S.bad2===id?' warn':'')+(L.fossil?' fos':''),'data-id':id,'aria-label':`${a}, ${b}`,
      onmouseenter:()=>dtHi(id),onmouseleave:()=>dtHi(null),onfocus:()=>dtHi(id),onblur:()=>dtHi(null)},
    dtIcon(L,e),h('span',{class:'dtct'},h('b',null,a),h('small',null,b)));
}
function dtHi(id){
  const S=G&&G.key==='strata'&&G.st;if(!S||S.phase!=='plan')return;const svg=$('ngMain').querySelector('.dtsvg');if(!svg)return;
  const e=id&&dtEv(G.L,id),ids=!e?[]:e.t==='tilt'?e.cut:[id];
  svg.querySelectorAll('.dtf,.dtlab').forEach(x=>x.classList.toggle('hl',ids.includes(x.dataset.f)));
}

/* ---------------- the timeline (drag cards in; oldest at the bottom) ---------------- */
let DT_DRAG=null;
function dtDragInit(){
  if(DT_DRAG)return;
  const ok=()=>!!(G&&G.key==='strata'&&G.st&&G.st.phase==='plan'&&!G.done);
  DT_DRAG=Art.drag({root:$('s-ng'),items:'.dtcard',targets:'.dtslot,.dttray',accept:ok,
    onDrop:(it,t)=>{if(!ok())return;const k=t.classList.contains('dtslot')?+t.dataset.k:-1;dtPlace(it.dataset.id,k);},
    label:it=>it.getAttribute('aria-label')||'card'});
  /* tap a card, then tap a card that is already in a slot: put it in that slot (swap) */
  $('s-ng').addEventListener('pointerdown',e=>{if(!ok())return;const held=$('s-ng').querySelector('.dtcard.art-picked');if(!held)return;
    const hit=e.target.closest&&e.target.closest('.dtcard'),slot=hit&&hit.closest('.dtslot');if(!hit||hit===held||!slot)return;
    e.preventDefault();e.stopPropagation();DT_DRAG.cancel();dtPlace(held.dataset.id,+slot.dataset.k);},true);
}
function dtPlace(id,k){
  const S=G.st,from=S.slots.indexOf(id);S.bad=S.bad2=null;
  if(k<0){if(from>=0)S.slots[from]=null;}
  else{const occ=S.slots[k];S.slots[k]=id;if(from>=0)S.slots[from]=occ;else if(from<0&&occ){/* bumped card goes back to the tray */}}
  ngRender();
  const el=$('ngSide').querySelector(`.dtcard[data-id="${id}"]`);if(el)Art.pop(el,1.07);
}
function dtShuffle(L){const ids=L.events.map(e=>e.id),n=ids.length,out=[];for(let k=0;k<n;k++)out.push(ids[(k*3+1)%n]);
  if(new Set(out).size!==n)return ids.slice().reverse();if(out.join()===ids.join())out.reverse();return out;}

/* ---------------- checking: walk the timeline and find the first broken law ---------------- */
function dtFindBreak(L,order){
  const done=new Set();
  for(let k=0;k<order.length;k++){const e=dtEv(L,order[k]);
    if(e.t==='layer'){const m=(e.sup||[]).find(x=>!done.has(x));if(m)return {k,kind:'sup',e,o:dtEv(L,m)};}
    else{const m=(e.cut||[]).find(x=>!done.has(x));if(m)return {k,kind:'cut',e,o:dtEv(L,m)};
      const cv=L.ev.find(x=>x.t==='layer'&&(x.cover||[]).includes(e.id)&&done.has(x.id));if(cv)return {k,kind:'cover',e,o:cv};}
    done.add(e.id);}
  return null;
}
function dtWhy(L,b){
  const e=b.e,o=b.o,F=x=>DT_FOS[dtFosOf(x)][1];
  if(b.kind==='sup')return L.fossil?['Superposition',`The ${F(o)} layer is UNDER the ${F(e)} layer, so it formed first. That means the ${F(o)} lived before the ${F(e)}.`]
    :['Superposition',`Layer ${e.id} can't settle in mid-air! Layer ${o.id} sits under it in the cliff, so ${o.id} had to be laid down first.`];
  if(b.kind==='cut'){
    if(e.t==='fault')return o.t==='dike'?['Cross-cutting',`The fault is sliding the red band of magma rock, but the magma hasn't pushed up yet. The fault breaks the red band, so the fault came later.`]
      :['Cross-cutting',`The fault is cracking layer ${o.id}, but layer ${o.id} isn't there yet! A fault is younger than every layer it breaks.`];
    if(e.t==='dike')return ['Cross-cutting',`The magma is pushing up through layer ${o.id}, but ${o.id} isn't there yet! Magma rock is younger than every layer it cuts.`];
    if(e.t==='tilt')return ['Flat layers first',`Layer ${o.id} is tilted in the real cliff, so it was already there when the rock tipped. Sediment settles flat first, then forces tilt it.`];
    return ['Unconformity','The wavy erosion line cuts straight across TILTED layers. The layers had to tip over first, then erosion wore them flat.'];
  }
  if(e.t==='fault')return ['Cross-cutting',`The fault just cracked layer ${o.id} too! In the real cliff, layer ${o.id} is NOT broken, so ${o.id} formed after the fault.`];
  if(e.t==='dike')return ['Cross-cutting',`The magma just pushed through layer ${o.id}! In the real cliff the red band stops under ${o.id}, so ${o.id} formed later.`];
  if(e.t==='tilt')return ['Flat layers first',`Layer ${o.id} just got tilted! In the real cliff it lies flat, so it formed after the tilting.`];
  return ['Unconformity',`Erosion just wore away layer ${o.id}! In the real cliff, ${o.id} sits on top of the wavy line, so it formed after the erosion.`];
}

/* ---------------- views ---------------- */
function dtField(G){const L=G.L,s=dtScene(L,L.ev,{grass:L.top!==0});return s;}
function dtMain(G){
  const S=G.st,L=G.L,w=S.el;
  if(S.phase==='plan'||S.phase==='test'){
    w.replaceChildren(dtField(G),h('div',{class:'dttag'},I('eye'),' The real cliff'));
  }
}
function dtSide(G){
  const L=G.L,S=G.st,n=L.ev.length,T=ngT(),plan=S.phase==='plan',all=S.slots.every(Boolean);
  const tray=S.order.filter(id=>!S.slots.includes(id));
  const trayEl=h('div',{class:'dttray','aria-label':'Card tray. Drop a card here to take it off the timeline.'},
    h('div',{class:'dthd'},L.fossil?'Fossils':'Event cards'),...tray.map(id=>dtCard(L,id,S)),
    tray.length?null:h('div',{class:'dtempty'},'All placed! ✓'));
  const slots=[];for(let k=0;k<n;k++){const id=S.slots[k];
    slots.push(h('div',{class:'dtslot'+(S.step===k?' now':'')+(S.stepDone>k&&S.phase!=='plan'?' done':'')+(S.broke===k?' broke':''),'data-k':k,
      'aria-label':`Timeline spot ${k+1} of ${n}${k===0?' (oldest)':k===n-1?' (youngest)':''}`},
      h('span',{class:'dtsn'},String(k+1)),id?dtCard(L,id,S):h('span',{class:'dtph'},k===0?'Oldest goes here':k===n-1?'Youngest goes here':'Drop a card')));}
  const tl=h('div',{class:'dttl'},h('div',{class:'dthd'},'⬇ Oldest (first)'),...slots,h('div',{class:'dthd'},'⬆ Youngest'));
  let left=trayEl;
  if(S.phase==='build')left=h('div',{class:'dtnow'},h('div',{class:'dthd'},'Building…'),h('p',null,'Watch each event happen in the cliff. The yellow spot is playing now.'),ngBtn('Skip ▶▶',()=>{S.fast=true;},'ghost sm'));
  else if(S.phase==='broke'&&S.why)left=h('div',{class:'dtlaw',role:'alert'},h('div',{class:'dtrule'},I('warning'),' Law broken'),h('b',null,S.why[0]),
    h('p',null,`Step ${S.broke+1}: `,...ngRich(S.why[1])),ngBtn('Fix my timeline',()=>{S.phase='plan';S.broke=null;S.stepDone=0;dtMain(G);ngRender();},'good'));
  else if(S.phase==='ask')left=dtAsk(G);
  else if(S.phase==='done')left=h('div',{class:'dtnow ok'},h('div',{class:'dthd'},'Match! ✓'),h('p',null,'Your history builds the real cliff.'));
  left.classList.add('dtleft');const out=[h('div',{class:'dtcols'+(plan?'':' locked')},tl,left)];
  if(plan)out.push(ngBtn(T?'Turn in my timeline':['Build the cliff ',I('play')],dtBuild,'good dtbuild',{disabled:!all||G.done}));
  return out;
}
function dtAsk(G){
  const L=G.L,S=G.st,A=L.ask;
  return h('div',{class:'dtask'},h('b',null,A.q),
    h('div',{class:'dtopts'},...A.opts.map(id=>{const e=dtEv(L,id),k=dtFosOf(e),st=S.askPick===id?(id===A.ans?' ok':' no'):'';
      return h('button',{type:'button',class:'dtopt'+st,disabled:G.done||S.askPick===A.ans,onclick:()=>dtAnswer(id)},svgEl(dtOrgSvg(k,true,46)),h('span',null,DT_FOS[k][0]));})),
    S.askMsg?h('div',{class:'ppmsg '+S.askMsg[0]},S.askMsg[1]):null);
}
function dtAnswer(id){
  const L=G.L,S=G.st,A=L.ask;if(G.done||S.askPick===A.ans)return;S.askPick=id;
  const e=dtEv(L,id),c=dtEv(L,A.ans),F=x=>DT_FOS[dtFosOf(x)][1];
  if(id===A.ans){S.askMsg=['ok',`✓ Yes! The ${F(c)} are in a lower layer than the others, so they lived first.`];ngRender();
    const b=$('ngSide').querySelector('.dtopt.ok');if(b)Art.good(b);
    G.detail={checks:G.tries};setTimeout(()=>ngWin(ngStars(G.tries-1,0,1),['You built the true history and read the fossils. Builds: ',h('b',null,G.tries),'.']),600);}
  else{G.tries++;G.miss++;S.askMsg=['no',`Not quite. The ${F(e)} are in layer ${e.id}, ABOVE layer ${c.id}. Higher layer means younger. Try again.`];ngRender();
    const b=$('ngSide').querySelector('.dtopt.no');if(b)Art.bad(b);ngSay('Look at the cliff: which of these fossils is the deepest?','alert');}
}

/* ---------------- build: play the history ---------------- */
const dtWait=ms=>new Promise(r=>setTimeout(r,Art.reduced()?0:ms));
function dtXY(svg,x,y){const m=svg.getScreenCTM();if(!m)return [0,0];const p=svg.createSVGPoint();p.x=x;p.y=y;const q=p.matrixTransform(m);return [q.x,q.y];}
function dtBuild(){
  if(!G||G.key!=='strata'||G.done)return;const L=G.L,S=G.st;if(S.phase!=='plan'||!S.slots.every(Boolean))return;
  const ans=L.ev.map(e=>e.id);
  if(ngT())return ngTDone(S.slots.filter((id,k)=>id===ans[k]).length/ans.length);
  G.tries++;S.phase='build';S.fast=false;S.bad=S.bad2=null;S.broke=null;S.stepDone=0;
  const br=dtFindBreak(L,S.slots),stop=br?br.k:S.slots.length-1;S.run=(S.run||0)+1;
  ngRender();dtPlay(S.run,br,stop);
}
async function dtPlay(run,br,stop){
  const L=G.L,S=G.st,live=()=>G&&G.key==='strata'&&G.st===S&&S.run===run;
  const inset=h('div',{class:'dtinset'},dtField(G),h('span',null,'Real cliff'));
  const tag=h('div',{class:'dttag build'},I('layers'),' ',h('span',null,'Your build'));
  let svg=dtScene(L,[],{labels:false});S.el.replaceChildren(svg,inset,tag);
  ngSay('Watch the cliff form, one event at a time…');
  for(let k=0;k<=stop;k++){
    if(!live())return;
    const seq=S.slots.slice(0,k+1).map(id=>dtEv(L,id)),e=seq[k],isBreak=br&&br.k===k,fast=S.fast||Art.reduced();
    S.step=k;dtSlotMark(S);tag.lastChild.textContent=`Your build · step ${k+1} of ${S.slots.length}`;
    const o={anim:true,labels:false},B={};
    if(isBreak){if(br.kind==='sup')B.float=e.id;
      if(br.kind==='cover'){if(e.t==='fault'||e.t==='dike')B.extend=e.id;if(e.t==='ero')B.ghostAfter=br.o;else B.bad=br.o.id;}
      if(br.kind==='cut'||br.kind==='sup')B.ghostBefore={at:k,e:br.o};
      const m=br.kind==='cover'?(e.t==='ero'?br.o:null):br.o;
      if(m&&(m.t==='layer'||m.t==='dike'))B.ghostLab={x:300,y:Math.max(30,Math.min(DT_H-30,m.t==='dike'?m.top-24:(m.y0+dtBot(m))/2)),
        t:m.t==='dike'?'Red band: not here yet!':br.kind==='cover'?`Layer ${m.id} wore away!`:`Layer ${m.id}: not here yet!`};}
    Object.assign(o,B);
    const prev=svg;svg=dtScene(L,seq,o);S.el.replaceChild(svg,prev);
    const A=svg.querySelector('#'+svg.dataset.u+'A');
    await dtAnimate(svg,A,e,o,fast,live,L,k===0);
    if(!live())return;
    if(isBreak){const st=dtScene(L,seq,B);S.el.replaceChild(st,svg);dtBroke(st,br);return;}
    const fin=dtScene(L,seq,{grass:false});S.el.replaceChild(fin,svg);svg=fin;
    S.stepDone=k+1;dtSlotMark(S);await dtWait(fast?0:220);
  }
  if(!live())return;
  /* success: the build matches the real cliff */
  const fin=dtScene(L,L.ev,{grass:L.top!==0});S.el.replaceChild(fin,svg);
  S.step=null;S.stepDone=S.slots.length;inset.classList.add('match');tag.lastChild.textContent='Match! ✓';Art.good(inset);
  fx.pop({icon:'layers',text:'It matches!',kind:'great'});
  if(L.ask){S.phase='ask';ngRender();ngSay('Your cliff matches the real one! Now read the fossils: **which lived first?**','go');return;}
  S.phase='done';ngRender();ngSay('You read the rocks like a real geologist!','go');
  G.detail={checks:G.tries};setTimeout(()=>{if(live())ngWin(ngStars(G.tries-1,0,1),['You built the true history on build ',h('b',null,G.tries),'.']);},500);
}
function dtSlotMark(S){$('ngSide').querySelectorAll('.dtslot').forEach(s=>{const k=+s.dataset.k;s.classList.toggle('now',S.step===k);s.classList.toggle('done',k<S.stepDone);});}
async function dtAnimate(svg,A,e,o,fast,live,L,first){
  const tw=(from,to,dur,step,ease)=>fast?(step(to),Promise.resolve()):Art.tween({from,to,dur,ease:ease||'inOutCubic',step}).done;
  if(e.t==='layer'){
    const top=e.y0,bot=first?DT_H+4:Math.min(DT_H+4,dtBot(e)+50),c=DT_ROCK[e.rock][0];
    /* a living thing on the surface first (fossil levels) */
    const k=dtFosOf(e);let cre=null;
    if(L.fossil&&k&&!fast&&!o.float){const f=e.fos[0];const g=document.createElementNS('http://www.w3.org/2000/svg','g');
      g.innerHTML=dtOrgG(k,f[1],f[2],f[3]*1.25,true,'dtalive');g.setAttribute('opacity','0');svg.querySelector('.dtrock').after(g);cre=g;
      await tw(0,1,350,v=>g.setAttribute('opacity',v));await dtWait(650);}
    if(!live())return;
    if(!fast){for(let i=0;i<4;i++)setTimeout(()=>{if(!svg.isConnected)return;const [x,y]=dtXY(svg,90+i*140+Math.random()*60,Math.max(10,top-40));
      Art.burst(x,y,{n:6,colors:[c,dtSh(c,-.25),dtSh(c,.3)],angle:Math.PI/2,spread:.5,speed:140,gravity:420,life:.8,size:3.5});},i*180);}
    if(o.float){const fl=svg.querySelector('.dtfloat');if(fl)await tw(-140,0,fast?0:800,v=>fl.setAttribute('transform',`translate(0 ${v})`),'outBounce');return;}
    if(A)await tw(bot,top,fast?0:950,v=>{A.setAttribute('y',v);if(cre&&v<dtBot(e)-4)cre.setAttribute('opacity',Math.max(0,(v-top)/(dtBot(e)-top)));});
    if(cre)cre.remove();
  }else if(e.t==='fault'){
    const cr=svg.querySelector('.dtnew .dtcrack');if(cr&&!fast){const len=cr.getTotalLength();cr.style.strokeDasharray=len;cr.style.strokeDashoffset=len;await tw(len,0,450,v=>{cr.style.strokeDashoffset=v;});}
    if(!fast){const [x,y]=dtXY(svg,dtFaultX(e,e.top+40),e.top+40);Art.burst(x,y,{n:14,colors:['#8b6f4e','#c9b28a','#5a4632'],speed:160,size:3.5});Art.shake(S_wrap());}
    if(A)await tw(0,e.d,fast?0:800,v=>A.setAttribute('transform',`translate(0 ${v})`),'outBounce');
  }else if(e.t==='tilt'){
    if(!fast)Art.shake(S_wrap());
    if(A)await tw(0,e.a,fast?0:1100,v=>A.setAttribute('transform',`rotate(${v} ${e.px} ${e.py})`));
  }else if(e.t==='ero'){
    if(A){if(!fast){const pts=[[120,e.y-30],[300,e.y-40],[480,e.y-30]];pts.forEach(([x,y],i)=>setTimeout(()=>{if(!svg.isConnected)return;const [sx,sy]=dtXY(svg,x,y);Art.burst(sx,sy,{n:10,colors:['#c9a87a','#a9865a','#e8d2a8'],angle:0,spread:.9,speed:180,gravity:60,life:1,size:3});},i*200));}
      await tw(0,1,fast?0:1100,v=>{A.setAttribute('opacity',1-v);A.setAttribute('transform',`translate(${v*40} ${-v*10})`);});}
  }else if(e.t==='dike'){
    const top=o.extend?60:e.top;
    if(A)await tw(DT_H+20,top-10,fast?0:1000,v=>A.setAttribute('y',v),'outCubic');
    if(!fast){const [x,y]=dtXY(svg,e.x+e.w/2,top);Art.burst(x,y,{n:16,colors:['#ffb02e','#ff6a00','#fff2a8'],speed:200,size:3.5});}
    const hot=svg.querySelector('.dtdike:last-of-type .dthot')||[...svg.querySelectorAll('.dthot')].pop();
    if(hot)await tw(1,0,fast?0:900,v=>hot.setAttribute('opacity',v));
  }
}
const S_wrap=()=>G&&G.st&&G.st.el;
function dtBroke(svg,br){
  const L=G.L,S=G.st,[rule,txt]=dtWhy(L,br);
  if(br.kind==='sup'){const fl=svg.querySelector('.dtfloat');if(fl)Art.shake(fl);}
  Art.bad(S.el);G.miss++;
  S.phase='broke';S.broke=br.k;S.step=null;S.bad=br.e.id;S.bad2=br.o.id;S.why=[rule,txt];
  fx.pop({icon:'layers',text:'The rocks say no!',kind:'oops'});ngRender();
  ngSay(`The build stopped at step ${br.k+1}. The **red card** broke a law. Read why, then fix your timeline.`,'alert');
}

/* ---------------- game definition ---------------- */
ngDef({key:'strata',name:'Deep Time',ic:'layers',std:'MS-ESS1-4 · LS4-1',subj:'earth',cap3:true,winDelay:600,
  short:'Build the cliff: put Earth’s history in order and watch the rock form.',menuDesc:'Drag events into a timeline and watch the cliff build itself. A wrong order breaks a law of geology, right before your eyes.',
  intro:'Rock layers are a history book. Drag each event card into the timeline from oldest to youngest, then build the cliff and watch your history play out. A wrong order breaks a law of geology and the build stops right there. Right on the first build earns 3 stars.',
  how:['**Study the real cliff.** Letters label the layers.','**Drag the event cards** into the timeline: oldest at the bottom, youngest at the top.','Press **Build the cliff**. Sediment settles, faults slide and magma rises. If a law breaks, the build stops and names the rule.'],
  levels:DT_LEVELS,packs:DT_PACKS,
  mini:L=>{const ly=L.ev.filter(e=>e.t==='layer').slice().reverse(),f=L.ev.find(e=>e.t==='fault'),d=L.ev.find(e=>e.t==='dike'),t=L.ev.find(e=>e.t==='tilt');
    return svgEl(`<svg viewBox="0 0 44 30" width="48" height="32" aria-hidden="true"><g ${t&&!L.ev.find(e=>e.t==='ero')?'transform="rotate(-10 22 15)"':''}>${ly.map((b,i,a)=>`<rect x="-4" y="${2+i*26/a.length}" width="52" height="${26/a.length+.5}" fill="${DT_ROCK[b.rock][0]}"/>`).join('')}</g>${d?'<path d="M22 30l1-20q2-3 4 0l1 20z" fill="#b8402a"/>':''}${f?'<line x1="28" y1="6" x2="34" y2="30" stroke="#2a1a10" stroke-width="2"/>':''}${L.ev.find(e=>e.t==='ero')?'<path d="M0 16l6-2 6 2 6-2 6 2 6-2 6 2 6-2" stroke="#4b2a14" stroke-width="1.6" fill="none"/>':''}</svg>`);},
  start(G){if(DT_DRAG)DT_DRAG.cancel();const n=G.L.ev.length;G.st={order:dtShuffle(G.L),slots:Array(n).fill(null),phase:'plan',bad:null,bad2:null,step:null,stepDone:0,el:null,run:0};},
  hud(G){return {label:'Builds',val:G.tries,target:'3 ★ = right on the first build'};},
  render(G,main,side){
    const S=G.st;
    if(!S.el){S.el=h('div',{class:'dtwrap'});dtMain(G);dtDragInit();}
    if(main.children[0]!==S.el||main.children.length!==1)ngRC(main,S.el);
    ngRC(side,h('div',{class:'dtside'},...dtSide(G)));
    if(S.phase==='plan'){const left=S.slots.filter(x=>!x).length;
      ngSay(left?(ngT()?`Drag every card into the timeline, oldest at the bottom. ${left} left.`:`Drag the cards into the timeline, **oldest at the bottom**. Point at a card to light it up in the cliff. ${left} left.`)
        :(ngT()?'All placed. Press **Turn in my timeline**.':'All placed! Press **Build the cliff** to play your history.'));}
  },
  hints(G){const L=G.L,e=L.ev,t=x=>dtCardTxt(L,x)[0];
    return [L.clue,'Three rules: (1) lower layers are older, (2) layers are laid down flat, so tilting comes later, (3) anything that cuts across rock is younger than the rock it cuts.',
      `Oldest: "${t(e[0])}". Youngest: "${t(e[e.length-1])}". They are now in place for you.`];},
  onHint(G){const S=G.st,L=G.L,n=L.ev.length;if(G.hint!==3||S.phase!=='plan')return;
    [[L.ev[0].id,0],[L.ev[n-1].id,n-1]].forEach(([id,k])=>{const from=S.slots.indexOf(id),occ=S.slots[k];S.slots[k]=id;if(from>=0&&from!==k)S.slots[from]=occ&&occ!==id?occ:null;});}
});
NGTHUMB.strata=()=>{
  let t='';const cols=['#c6a485','#e3bd73','#8b877f','#c9d3db','#b4875a'];
  cols.forEach((c,i)=>{t+=`<rect x="0" y="${40+i*28}" width="320" height="29" fill="${c}"/><path d="M0 ${40+i*28}h320" stroke="#000" stroke-opacity=".2"/>`;});
  t+=`<path d="M196 40L236 180" stroke="#24150c" stroke-width="4"/><path d="M98 180L102 76q6-6 12 0l4 104z" fill="#b8402a" stroke="#4c1a12" stroke-width="1.5"/>`+
    `<g transform="translate(48 154) scale(.42) translate(-50 -36)">${dtOrg('tri',false)}</g><g transform="translate(276 98) scale(.5) translate(-50 -36)">${dtOrg('dino',false)}</g><g transform="translate(154 128) scale(.5) translate(-50 -36)">${dtOrg('fish',false)}</g>`+
    `<rect x="0" y="0" width="320" height="40" fill="#7ab8e0"/><path d="M0 40h320" stroke="#4f9a3a" stroke-width="4"/>`+ngStar(296,18,8)+ngStar(30,16,6,'#f6efe0',.8);
  return ngWrap('strata','#7a5a3a',t);
};
