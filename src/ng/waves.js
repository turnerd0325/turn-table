/* ================= PHYSICS 4: WAVE TUNER (MS-PS4-1) =================
   "Tune it": the student drags the wave itself. The gold crest knob sets the amplitude and the
   gold spacing knob sets the wavelength. Every level is a mission in a scene: a wave tank with a
   sand castle, a radio, a speaker, a wine glass, a rope. Measuring is still the game: measure
   rounds freeze a snapshot on the grid, the student's own wave stays hidden, and they set the
   knobs to what they measured. Pressing Send launches their wave over the target, so the
   result checks the measurement. Energy rounds hide the energy meter until the wave lands.
   Energy units = amplitude x amplitude (1 cm = 1 unit, 2 cm = 4 units, ...). */
const WV={W:720,H:368,X0:112,CM:12,MID:206,AY:17,AX:92,RY:328,V:40,VD:192,MX:672,MT:118,MB:298,MMAX:25};
WV.X1=WV.X0+40*WV.CM;WV.LT=58;WV.LB=WV.H-12;WV.GT=WV.MID-5.5*WV.AY;WV.GB=WV.MID+5.5*WV.AY;
const WVR={
  tune:(A,lam,o)=>Object.assign({t:'tune',A,lam,knobs:'AL'},o),
  meas:(ask,A,lam,o)=>Object.assign({t:'meas',ask,A,lam},o),
  e4:(A,lam,ans)=>({t:'e4',A,lam,ans}),
  pick:(kind,q,waves,ans,why)=>({t:'pick',kind,q,waves,ans,why}),
  pred:(A0,A1,ans)=>({t:'pred',A0,A1,ans}),
  snd:(need,A,lam)=>({t:'snd',need,A,lam}),
  glass:(lam,minA)=>({t:'glass',lam,minA}),
  freq:(f,ans)=>({t:'freq',f,ans})
};
const WVL=(name,story,scene,rounds,o)=>Object.assign({name,story,scene,rounds},o);
const WV_LEVELS=[
  WVL('Amplitude','Make waves in the wave tank, then measure them.','sea',[WVR.tune(3,20,{knobs:'A',start:[1,20]}),WVR.meas('A',1,10),WVR.meas('A',4,40)],{
    intro:'**Amplitude** is the height from the **rest line** (the middle) to the top of a crest. Drag the wave up or down. Each grid square is 1 cm.',
    fact:'Amplitude is measured from the rest position (the middle line) to the crest, not from the bottom of a trough to the top of a crest.',
    clue:'Count the squares from the middle line up to the very top of a crest. Do not count all the way down to the trough.'}),
  WVL('Wavelength','Tune the radio. Measure each station’s wave, then set the dial.','radio',[WVR.meas('L',2,20,{title:'Tune in Station 1'}),WVR.meas('L',3,10,{title:'Tune in Station 2'}),WVR.meas('L',2,15,{title:'Tune in Station 3'})],{
    intro:'**Wavelength** is the distance from one crest to the next crest. Drag the **λ knob** on the bottom ruler. The numbers count every 5 cm.',
    fact:'Wavelength can be measured from any point on a wave to the same point on the next wave: crest to crest, or trough to trough.',
    clue:'Find two crests next to each other. How far apart are they?'}),
  WVL('Read Both','Use both knobs on the rope.','rope',[WVR.tune(2,10,{start:[4,30]}),WVR.meas('AL',4,20),WVR.meas('AL',1,40)],{
    intro:'Now both knobs work. The **crest knob** (left) sets the amplitude. The **λ knob** (bottom) sets the wavelength.',
    fact:'Scientists describe a wave with numbers: its amplitude, wavelength, frequency and speed. Two waves with the same numbers behave the same way.',
    clue:'Measure up from the middle for amplitude. Measure across from crest to crest for wavelength.'}),
  WVL('Bigger Wave','Which wave can knock down a sand castle?','sea',[
      WVR.pick('energy','Which wave carries more energy?',[[2,20],[4,20]],1,'The wave with the bigger amplitude carries more energy. It knocked the castle down.'),
      WVR.pick('energy','Which wave carries more energy?',[[3,10],[1,10]],0,'Bigger amplitude, more energy. That is why taller ocean waves can knock you over.'),
      WVR.pred(1,2,4)],{
    intro:'Tap the wave you think carries **more energy**. Then watch the energy meters fill.',
    fact:'The energy carried by a wave grows with the square of its amplitude. Double the amplitude, and the wave carries four times the energy.',
    clue:'Taller waves are more powerful. Compare the heights.'}),
  WVL('Energy Ladder','Use amplitude to control energy.','sea',[
      WVR.e4(1,20,2),WVR.e4(2,10,4),
      WVR.pick('energy','Which of these waves carries the MOST energy?',[[2,10],[3,20],[1,40]],1,'The 3 cm wave has the biggest amplitude, so it carries the most energy.')],{
    intro:'Each castle needs a wave with **4 times the energy** of the dashed wave. The energy meter stays hidden until your wave hits.',
    fact:'Because energy grows with amplitude squared, a little more amplitude means a lot more energy. Earthquake waves with bigger amplitudes do much more damage.',
    clue:'4 times the energy needs 2 times the amplitude (because 2 × 2 = 4).'}),
  WVL('Sound Waves','Sound is a wave too. Change the sound, then shatter a glass.','speaker',[WVR.snd('loud',1,20),WVR.snd('high',2,20),WVR.glass(10,4)],{
    intro:'The screen shows the sound wave from the speaker. Decide which knob changes **loudness** and which changes **pitch**.',
    fact:'Loudness is about amplitude (energy). Pitch is about frequency. A whisper and a shout can be the same note.',
    clue:'Volume = amplitude. Pitch = frequency. Shorter waves = higher frequency.'}),
  WVL('Faster Shake','You shake a long rope. The waves always travel at 40 cm per second on this rope.','rope',[WVR.freq(1,40),WVR.freq(2,20),WVR.freq(4,10)],{
    intro:'**Frequency** is how many waves pass each second. On the same rope, waves move at the same speed: **speed = frequency × wavelength**.',
    fact:'On the same rope (or in the same material), wave speed stays the same. Shake faster (higher frequency), and the wavelength gets shorter.',
    clue:'40 cm per second. If 2 waves pass each second, how long is each wave?'}),
  WVL('Count the Waves','Count complete waves to find the wavelength.','speaker',[WVR.meas('L',3,10,{title:'Measure the recording'}),WVR.meas('AL',2,5,{title:'Measure the recording'}),WVR.meas('L',4,40,{title:'Measure the recording'})],{
    intro:'Short waves are hard to measure one at a time. Count how many **complete waves** fit in the 40 cm screen, then divide.',
    fact:'If 4 complete waves fit in 40 cm, each wave is 40 ÷ 4 = 10 cm long. Counting waves is a quick way to measure wavelength.',
    clue:'Count how many complete waves fit in the 40 cm window, then divide.'}),
  WVL('Wave Master','A mix of everything.','sea',[WVR.meas('AL',3,15,{scene:'radio',title:'Tune in the last station'}),WVR.e4(2,20,4),WVR.freq(2,20),
      WVR.pick('freq','Same rope, same speed. Which wave has the higher frequency?',[[2,20],[2,10]],1,'Same rope means same speed. Shorter wavelength means more waves pass each second: a higher frequency.')],{
    fact:'Waves of light, sound and water all share these properties. Engineers use them to design everything from speakers to cell phones.',
    clue:'Amplitude: up from the middle. Wavelength: crest to crest. Same rope: higher frequency, shorter wavelength.'})
];
const WV_PACKS={0:'Pack 1: Read the wave',3:'Pack 2: Energy and sound',6:'Pack 3: Frequency'};

/* ---------------- small helpers ---------------- */
const wvScn=(L,R)=>R&&R.scene?R.scene:R&&(R.t==='freq'||(R.t==='pick'&&R.kind==='freq'))?'rope':R&&(R.t==='e4'||R.t==='pred'||(R.t==='pick'&&R.kind==='energy'))?'sea':R&&R.t==='glass'?'glass':L.scene;
const wvF=lam=>WV.V/lam;
const wvFtxt=f=>Math.abs(f-Math.round(f))<.01?String(Math.round(f)):f.toFixed(1);
const wvKn=R=>R.t==='tune'?R.knobs:R.t==='meas'?R.ask:R.t==='e4'?'A':R.t==='freq'?'L':(R.t==='snd'||R.t==='glass')?'AL':'';
const wvSnapA=a=>Math.max(1,Math.min(5,Math.round(a)));
const wvSnapL=l=>Math.max(5,Math.min(40,Math.round(l/5)*5));
const wvAY=a=>WV.MID-a*WV.AY, wvLX=l=>WV.X0+l*WV.CM;
const wvEU=a=>Math.round(a*a*10)/10;
const wvMY=e=>WV.MB-Math.max(0,Math.min(WV.MMAX,e))/WV.MMAX*(WV.MB-WV.MT);
/* wave path. ph = shift in px (the wave travels right as ph grows). front = how far it has reached */
function wvD(A,lam,ph,x0,x1,mid,ay,front){
  const k=2*Math.PI/(lam*WV.CM),xe=front==null?x1:Math.min(x1,x0+front);let d='';
  for(let x=x0;x<xe+2.9;x+=3){const xx=Math.min(x,xe),y=mid-A*ay*Math.sin(k*(xx-x0-ph));d+=(d?'L':'M')+xx.toFixed(1)+' '+y.toFixed(1);if(xx>=xe)break;}
  return d||`M${x0} ${mid}`;
}
const wvY0=(A,lam,ph,mid,ay)=>mid-A*ay*Math.sin(2*Math.PI/(lam*WV.CM)*(-ph));

/* ---------------- scene art ---------------- */
function wvCastle(x,y,s,id){
  return `<g class="wvcastle" transform="translate(${x} ${y}) scale(${s})"><g class="wvcin">
<ellipse cx="0" cy="2" rx="40" ry="7" fill="#c99a4e"/>
<path d="M-30 0V-30h7v-6h5v6h6v-6h5v6h7V0z" fill="url(#${id}sd)"/><path d="M8 0V-34h7v-6h5v6h6v-6h5v6h1V0z" fill="url(#${id}sd)"/>
<path d="M-12 0V-46h6v-6h5v6h4v-6h5v6h6V0z" fill="url(#${id}sd2)"/>
<path d="M-4 0v-12a5 5 0 0 1 10 0V0z" fill="#7a5426"/><rect x="-22" y="-22" width="5" height="7" rx="2" fill="#7a5426"/><rect x="18" y="-25" width="5" height="7" rx="2" fill="#7a5426"/>
<path d="M2 -52v-16" stroke="#6b4a2a" stroke-width="1.6"/><path d="M2 -68l12 4-12 4z" fill="#ef476f"/>
<path d="M-30 -8h62M-28 -18h20M10 -20h20" stroke="#b98a40" stroke-width="1.2" opacity=".6"/></g></g>`;
}
function wvGlass(x,y,id){
  let sh='';[[-14,-30,-40,-50,-25],[10,-34,45,-60,40],[-4,-46,-10,-75,-60],[16,-18,60,-20,80],[-16,-12,-55,-10,-80],[4,-6,20,30,30]].forEach(([sx,sy,dx,dy,r])=>{
    sh+=`<path class="wvshard" style="--dx:${dx}px;--dy:${dy}px;--r:${r}deg" d="M${sx} ${sy}l7 -3 -2 9z" fill="#fde4ff" stroke="#fff" stroke-width=".8"/>`;});
  return `<g class="wvglass" transform="translate(${x} ${y})"><g class="wvgin">
<path d="M-17 -64c0 22 6 34 17 36 11-2 17-14 17-36z" fill="url(#${id}gl)" stroke="#fff" stroke-opacity=".85" stroke-width="1.6"/>
<path d="M-12 -46c2 9 6 14 12 15 6-1 10-6 12-15z" fill="#d1477a" opacity=".55"/>
<path d="M-10 -60c0 10 2 18 5 22" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>
<path d="M0 -28v24" stroke="#f3e9ff" stroke-width="3"/><ellipse cx="0" cy="-3" rx="12" ry="3.4" fill="#f3e9ff" stroke="#fff"/>
<path class="wvcrack" d="M-6 -62l5 9-4 6 7 8M9 -60l-3 8 5 5" stroke="#fff" stroke-width="1.4" fill="none"/></g>${sh}</g>`;
}
function wvScene(kind,id,lanes){
  const W=WV.W,H=WV.H,X0=WV.X0,X1=WV.X1,M=WV.MID;let bg='',panel='',left='',right='';
  const defs=`<defs><linearGradient id="${id}sd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d89a"/><stop offset="1" stop-color="#d9a95a"/></linearGradient>
<linearGradient id="${id}sd2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fbe2ad"/><stop offset="1" stop-color="#dcae62"/></linearGradient>
<linearGradient id="${id}wa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3fb4f0"/><stop offset=".45" stop-color="#1679c4"/><stop offset="1" stop-color="#0a3f75"/></linearGradient>
<linearGradient id="${id}gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#f0c8ff" stop-opacity=".35"/></linearGradient>
<linearGradient id="${id}mt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8fa3bf"/><stop offset=".5" stop-color="#e8eef7"/><stop offset="1" stop-color="#7d90ad"/></linearGradient>
<linearGradient id="${id}wd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b8743a"/><stop offset="1" stop-color="#7a4518"/></linearGradient>
<linearGradient id="${id}me" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2fd27a"/><stop offset=".5" stop-color="#ffd23f"/><stop offset="1" stop-color="#ff5a5f"/></linearGradient>
<radialGradient id="${id}cone" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#5a6788"/><stop offset=".7" stop-color="#1b2238"/><stop offset="1" stop-color="#0a0e1a"/></radialGradient>
<clipPath id="${id}win"><rect x="${X0}" y="${WV.GT-8}" width="${X1-X0}" height="${WV.GB-WV.GT+16}"/></clipPath></defs>`;
  if(kind==='sea'){
    bg=Art.backdrop('sky',W,H)+`<g opacity=".9"><ellipse cx="250" cy="52" rx="38" ry="11" fill="#fff" opacity=".8"/><ellipse cx="275" cy="45" rx="24" ry="12" fill="#fff" opacity=".85"/><ellipse cx="470" cy="70" rx="30" ry="8" fill="#fff" opacity=".7"/></g>`+
      (lanes?'':`<rect x="0" y="${M}" width="${X0}" height="${H-M}" fill="url(#${id}wa)"/>`);
    left=lanes?'':`<g><rect x="6" y="${M-74}" width="62" height="${H-M+74}" rx="8" fill="url(#${id}mt)" stroke="#5d6f8c" stroke-width="2"/><rect x="12" y="${M-66}" width="50" height="16" rx="4" fill="#13203d"/><text x="37" y="${M-54}" text-anchor="middle" font-size="9" font-weight="900" fill="#ffd23f">WAVE</text>
<path d="M6 ${M-30}h62v10H6z" fill="#ffd23f"/><path d="M14 ${M-30}l-8 10M28 ${M-30}l-8 10M42 ${M-30}l-8 10M56 ${M-30}l-8 10M68 ${M-28}l-6 8" stroke="#13203d" stroke-width="4"/>
<g class="wvsrc"><rect x="66" y="-40" width="16" height="80" rx="5" fill="url(#${id}mt)" stroke="#5d6f8c" stroke-width="2"/><rect x="70" y="-56" width="8" height="20" fill="#8fa3bf"/></g></g>`;
    right=lanes?'':`<path d="M${X1-6} ${H} L${X1-6} ${M+34} Q${X1+30} ${M+6} ${W} ${M}V${H}z" fill="#e6c27e"/><path d="M${X1-6} ${M+34} Q${X1+30} ${M+6} ${W} ${M}" fill="none" stroke="#fff3cf" stroke-width="3" opacity=".7"/>`+wvCastle(612,M+12,.92,id);
  }else if(kind==='rope'){
    bg=Art.backdrop('lab',W,H);
    panel=`<rect x="${X0-10}" y="${WV.GT-12}" width="${X1-X0+20}" height="${WV.GB-WV.GT+24}" rx="12" fill="#fbfdff" stroke="#c8d4e8" stroke-width="2" filter="url(#art-drop)"/>`;
    left=lanes?'':`<g class="wvsrc"><path d="M0 0H${X0-58}" stroke="#7a4316" stroke-width="9" stroke-linecap="round"/><path d="M0 0H${X0-58}" stroke="#e39a4c" stroke-width="5.5" stroke-linecap="round"/><path d="M-6 0H-60" stroke="#3a5a9a" stroke-width="26" stroke-linecap="round"/><path d="M-60 0H-90" stroke="#2c4475" stroke-width="30"/><circle cx="0" cy="0" r="15" fill="#f2c9a0" stroke="#c99a74" stroke-width="2"/><path d="M-8 -9q8 4 0 18M-2 -12q8 6 0 24" stroke="#c99a74" stroke-width="2" fill="none"/></g>`;
    right=lanes?'':`<rect x="${X1+4}" y="${WV.GT-16}" width="16" height="${H-WV.GT}" rx="4" fill="url(#${id}wd)"/><circle class="wvpost" cx="${X1+2}" cy="${M}" r="7" fill="none" stroke="#c0c8d8" stroke-width="4"/>`;
  }else{
    const night=kind==='radio';
    bg=Art.backdrop(night?'night':'dusk',W,H);
    panel=`<rect x="${X0-10}" y="${WV.GT-12}" width="${X1-X0+20}" height="${WV.GB-WV.GT+24}" rx="14" fill="#06131f" stroke="#2c4d6b" stroke-width="3" filter="url(#art-drop-lg)"/><rect x="${X0-4}" y="${WV.GT-6}" width="${X1-X0+8}" height="20" rx="8" fill="#fff" opacity=".04"/>`;
    if(kind==='radio')left=`<g><path d="M30 ${H-6}L46 ${M-90}L62 ${H-6}" fill="none" stroke="#9fb3d6" stroke-width="3"/><path d="M34 ${H-40}L58 ${H-90}M58 ${H-40}L34 ${H-90}M37 ${H-110}L55 ${M-30}M55 ${H-110}L37 ${M-30}M40 ${M-30}L52 ${M-80}M52 ${M-30}L40 ${M-80}" stroke="#7d90b5" stroke-width="1.6"/>
<circle class="wvblink" cx="46" cy="${M-94}" r="5" fill="#ff5a5f"/><path class="wvsrc" d="M64 ${M-104}a22 22 0 0 1 0 22M72 ${M-112}a34 34 0 0 1 0 38" stroke="#7dffb2" stroke-width="2.4" fill="none" opacity=".8"/></g>`;
    else left=`<g><rect x="14" y="${M-70}" width="62" height="140" rx="10" fill="#1a1f2e" stroke="#3b4560" stroke-width="2" filter="url(#art-drop)"/><circle cx="45" cy="${M-44}" r="10" fill="url(#${id}cone)" stroke="#59627d"/>
<g class="wvsrc" transform="translate(45 ${M+14})"><circle r="26" fill="url(#${id}cone)" stroke="#59627d" stroke-width="2"/><circle r="9" fill="#2b3350" stroke="#6b7594"/></g></g>`;
    if(kind==='radio')right=`<g transform="translate(${X1+14} ${M-58})"><rect x="0" y="0" width="64" height="104" rx="12" fill="url(#${id}wd)" stroke="#4c2a0d" stroke-width="2" filter="url(#art-drop)"/>
<rect x="8" y="10" width="48" height="24" rx="5" fill="#f7e9c8" stroke="#4c2a0d"/>${[0,1,2,3,4,5,6,7].map(i=>`<path d="M${11+i*6} 30v-5" stroke="#4c2a0d" stroke-width="1"/>`).join('')}
<path class="wvneedle" d="M32 32V13" stroke="#e63946" stroke-width="2.4"/><circle cx="32" cy="68" r="20" fill="#3b2410"/>${[-12,-6,0,6,12].map(o=>`<path d="M${20+((12-Math.abs(o))*.2)} ${68+o}h${24-((12-Math.abs(o))*.4)}" stroke="#8a5a2b" stroke-width="2.4"/>`).join('')}
<circle class="wvlamp" cx="54" cy="96" r="4.5" fill="#51222a"/><g class="wvstatic" opacity="0"><path d="M14 52l4-6 4 9 4-11 4 8 4-6 4 10 4-7 4 5" stroke="#fff" stroke-width="1.6" fill="none"/></g></g>`;
    else if(kind==='speaker')right=`<g transform="translate(${X1+30} ${M})"><path d="M0 18v70M-14 90h28" stroke="#5f6b85" stroke-width="4" stroke-linecap="round"/><rect x="-10" y="-30" width="20" height="48" rx="10" fill="#2d3550" stroke="#8592b3" stroke-width="2"/>${[-20,-12,-4,4].map(y=>`<path d="M-8 ${y}h16" stroke="#8592b3" stroke-width="1.4"/>`).join('')}</g>`;
    else right=`<path d="M${X1+6} ${M+46}h66" stroke="#8a5a2b" stroke-width="7" stroke-linecap="round"/><path d="M${X1+16} ${M+50}v${H-M-50}M${X1+62} ${M+50}v${H-M-50}" stroke="#6b4a2a" stroke-width="5"/>`+wvGlass(X1+38,M+43,id);
  }
  return {defs,bg,panel,left,right};
}
function wvGrid(kind,id){
  const c=kind==='sea'?'#ffffff':kind==='rope'?'#9fb6d6':'#1e4c66',o=kind==='sea'?.24:kind==='rope'?.8:1,X0=WV.X0,X1=WV.X1;let t=`<g clip-path="url(#${id}win)" opacity="${o}">`;
  for(let x=0;x<=40;x++)t+=`<line x1="${X0+x*WV.CM}" y1="${WV.GT}" x2="${X0+x*WV.CM}" y2="${WV.GB}" stroke="${c}" stroke-width="${x%5?.6:1.3}"/>`;
  for(let k=-5;k<=5;k++)if(k)t+=`<line x1="${X0}" y1="${WV.MID-k*WV.AY}" x2="${X1}" y2="${WV.MID-k*WV.AY}" stroke="${c}" stroke-width=".6"/>`;
  t+=`</g><line x1="${X0}" y1="${WV.MID}" x2="${X1}" y2="${WV.MID}" stroke="${kind==='sea'?'#fff':kind==='rope'?'#6d86ad':'#4f86ad'}" stroke-width="1.6" stroke-dasharray="6 5" opacity=".9"/>`;
  return t;
}
function wvRulers(kind){
  const X0=WV.X0,X1=WV.X1,RY=WV.RY,AX=WV.AX,dark=kind!=='rope';
  const fg=dark?'#dbe8ff':'#2a3b5c',bg=dark?'rgba(6,14,30,.72)':'rgba(255,255,255,.92)';
  let t=`<rect x="${X0-8}" y="${RY-12}" width="${X1-X0+16}" height="42" rx="10" fill="${bg}"/>`;
  for(let x=0;x<=40;x++)t+=`<line x1="${X0+x*WV.CM}" y1="${RY-8}" x2="${X0+x*WV.CM}" y2="${RY-8+(x%5?5:10)}" stroke="${fg}" stroke-width="${x%5?1:1.6}" opacity=".8"/>`;
  for(let x=0;x<=40;x+=5)t+=`<text x="${X0+x*WV.CM}" y="${RY+25}" text-anchor="middle" font-size="12" font-weight="800" fill="${fg}">${x}</text>`;
  t+=`<text x="${X1+10}" y="${RY+25}" font-size="11" font-weight="800" fill="${fg}">cm</text>`;
  t+=`<rect x="${AX-12}" y="${wvAY(5.5)}" width="24" height="${5.5*WV.AY+12}" rx="10" fill="${bg}"/>`;
  for(let a=0;a<=5;a++)t+=`<line x1="${AX-8}" y1="${wvAY(a)}" x2="${AX-1}" y2="${wvAY(a)}" stroke="${fg}" stroke-width="1.4"/><text x="${AX+8}" y="${wvAY(a)+4}" text-anchor="middle" font-size="10" font-weight="800" fill="${fg}">${a}</text>`;
  return t;
}
const wvPill=(cls,x,lab,w)=>`<g class="wvpill ${cls}" transform="translate(${x} 26)"><rect x="${-w/2}" y="-17" width="${w}" height="34" rx="17" fill="#0f1b38" opacity=".86" stroke="#fff" stroke-opacity=".14"/><circle class="wvdot" cx="${-w/2+15}" cy="0" r="5" fill="#ffd23f" opacity=".25"/><text x="${-w/2+26}" y="-3" font-size="9.5" font-weight="800" fill="#9fb3d6" letter-spacing=".06em">${lab}</text><text class="wvpv" x="${-w/2+26}" y="12" font-size="14" font-weight="900" fill="#fff"></text></g>`;
function wvMeter(id,label){
  const x=WV.MX,t=WV.MT,b=WV.MB;let s=`<g class="wvmeter"><rect x="${x-22}" y="${t-26}" width="58" height="${b-t+44}" rx="12" fill="#0f1b38" opacity=".84"/><text x="${x+13}" y="${t-12}" text-anchor="middle" font-size="8.5" font-weight="900" fill="#9fb3d6" letter-spacing=".05em">${label}</text>
<rect x="${x}" y="${t}" width="26" height="${b-t}" rx="7" fill="#1d2a4a"/><clipPath id="${id}mc"><rect x="${x}" y="${t}" width="26" height="${b-t}" rx="7"/></clipPath>
<rect class="wvmfill" clip-path="url(#${id}mc)" x="${x}" y="${b}" width="26" height="0" fill="url(#${id}me)"/>`;
  [1,4,9,16,25].forEach(e=>{s+=`<path d="M${x} ${wvMY(e)}h5M${x+21} ${wvMY(e)}h5" stroke="#fff" stroke-opacity=".55"/><text x="${x-3}" y="${wvMY(e)+3}" text-anchor="end" font-size="9" font-weight="800" fill="#cfd8ff">${e}</text>`;});
  s+=`<text class="wvmq" x="${x+13}" y="${(t+b)/2+8}" text-anchor="middle" font-size="24" font-weight="900" fill="#ffd23f">?</text><g class="wvmref"></g><g class="wvmgoal"></g><g class="wvmark"></g>
<text class="wvmv" x="${x+13}" y="${b+13}" text-anchor="middle" font-size="10" font-weight="900" fill="#fff"></text></g>`;
  return s;
}
const wvKnob=(cls,lab,vert)=>`<g class="wvknob ${cls}" tabindex="0" role="slider" aria-label="${lab}"><circle r="22" fill="transparent"/><circle class="wvkg" r="15" fill="#ffd23f" opacity=".28"/><circle r="11" fill="#ffd23f" stroke="#7a5200" stroke-width="2" filter="url(#art-drop)"/><circle cx="-3" cy="-4" r="3.6" fill="#fff" opacity=".7"/>`+
  (vert?`<path d="M-4 -2l4-4 4 4M-4 3l4 4 4-4" stroke="#7a5200" stroke-width="1.8" fill="none"/>`:`<path d="M-2 -4l-4 4 4 4M2 -4l4 4-4 4" stroke="#7a5200" stroke-width="1.8" fill="none"/>`)+`</g>`;

/* ---------------- build the board for this round ---------------- */
let WV_U=0;
function wvBuild(G){
  const S=G.st,L=G.L,R=L.rounds[S.r]||L.rounds[L.rounds.length-1],kind=wvScn(L,R),id='wv'+(++WV_U).toString(36),lanes=R.t==='pick';
  const sc=wvScene(kind,id,lanes),kn=wvKn(R),meter=!lanes&&(kind==='sea'||kind==='speaker'||kind==='glass');
  let t=sc.defs+sc.bg+sc.panel;
  const waveCol=kind==='radio'?'#7dffb2':kind==='glass'?'#ff8ad8':'#4fd1ff';
  if(lanes){
    const n=R.waves.length,top=WV.LT,hh=(WV.LB-WV.LT)/n;
    R.waves.forEach((w,i)=>{const y0=top+i*hh,mid=y0+hh/2;
      t+=`<g class="wvlane" data-i="${i}" tabindex="0" role="button" aria-label="Wave ${'ABC'[i]}">`+
        (kind==='sea'?`<rect x="0" y="${y0}" width="${WV.W}" height="${hh}" fill="transparent"/><rect x="${WV.X0-6}" y="${y0+3}" width="${WV.W-WV.X0}" height="${hh-6}" rx="10" fill="#e9f6ff" fill-opacity=".45" stroke="#fff" stroke-opacity=".8" stroke-width="2"/><path d="M${WV.X1+8} ${y0+hh-3}Q${WV.X1+40} ${y0+hh-22} ${WV.W-6} ${y0+hh-24}V${y0+hh-3}z" fill="#e6c27e"/>`:`<rect x="${WV.X0-6}" y="${y0+3}" width="${WV.X1-WV.X0+12}" height="${hh-6}" rx="10" fill="#fbfdff" stroke="#c8d4e8" stroke-width="2"/>`)+
        `<rect class="wvlhl" x="${WV.X0-54}" y="${y0+3}" width="${WV.W-WV.X0+50}" height="${hh-6}" rx="12" fill="none" stroke="#ffd23f" stroke-width="3" opacity="0"/>`+
        `<line x1="${WV.X0}" x2="${WV.X1}" y1="${mid}" y2="${mid}" stroke="${kind==='sea'?'#fff':'#9fb6d6'}" stroke-dasharray="5 5" opacity=".7"/>`+
        (kind==='sea'?`<path class="wvlfill" fill="url(#${id}wa)" opacity=".95"/><path class="wvlline" fill="none" stroke="#e8f7ff" stroke-width="2.4"/>`:`<path class="wvlline" fill="none" stroke="#7a4316" stroke-width="7" stroke-linecap="round"/><path class="wvlline2" fill="none" stroke="#e39a4c" stroke-width="4" stroke-linecap="round"/>`)+
        `<circle cx="${WV.X0-30}" cy="${mid}" r="15" fill="#13203d" stroke="#fff" stroke-width="2"/><text x="${WV.X0-30}" y="${mid+5}" text-anchor="middle" font-size="15" font-weight="900" fill="#fff">${'ABC'[i]}</text>`+
        (kind==='sea'?wvCastle(626,Math.min(mid+hh/2-10,mid+16),.45+.12/n,id)+`<g transform="translate(600 ${y0+hh-16})"><rect x="-3" y="-4" width="112" height="16" rx="8" fill="#0f1b38" opacity=".85"/><rect width="70" height="8" rx="4" fill="#33415f"/><rect class="wvlbar" width="0" height="8" rx="4" fill="url(#${id}me)"/><text class="wvlv" x="76" y="8" font-size="10" font-weight="900" fill="#fff"></text></g>`
          :`<g transform="translate(${WV.X1+26} ${mid})"><rect x="-4" y="-${hh/2-6}" width="12" height="${hh-12}" rx="3" fill="url(#${id}wd)"/><rect x="14" y="-14" width="70" height="28" rx="14" fill="#13203d"/><text class="wvlv" x="49" y="5" text-anchor="middle" font-size="13" font-weight="900" fill="#ffd23f">? / s</text></g>`)+
        `</g>`;});
  }else{
    if(kind==='sea')t+=`<path class="wvfill" fill="url(#${id}wa)"/><path class="wvfoam" fill="none" stroke="#e8f7ff" stroke-width="3" stroke-linejoin="round"/>`;
    t+=wvGrid(kind,id);
    if(kind==='rope')t+=`<path class="wvmain wvr1" fill="none" stroke="#7a4316" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path class="wvmain wvr2" fill="none" stroke="#e39a4c" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><path class="wvmain wvr3" fill="none" stroke="#ffd2a0" stroke-width="2" stroke-dasharray="3 6" stroke-linecap="round"/>`;
    else if(kind!=='sea')t+=`<path class="wvmain wvglo" fill="none" stroke="${waveCol}" stroke-width="10" opacity=".22" stroke-linecap="round" stroke-linejoin="round"/><path class="wvmain wvcore" fill="none" stroke="${waveCol}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`;
    t+=`<path class="wvov wvovg" fill="none" stroke-width="8" opacity=".25" stroke-linecap="round"/><path class="wvov wvovc" fill="none" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
    t+=`<g class="wvsnap" opacity="0"><rect x="${WV.X0+6}" y="${WV.GT-4}" width="96" height="22" rx="11" fill="#13203d" opacity=".85"/><text x="${WV.X0+54}" y="${WV.GT+11}" text-anchor="middle" font-size="11" font-weight="900" fill="#ffd23f">● SNAPSHOT</text></g>`;
  }
  t+=sc.left+sc.right;
  if(!lanes){
    t+=wvRulers(kind);
    t+=`<g class="wvabr"><path class="wvabl" stroke="#ffd23f" stroke-width="3" fill="none"/><path class="wvaguide" stroke="#ffd23f" stroke-width="1.4" stroke-dasharray="3 4" fill="none" opacity=".9"/></g>`;
    t+=`<g class="wvlbr"><path class="wvlbl" stroke="#ffd23f" stroke-width="3" fill="none"/><text class="wvlbt" font-size="13" font-weight="900" fill="#ffd23f" text-anchor="middle">λ</text></g>`;
    if(meter)t+=wvMeter(id,kind==='sea'?'ENERGY':'LOUD');
    t+=wvPill('pa',212,'AMPLITUDE',134)+wvPill('pl',356,'WAVELENGTH',134)+wvPill('pf',500,R.t==='freq'?'WAVES / SECOND':'FREQUENCY',134);
    if(R.t==='freq')t+=`<g class="wvclock" opacity="0"><rect x="584" y="10" width="124" height="34" rx="17" fill="#13203d" opacity=".9"/><rect class="wvclk" x="592" y="34" width="0" height="4" rx="2" fill="#ffd23f"/><text x="646" y="28" text-anchor="middle" font-size="11" font-weight="900" fill="#fff">1 second (slow-mo)</text></g>`;
    else if(kind==='rope')t+=`<g><rect x="590" y="10" width="118" height="34" rx="17" fill="#13203d" opacity=".86"/><text x="649" y="31" text-anchor="middle" font-size="11.5" font-weight="900" fill="#fff">speed 40 cm/s</text></g>`;
    t+=`<g class="wvring"></g>`;
    if(kn.includes('A'))t+=wvKnob('wvak','Amplitude, in centimeters',true);
    if(kn.includes('L'))t+=wvKnob('wvlk','Wavelength, in centimeters',false);
  }
  const svg=ngSvg(WV.W,WV.H,t,'ngsvg wvsvg wv-'+kind,'Wave board: drag the gold knobs to change the wave');
  const q=s=>svg.querySelector(s),qa=s=>[...svg.querySelectorAll(s)];
  S.el={svg,r:S.r,kind,id,lanes,kn,meter,R,
    main:qa('.wvmain'),fill:q('.wvfill'),foam:q('.wvfoam'),ovg:q('.wvovg'),ovc:q('.wvovc'),src:q('.wvsrc'),snap:q('.wvsnap'),
    ak:q('.wvak'),lk:q('.wvlk'),abl:q('.wvabl'),agd:q('.wvaguide'),lbl:q('.wvlbl'),lbt:q('.wvlbt'),
    pa:q('.pa .wvpv'),pl:q('.pl .wvpv'),pf:q('.pf .wvpv'),dot:q('.pf .wvdot'),
    mfill:q('.wvmfill'),mq:q('.wvmq'),mv:q('.wvmv'),mref:q('.wvmref'),mgoal:q('.wvmgoal'),mark:q('.wvmark'),
    ring:q('.wvring'),clock:q('.wvclock'),clk:q('.wvclk'),needle:q('.wvneedle'),lamp:q('.wvlamp'),stat:q('.wvstatic'),blinkEl:q('.wvpost')||q('.wvlamp'),
    lanesEl:qa('.wvlane').map(g=>({g,fill:g.querySelector('.wvlfill'),line:g.querySelector('.wvlline'),line2:g.querySelector('.wvlline2'),bar:g.querySelector('.wvlbar'),v:g.querySelector('.wvlv'),hl:g.querySelector('.wvlhl'),castle:g.querySelector('.wvcastle')})),
    blink:0,m:null,cache:{}};
  wvStatic(G);
  wvInput(G);
  wvDraw(G);
  wvLoop(G);
  return svg;
}

/* the parts that change only on a click: meter marks, hint ring, ghost colors */
function wvStatic(G){
  const S=G.st,E=S.el,R=E.R;if(!E)return;
  if(E.meter){
    const ref=R.t==='e4'?wvEU(R.A):R.t==='pred'?wvEU(R.A0):R.t==='snd'?wvEU(R.A):null,goal=R.t==='e4'?wvEU(R.A)*4:R.t==='snd'&&R.need==='loud'?16:R.t==='glass'?wvEU(R.minA):null;
    const line=(y,c,txt)=>`<path d="M${WV.MX-4} ${y}h34" stroke="${c}" stroke-width="2.6"/><text x="${WV.MX+13}" y="${y-4}" text-anchor="middle" font-size="8" font-weight="900" fill="${c}" stroke="#0f1b38" stroke-width="2.4" paint-order="stroke">${txt}</text>`;
    E.mref.innerHTML=ref!=null?line(wvMY(ref),'#cfd8ff',R.t==='snd'?'start':'now'):'';
    E.mgoal.innerHTML=goal!=null?line(wvMY(goal),'#ffd23f',R.t==='glass'?'shatter':R.t==='snd'?'shout':'goal'):'';
  }
  /* hint 3: a gold ring where the answer is */
  let ring='';
  if(G.hint>=3&&!ngT()&&!S.okNow){const rg=(x,y)=>`<circle cx="${x}" cy="${y}" r="18" fill="none" stroke="#ffd23f" stroke-width="3" stroke-dasharray="5 4" class="art-pulse"/>`;
    const a=R.t==='tune'||R.t==='meas'?R.A:R.t==='e4'?R.ans:R.t==='snd'&&R.need==='loud'?4:R.t==='glass'?R.minA:null;
    const l=R.t==='tune'||R.t==='meas'?R.lam:R.t==='freq'?R.ans:R.t==='glass'?R.lam:R.t==='snd'&&R.need==='high'?10:null;
    if(a!=null&&E.kn.includes('A'))ring+=rg(WV.AX,wvAY(a));
    if(l!=null&&E.kn.includes('L'))ring+=rg(wvLX(l),WV.RY);
    if(R.t==='pred')ring+=rg(WV.MX+13,wvMY(R.ans));
    if(E.lanes)E.lanesEl.forEach((ln,i)=>ln.hl.setAttribute('opacity',i===R.ans?'.9':'0'));}
  if(E.ring)E.ring.innerHTML=ring;
  const ovCol=R.t==='meas'?'#ffd23f':R.t==='glass'?'#ffd0f2':'#ffffff';
  const oc=S.res&&(R.t==='meas'||R.t==='tune')?S.res.ok?'#7df0b0':'#ffd23f':ovCol;
  if(E.ovc){E.ovc.setAttribute('stroke',oc);E.ovg.setAttribute('stroke',oc);
    E.ovc.setAttribute('stroke-dasharray',R.t==='meas'?'':'9 7');}
  [E.ak,E.lk].forEach(k=>{if(k)k.classList.toggle('off',S.okNow||G.done||S.busy);});
}

/* ---------------- drawing (every frame) ---------------- */
function wvShow(S,R){ /* which numbers may be shown right now */
  const hid=!S.shown;
  return {f:!((R.t==='freq'||R.t==='snd')&&hid),m:!((R.t==='e4'||R.t==='snd'||R.t==='glass'||R.t==='pred')&&hid)};
}
function wvDraw(G){
  const S=G.st,E=S.el;if(!E)return;const R=E.R,X0=WV.X0,X1=WV.X1,M=WV.MID,AY=WV.AY;
  const ph=WV.VD*S.t;
  if(E.lanes){
    const n=R.waves.length,top=WV.LT,hh=(WV.LB-WV.LT)/n;
    E.lanesEl.forEach((ln,i)=>{const [A,lam]=R.waves[i],mid=top+i*hh+hh/2,ay=(hh/2-6)/5.2,d=wvD(A,lam,ph,X0,X1,mid,ay);
      if(ln.fill)ln.fill.setAttribute('d',d+`L${X1} ${top+(i+1)*hh}L${X0} ${top+(i+1)*hh}Z`);ln.line.setAttribute('d',d);if(ln.line2)ln.line2.setAttribute('d',d);});
    return;
  }
  /* own wave (live or frozen) and the second wave (ghost or target) */
  const own={A:S.A,lam:S.lam,ph:R.t==='meas'?S.phi:ph};
  let main=own,ov=null,ovFront=null,mainFront=null;
  if(R.t==='meas'){main={A:R.A,lam:R.lam,ph:S.phi};if(S.shown){ov=own;ovFront=S.front*(X1-X0);}}
  else if(R.t==='tune')ov={A:R.A,lam:R.lam,ph};
  else if(R.t==='e4')ov={A:R.A,lam:R.lam,ph};
  else if(R.t==='snd')ov={A:R.A,lam:R.lam,ph};
  else if(R.t==='glass')ov={A:1,lam:R.lam,ph};
  else if(R.t==='pred'){main={A:R.A1,lam:20,ph};ov={A:R.A0,lam:20,ph};}
  if(S.shown&&R.t!=='meas'&&R.t!=='tune'&&S.front<1)mainFront=S.front*(X1-X0);
  const dm=wvD(main.A,main.lam,main.ph,X0,X1,M,AY,mainFront);
  if(E.fill){const end=mainFront==null?X1:X0+mainFront;E.fill.setAttribute('d',dm+(mainFront==null?'':`L${end} ${M}L${X1} ${M}`)+`L${X1} ${WV.H}L${X0} ${WV.H}Z`);E.foam.setAttribute('d',dm);}
  E.main.forEach(p=>p.setAttribute('d',dm));
  if(E.ovc){const d=ov?wvD(ov.A,ov.lam,ov.ph,X0,X1,M,AY,ovFront):'';E.ovc.setAttribute('d',d);E.ovg.setAttribute('d',d);}
  /* the source moves with the start of the wave */
  if(E.src){const y0=wvY0(main.A,main.lam,main.ph,M,AY);
    if(E.kind==='sea')E.src.setAttribute('transform',`translate(0 ${y0.toFixed(1)})`);
    else if(E.kind==='rope')E.src.setAttribute('transform',`translate(58 ${y0.toFixed(1)})`);
    else if(E.kind==='radio')E.src.setAttribute('opacity',(.45+.45*Math.abs(Math.sin(2*Math.PI*main.ph/(main.lam*WV.CM)))).toFixed(2));
    else{const s=1+.05*main.A*Math.sin(2*Math.PI*main.ph/(main.lam*WV.CM));E.src.setAttribute('transform',`translate(45 ${M+14}) scale(${s.toFixed(3)})`);}}
  /* crests arriving at the far end: blink + counter */
  const lp=main.lam*WV.CM,mm=Math.floor((main.ph-(X1-X0)+lp/4)/lp);
  if(E.m!=null&&mm>E.m&&R.t!=='meas'){E.blink=1;if(S.count)S.count.n++;}
  E.m=mm;E.blink=Math.max(0,E.blink-.06);
  if(E.dot)E.dot.setAttribute('opacity',(.25+.75*E.blink).toFixed(2));
  if(E.blinkEl&&E.kind==='rope')E.blinkEl.setAttribute('stroke',E.blink>.4?'#ffd23f':'#c0c8d8');
  /* knobs and brackets */
  if(E.ak){const y=wvAY(S.A);E.ak.setAttribute('transform',`translate(${WV.AX} ${y.toFixed(1)})`);E.abl.setAttribute('d',`M${WV.AX+16} ${M}V${y.toFixed(1)}M${WV.AX+11} ${M}h10M${WV.AX+11} ${y.toFixed(1)}h10`);
    E.agd.setAttribute('d',R.t==='meas'&&!S.shown?`M${WV.AX+14} ${y.toFixed(1)}H${X1}`:`M${WV.AX+14} ${y.toFixed(1)}H${X0+S.lam*WV.CM/4}`);
    E.ak.setAttribute('aria-valuenow',wvSnapA(S.A));E.ak.setAttribute('aria-valuetext',wvSnapA(S.A)+' centimeters');}
  else if(E.abl){E.abl.setAttribute('d','');E.agd.setAttribute('d','');}
  if(E.lk){const x=wvLX(S.lam);E.lk.setAttribute('transform',`translate(${x.toFixed(1)} ${WV.RY})`);E.lbl.setAttribute('d',`M${X0} ${WV.RY-18}H${x.toFixed(1)}M${X0} ${WV.RY-23}v10M${x.toFixed(1)} ${WV.RY-23}v10`);
    E.lbt.setAttribute('x',((X0+x)/2).toFixed(1));E.lbt.setAttribute('y',WV.RY-23);
    E.lk.setAttribute('aria-valuenow',wvSnapL(S.lam));E.lk.setAttribute('aria-valuetext',wvSnapL(S.lam)+' centimeters');}
  else if(E.lbl){E.lbl.setAttribute('d','');E.lbt.textContent='';}
  /* numbers */
  const sh=wvShow(S,R),A=R.t==='pred'?R.A1:wvSnapA(S.A),lam=R.t==='pred'?20:wvSnapL(S.lam);
  const txt={pa:(S.drag==='A'?S.A.toFixed(1):A)+' cm',pl:(S.drag==='L'?S.lam.toFixed(0):lam)+' cm',
    pf:R.t==='freq'?(S.count?wvFtxt(Math.min(S.count.n,99)):'?'):sh.f?wvFtxt(wvF(lam))+' per second':'?'};
  if(R.t==='freq'&&S.res)txt.pf=wvFtxt(wvF(lam))+' per second';
  ['pa','pl','pf'].forEach(k=>{if(E[k]&&E.cache[k]!==txt[k]){E[k].textContent=txt[k];E.cache[k]=txt[k];}});
  if(E.mfill){
    const showM=sh.m,val=S.mv!=null?S.mv:wvEU(R.t==='pred'?R.A1:S.A);
    const y=wvMY(showM?val:0);E.mfill.setAttribute('y',y.toFixed(1));E.mfill.setAttribute('height',(WV.MB-y).toFixed(1));
    E.mq.setAttribute('opacity',showM?'0':'1');const mv=showM?wvFtxt(val)+(Math.abs(val-1)<.05?' unit':' units'):'';if(E.cache.mv!==mv){E.mv.textContent=mv;E.cache.mv=mv;}
    if(R.t==='pred'){const y=wvMY(S.pv);E.mark.innerHTML=`<g class="wvpm" tabindex="0" role="slider" aria-label="Your energy prediction" aria-valuenow="${S.pv}" transform="translate(${WV.MX-6} ${y.toFixed(1)})"><rect x="-38" y="-14" width="80" height="28" fill="transparent"/><path d="M0 0l-12 -8v16z" fill="#ffd23f" stroke="#7a5200" stroke-width="1.5"/><rect x="-46" y="-9" width="32" height="18" rx="9" fill="#ffd23f"/><text x="-30" y="4" text-anchor="middle" font-size="11" font-weight="900" fill="#13203d">${S.pv}</text><path d="M-6 0h44" stroke="#ffd23f" stroke-width="2" stroke-dasharray="3 3"/></g>`;}
  }
  if(E.needle){const x=11+(lam-5)/35*42;E.needle.setAttribute('d',`M${x.toFixed(1)} 32V13`);}
  if(E.clock&&S.count){E.clock.setAttribute('opacity','1');E.clk.setAttribute('width',(108*Math.min(1,S.count.p)).toFixed(1));}
}
function wvLoop(G){
  const S=G.st,E=S.el;let last=0;
  const step=now=>{
    if(!G||G.key!=='waves'||G.st!==S||S.el!==E||!E.svg.isConnected||$('s-ng').hidden){E.raf=0;return;}
    const dt=last?Math.min(50,now-last):16;last=now;
    if(!Art.reduced()&&!(E.R.t==='meas'))S.t+=dt/1000;
    wvDraw(G);E.raf=requestAnimationFrame(step);};
  E.raf=requestAnimationFrame(step);
}

/* ---------------- input: knobs (mouse, touch, keys), lanes, prediction marker ---------------- */
function wvCan(G){const S=G.st;return !!(G&&G.key==='waves'&&!S.okNow&&!G.done&&!S.busy);}
function wvInput(G){
  const S=G.st,E=S.el,svg=E.svg,R=E.R;
  const pt=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const m=svg.getScreenCTM();return m?p.matrixTransform(m.inverse()):{x:0,y:0};};
  const aOf=p=>Math.max(.6,Math.min(5.2,Math.abs(WV.MID-p.y)/WV.AY)),lOf=p=>Math.max(4,Math.min(41,(p.x-WV.X0)/WV.CM));
  const settle=(k)=>{const from=k==='A'?S.A:S.lam,to=k==='A'?wvSnapA(from):wvSnapL(from);S.drag=null;
    Art.tween({from,to,dur:Math.abs(to-from)<.01?0:240,ease:'outBack',step:v=>{if(k==='A')S.A=v;else S.lam=v;},done:()=>{if(k==='A')S.A=to;else S.lam=to;S.touched=true;
      const kn=k==='A'?E.ak:E.lk;if(kn)Art.pop(kn.querySelector('.wvkg'),1.4);if(!ngT()&&!S.msg)ngSay(wvLive(G),null);}});};
  const glide=(k,to)=>{const from=k==='A'?S.A:S.lam;Art.tween({from,to,dur:260,ease:'outCubic',step:v=>{if(k==='A')S.A=v;else S.lam=v;},done:()=>settle(k)});};
  let drag=null;
  svg.addEventListener('pointerdown',e=>{
    if(!wvCan(G)||G.st!==S)return;const p=pt(e),tg=e.target.closest?e.target:null;
    if(R.t==='pred'){const onM=p.x>WV.MX-60&&p.x<WV.MX+40&&p.y>WV.MT-14&&p.y<WV.MB+14;if(!onM)return;e.preventDefault();drag={k:'P',pid:e.pointerId};wvPv(G,p);try{svg.setPointerCapture(e.pointerId);}catch(_){}return;}
    let k=null;
    if(tg&&tg.closest('.wvak'))k='A';else if(tg&&tg.closest('.wvlk'))k='L';
    else if(E.kn.includes('L')&&p.y>WV.RY-24&&p.y<WV.RY+34&&p.x>WV.X0-14&&p.x<WV.X1+14)k='L';
    else if(E.kn.includes('A')&&((p.x>WV.X0&&p.x<WV.X1&&p.y>WV.GT-10&&p.y<WV.GB+10)||(Math.abs(p.x-WV.AX)<20&&p.y<WV.MID+10)))k='A';
    if(!k)return;e.preventDefault();drag={k,pid:e.pointerId,moved:false,x0:e.clientX,y0:e.clientY,p,onKnob:!!(tg&&tg.closest('.wvknob'))};
    svg.classList.add('wvdragging');try{svg.setPointerCapture(e.pointerId);}catch(_){}});
  svg.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pid)return;const p=pt(e);
    if(drag.k==='P'){wvPv(G,p);return;}
    if(!drag.moved&&Math.hypot(e.clientX-drag.x0,e.clientY-drag.y0)>3)drag.moved=true;if(!drag.moved)return;
    S.drag=drag.k;if(drag.k==='A')S.A=aOf(p);else S.lam=lOf(p);});
  const up=e=>{if(!drag||e.pointerId!==drag.pid)return;const d=drag;drag=null;svg.classList.remove('wvdragging');
    if(d.k==='P'){ngRender();return;}
    if(!d.moved&&!d.onKnob){glide(d.k,d.k==='A'?wvSnapA(aOf(d.p)):wvSnapL(lOf(d.p)));return;}
    settle(d.k);};
  svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
  svg.addEventListener('keydown',e=>{
    const t=e.target;if(!wvCan(G)||G.st!==S)return;
    if(t.closest&&t.closest('.wvlane')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();wvPick(+t.closest('.wvlane').dataset.i);return;}
    if(e.key==='Enter'&&t.closest&&(t.closest('.wvknob')||t.closest('.wvpm'))){e.preventDefault();wvSend();return;}
    const up=e.key==='ArrowUp'||e.key==='ArrowRight',dn=e.key==='ArrowDown'||e.key==='ArrowLeft';if(!up&&!dn)return;
    if(t.closest&&t.closest('.wvpm')){e.preventDefault();S.pv=Math.max(1,Math.min(25,S.pv+(up?1:-1)));wvDraw(G);ngRender();const m=E.svg.querySelector('.wvpm');if(m)m.focus();return;}
    const k=t.closest&&t.closest('.wvak')?'A':t.closest&&t.closest('.wvlk')?'L':null;if(!k)return;e.preventDefault();
    if(k==='A')glide('A',Math.max(1,Math.min(5,wvSnapA(S.A)+(up?1:-1))));else glide('L',Math.max(5,Math.min(40,wvSnapL(S.lam)+(up?5:-5))));});
  E.lanesEl.forEach((ln,i)=>ln.g.addEventListener('click',()=>{if(wvCan(G)&&G.st===S)wvPick(i);}));
}
function wvPv(G,p){const S=G.st,v=Math.max(1,Math.min(25,Math.round((WV.MB-p.y)/(WV.MB-WV.MT)*WV.MMAX)));if(v!==S.pv){S.pv=v;S.touched=true;}}
function wvLive(G){const S=G.st,R=S.el.R,A=wvSnapA(S.A),lam=wvSnapL(S.lam);
  if(R.t==='meas')return `Your knobs: amplitude **${A} cm**, wavelength **${lam} cm**. Press **Send** to check against the snapshot.`;
  if(R.t==='tune')return A===R.A&&lam===R.lam?'Looks like a match. Press **Send**.':'Line your wave up with the white ghost wave.';
  return `Amplitude **${A} cm**, wavelength **${lam} cm**. Press **Send** when you are sure.`;}

/* ---------------- checking ---------------- */
function wvJudge(G){
  const S=G.st,R=S.el.R,A=wvSnapA(S.A),lam=wvSnapL(S.lam);let ok=false,why='',key=A+'|'+lam;
  const aW=d=>d>0?`Your crest is **${d} cm too high**.`:`Your crest is **${-d} cm too low**.`;
  const lW=(mine,want)=>mine>want?`Your waves are **too long**: your crests are ${mine} cm apart, but the target’s are ${want} cm apart.`:`Your waves are **too short**: your crests are ${mine} cm apart, but the target’s are ${want} cm apart.`;
  if(R.t==='tune'){const oa=A===R.A,ol=lam===R.lam;ok=oa&&ol;
    why=ok?`Matched! Amplitude **${R.A} cm**, wavelength **${R.lam} cm**.`:!oa&&!ol?aW(A-R.A)+' '+lW(lam,R.lam):!oa?aW(A-R.A):lW(lam,R.lam);}
  else if(R.t==='meas'){
    const askA=R.ask.includes('A'),askL=R.ask.includes('L'),oa=!askA||A===R.A,ol=!askL||lam===R.lam;ok=oa&&ol;key=(askA?A:'')+'|'+(askL?lam:'');
    const wa=A===R.A*2?'You measured from the bottom of a trough to the top of a crest. Amplitude is only from the **middle line** to the crest.':`You set **${A} cm**, but the crest is **${R.A>A?'higher':'lower'}** than that. Count the squares from the middle line to the top of a crest.`;
    const wl=lam*2===R.lam?'That is only half a wave (crest to trough). Measure **crest to crest**.':lam===R.lam*2?'That is two whole waves. Measure from one crest to the **very next** crest.':R.lam===5||R.ask==='L'&&G.i===7?`Count the complete waves in the 40 cm screen, then divide. 40 ÷ ${Math.round(40/R.lam)} = ${R.lam}… check your count.`:`Your crests are ${lam} cm apart, but the snapshot’s are ${R.lam>lam?'farther':'closer'} together. Find two crests next to each other and read the ruler.`;
    why=ok?(askA&&askL?`Yes: amplitude **${R.A} cm**, wavelength **${R.lam} cm**. Your wave lands right on the snapshot.`:askA?`Yes: **${R.A} cm** from the middle line to the crest.`:`Yes: the crests are **${R.lam} cm** apart.`+(E_st(R)?' Station locked in!':''))
      :!oa&&!ol?'Both measurements are off. '+wa+' '+wl:!oa?(askL?'The wavelength is right, but the amplitude is off. ':'')+wa:(askA?'The amplitude is right, but the wavelength is off. ':'')+wl;}
  else if(R.t==='e4'){ok=A===R.ans;const e=wvEU(A),e0=wvEU(R.A);
    why=ok?`Yes: ${R.A} × 2 = **${R.ans} cm**. Twice the amplitude gives 2 × 2 = **4 times** the energy (${e0} → ${e} units). The castle falls!`
      :A===R.A*4?`That is **${e} units**: 16 times the energy! Energy grows with amplitude × amplitude.`
      :e>e0*4?`That is **${e} units**, more than 4 times ${e0}. Energy grows with amplitude × amplitude, so you need less amplitude than you think.`
      :`That is only **${e} units**. The castle needs 4 × ${e0} = **${e0*4} units**. What amplitude, times itself, gives ${e0*4}?`;
    key=String(A);}
  else if(R.t==='pred'){const v=S.pv;ok=v===R.ans;key=String(v);
    why=ok?'Yes! **4 units**. Double the amplitude, and the energy is 2 × 2 = 4 times as much.':v===2?'The energy did not just double. Energy grows with amplitude × amplitude: 2 × 2 = **4 units**.':`The meter filled to **4 units**, not ${v}. The new wave is 2 cm tall: 2 × 2 = 4.`;}
  else if(R.t==='snd'){
    if(R.need==='loud'){const ol=lam===R.lam;ok=ol&&A>=4;
      why=ok?`A shout! The amplitude went from ${R.A} cm to **${A} cm**, so the sound carries ${wvEU(A)} times the energy. The pitch stayed the same, because the wavelength did not change.`
        :!ol?'You changed the **wavelength**, so the **pitch** changed. Loudness comes from amplitude. Put the wavelength back to 20 cm.':A<=R.A?'That is not any louder. A louder sound has a taller wave (more energy).':'Louder, but not a shout yet. The meter has to reach the gold line.';}
    else{const oa=A===R.A;ok=oa&&lam<R.lam;
      why=ok?`A higher note! Shorter waves (${lam} cm) mean more waves each second: **${wvFtxt(wvF(lam))} per second** instead of ${wvFtxt(wvF(R.lam))}. Same loudness, because the amplitude stayed ${R.A} cm.`
        :lam>R.lam?`Longer waves mean **fewer** waves each second, so that is a **lower** note.`:lam===R.lam&&!oa?'You changed the **amplitude**: that changes loudness, not pitch.':lam===R.lam?'The wave is the same, so the note is the same. Pitch comes from frequency.':`The pitch went up, but you also changed the loudness. Keep the amplitude at ${R.A} cm.`;}}
  else if(R.t==='glass'){const ol=lam===R.lam;ok=ol&&A>=R.minA;
    why=ok?`Smash! Your wave matched the glass’s own note (**${R.lam} cm**) and carried enough energy (**${wvEU(A)} units**) to shake it apart.`
      :!ol?`Wrong note. The glass only shakes hard at its **own** note: line your wave up with the pink ghost wave.`:'Right note! The glass hums, but it needs more energy. Make the wave taller.';}
  else if(R.t==='freq'){ok=lam===R.ans;key=String(lam);
    why=ok?`Yes: 40 ÷ ${R.f} = **${R.ans} cm**. Exactly ${R.f} wave${R.f>1?'s':''} passed the post in 1 second.`
      :`With ${lam} cm waves, **${wvFtxt(wvF(lam))}** waves pass each second (40 ÷ ${lam}). You need ${R.f}. ${wvF(lam)>R.f?'Make the waves longer.':'Make the waves shorter.'}`;}
  return {ok,why,key};
}
function E_st(R){return !!(R&&R.title&&/Station|station/.test(R.title));}
function wvSend(){
  if(!G||G.key!=='waves')return;const S=G.st,E=S.el;if(!E||!wvCan(G))return;const R=E.R;if(R.t==='pick')return;
  const J=wvJudge(G);
  if(ngT())return ngTAns(J.ok,wvNext);
  S.busy=true;wvStatic(G);ngRender();
  const reveal=R.t!=='tune';
  if(reveal){S.shown=true;S.front=0;}
  const finish=()=>{S.front=1;
    if(R.t==='freq'){S.count={n:0,p:0};const T=Art.tween({from:0,to:1,dur:2500,ease:'linear',step:v=>{S.count.p=v;},done:()=>{S.count.n=wvF(wvSnapL(S.lam));S.count.p=1;wvResult(G,J);}});void T;return;}
    if(E.meter&&(R.t==='e4'||R.t==='snd'||R.t==='glass'||R.t==='pred')){const to=R.t==='pred'?wvEU(R.A1):wvEU(wvSnapA(S.A));S.mv=0;
      Art.tween({from:0,to,dur:700,ease:'outCubic',step:v=>{S.mv=v;},done:()=>{S.mv=to;wvResult(G,J);}});return;}
    wvResult(G,J);};
  if(reveal&&R.t!=='freq')Art.tween({from:0,to:1,dur:R.t==='pred'?10:900,ease:'linear',step:v=>{S.front=v;},done:finish});
  else if(R.t==='freq'){S.front=1;finish();}
  else setTimeout(finish,150);
}
function wvPick(i){
  if(!G||G.key!=='waves')return;const S=G.st,E=S.el,R=E.R;if(!wvCan(G)||R.t!=='pick')return;
  if(S.wrong.includes(i))return;S.pick=i;const ok=i===R.ans;
  if(ngT())return ngTAns(ok,wvNext);
  S.busy=true;E.lanesEl.forEach((ln,k)=>{ln.hl.setAttribute('opacity',k===i?'1':'0');ln.hl.setAttribute('stroke',k===i?'#ffd23f':'#ffd23f');});
  ngRender();
  const vals=R.waves.map(([A,lam])=>R.kind==='energy'?wvEU(A):wvF(lam));
  Art.tween({from:0,to:1,dur:900,ease:'outCubic',step:v=>{E.lanesEl.forEach((ln,k)=>{if(R.kind==='energy'){ln.bar.setAttribute('width',(70*Math.min(1,vals[k]*v/WV.MMAX)).toFixed(1));ln.v.textContent=wvFtxt(Math.round(vals[k]*v*10)/10);}else ln.v.textContent=wvFtxt(Math.round(vals[k]*v*10)/10)+' / s';});},
    done:()=>{E.lanesEl.forEach((ln,k)=>{if(R.kind==='energy'){ln.v.textContent=vals[k]+' u';}else ln.v.textContent=wvFtxt(vals[k])+' / s';});
      if(R.kind==='energy'){const big=vals.indexOf(Math.max(...vals)),c=E.lanesEl[big].castle;if(c){c.classList.add('fall');Art.burstAt(c,{n:14,colors:['#f6d89a','#d9a95a','#fff'],shape:['dot']});}}
      const why=ok?R.why:R.kind==='energy'?`Look at the meters: wave ${'ABC'[R.ans]} is the tallest, so it carries the most energy (${vals[R.ans]} units). Energy grows with amplitude × amplitude.`:`Look at the counters: wave ${'ABC'[R.ans]} has shorter waves, so more of them pass each second (${wvFtxt(vals[R.ans])} per second).`;
      wvResult(G,{ok,why,key:String(i),lane:i});}});
}
function wvResult(G,J){
  const S=G.st,E=S.el,R=E.R;if(!G||G.st!==S)return;S.busy=false;S.res={ok:J.ok};
  if(J.ok){S.okNow=true;S.msg=['ok',J.why];fx.pop({icon:'wave',text:pick(['Tuned!','Correct!','Nailed it!']),kind:'good'});
    const tg=E.svg.querySelector('.wvcastle:not(.fall)'),gl=E.svg.querySelector('.wvglass');
    if(R.t==='e4'&&tg){tg.classList.add('fall');Art.burstAt(tg,{n:16,colors:['#f6d89a','#d9a95a','#fff'],shape:['dot']});}
    else if(R.t==='glass'&&gl){gl.classList.add('shatter');Art.burstAt(gl,{n:18,colors:['#fff','#ffd0f2','#ff8ad8'],shape:['star','dot']});}
    else if(E.kind==='radio'){if(E.lamp){E.lamp.setAttribute('fill','#3dff8a');E.lamp.classList.add('art-glow');}Art.burstAt(E.lamp||E.svg,{n:12,colors:['#7dffb2','#fff','#ffd23f'],shape:['star']});}
    else Art.burstAt(E.ak||E.lk||E.svg,{n:12,colors:['#ffd23f','#fff','#59d6ff'],shape:['star','dot']});
    ngRender();ngSay(J.why,'go');}
  else{if(!S.tried.includes(J.key)){S.tried.push(J.key);G.miss++;}G.tries++;
    if(R.t==='pick')S.wrong.push(J.lane);
    S.msg=['no',J.why];fx.pop({icon:'wave',text:'Not quite',kind:'oops'});
    if(R.t==='glass'&&E.svg.querySelector('.wvglass')){const gl=E.svg.querySelector('.wvglass');gl.classList.remove('hum');void gl.getBBox();gl.classList.add('hum');}
    if(E.kind==='radio'&&E.stat){E.stat.setAttribute('opacity','1');setTimeout(()=>{if(E.stat)E.stat.setAttribute('opacity','0');},1600);}
    Art.shake(E.svg);ngRender();ngSay(J.why,'alert');
    /* let them try again: after a moment hide what the send revealed, so they re-measure or re-predict */
    if(R.t!=='pick'){const s0=S;setTimeout(()=>{if(!G||G.st!==s0||s0.okNow||G.done||s0.el!==E||s0.busy)return;
      s0.res=null;s0.mv=null;s0.count=null;if(R.t!=='tune')s0.shown=false;if(E.clock)E.clock.setAttribute('opacity','0');wvStatic(G);},R.t==='meas'?2600:2200);}
    else{E.lanesEl.forEach(ln=>{ln.hl.setAttribute('opacity','0');});}}
  wvStatic(G);
}
function wvRound(G){
  const S=G.st,R=G.L.rounds[S.r];if(!R)return;
  Object.assign(S,{okNow:false,msg:null,busy:false,tried:[],wrong:[],pick:null,res:null,shown:false,front:1,mv:null,count:null,drag:null,pv:1,el:null,t:0,
    phi:R.t==='meas'?((S.r*37+G.i*13)%10+3)*WV.CM*(R.lam>=15?.35:.2):0});
  let A=1,lam=20;
  if(R.t==='tune'){[A,lam]=R.start||[R.A>=3?1:5,R.lam>=25?10:40];if(!R.knobs.includes('A'))A=R.A;if(!R.knobs.includes('L'))lam=R.lam;}
  else if(R.t==='meas'){A=R.ask.includes('A')?(R.A>=3?1:5):R.A;lam=R.ask.includes('L')?(R.lam>=25?5:40):R.lam;}
  else if(R.t==='e4'){A=R.A;lam=R.lam;}
  else if(R.t==='snd'){A=R.A;lam=R.lam;}
  else if(R.t==='glass'){A=1;lam=30;}
  else if(R.t==='freq'){A=2;lam=30;}
  else if(R.t==='pred'){A=R.A1;lam=20;}
  S.A=A;S.lam=lam;
}
function wvNext(){const S=G.st;S.r++;
  if(S.r>=G.L.rounds.length){S.r--;S.okNow=true;S.finished=true;G.detail={mistakes:G.miss};ngWin(ngStars(G.miss,0,2),['You finished with ',h('b',null,G.miss),` mistake${G.miss===1?'':'s'}.`]);if(!ngT())ngRender();return;}
  wvRound(G);ngRender();
  if(!ngT()){const k=S.el&&(S.el.ak||S.el.lk);if(k&&document.activeElement&&document.activeElement.closest&&document.activeElement.closest('#ngSide'))k.focus({preventScroll:true});}}

/* ---------------- side panel ---------------- */
function wvTask(G,R){
  const card=(icon,title,small)=>h('div',{class:'mwtask wvtask'},h('span',{class:'mwflag wvflag'},icon),h('div',null,h('b',null,title),h('small',null,...ngRich(small))));
  if(R.t==='tune')return card('≈','Match the ghost wave',R.knobs==='A'?'Drag the wave (or the gold **crest knob**) up or down until it lines up with the dashed white wave.':'Use the **crest knob** for height and the **λ knob** for spacing. Line up with the dashed white wave.');
  if(R.t==='meas'){const what=R.ask==='A'?'amplitude':R.ask==='L'?'wavelength':'amplitude and wavelength';
    return card('cm',R.title||'Measure the snapshot',`Your wave is hidden. Measure the **${what}** on the grid, set the knob${R.ask==='AL'?'s':''} to your measurement, then **Send** your wave on top.`);}
  if(R.t==='e4')return card('4×','Knock down the castle',`This wave is **${R.A} cm** tall (${wvEU(R.A)} energy unit${R.A>1?'s':''}). The castle needs a wave with **4 times the energy**. Set the amplitude. The meter stays hidden until it hits.`);
  if(R.t==='pick')return card(R.kind==='energy'?'E':'f',R.q,'Tap a wave. Then watch the '+(R.kind==='energy'?'energy meters fill.':'wave counters.'));
  if(R.t==='pred')return card('?','Predict the energy meter','The new wave is **2 cm** tall. The dashed one was **1 cm** (1 unit). Drag the gold marker to where the meter will fill.');
  if(R.t==='snd')return R.need==='loud'?card('dB','Make it a shout','Turn this quiet sound into a **shout**, but keep the **same note**. The meters stay hidden until you play it.')
    :card('♪','Sing a higher note','Make the note **higher**, at the **same loudness**. The meters stay hidden until you play it.');
  if(R.t==='glass')return card('♪','Shatter the glass','The glass rings at its own note (the **pink ghost wave**). Match its note, then give your wave enough energy to reach the **shatter** line.');
  if(R.t==='freq')return card('f',`Shake it ${R.f} time${R.f>1?'s':''} per second`,`Waves on this rope always travel **40 cm each second**. Set the wavelength so exactly **${R.f}** wave${R.f>1?'s':''} pass the post each second.`);
  return null;
}
function wvSide(G){
  const L=G.L,S=G.st,R=L.rounds[S.r];
  const prog=h('div',{class:'ppsteps'},...L.rounds.map((Q,k)=>h('span',{class:'ppst'+(k<S.r||(k===S.r&&S.okNow)?' ok':k===S.r?' on':'')},'Round '+(k+1))));
  if(!R||S.finished)return [prog,h('div',{class:'ppdone'},'✓ All rounds done!')];
  const kids=[prog,wvTask(G,R)];
  if(R.t!=='pick'&&!S.okNow){const lab=R.t==='snd'||R.t==='glass'?'Play the sound':R.t==='pred'?'Fill the meter':R.t==='freq'?'Shake the rope':R.t==='e4'?'Send the wave':R.t==='meas'?'Send my wave':'Send the wave';
    kids.push(ngBtn([I('play'),' ',lab],wvSend,'good wvsend',{style:'width:100%;font-size:18px',disabled:G.done||S.busy}));
    if(!ngT())kids.push(h('p',{class:'mwkeys'},R.t==='pred'?'Tip: drag the gold marker, or tap it and use ↑ ↓.':'Tip: drag the gold knobs, or tap one and use the arrow keys. Enter sends.'));}
  if(S.msg)kids.push(h('div',{class:'ppmsg '+S.msg[0]},...ngRich(S.msg[1])));
  if(S.okNow)kids.push(ngBtn(S.r+1<L.rounds.length?'Next round ▶':'Finish ▶',wvNext,'good',{style:'width:100%;margin-top:6px'}));
  return kids;
}

ngDef({key:'waves',name:'Wave Tuner',ic:'wave',std:'MS-PS4-1',subj:'phys',cap3:true,winDelay:700,
  short:'Tune waves by hand and connect amplitude to energy.',menuDesc:'Drag a wave’s crest and spacing to tune radios, knock down sand castles and shatter a glass. Measure amplitude and wavelength, and link them to energy and frequency.',
  intro:'Waves carry energy. Drag the wave to tune it: the **crest knob** sets the amplitude and the **λ knob** sets the wavelength. Measure snapshots, knock down sand castles, change sounds and shatter a glass. No mistakes earns 3 stars.',
  how:['**Drag** the gold knobs (or the wave itself) to change the wave.','**Measure** snapshots on the 1 cm grid, then **Send** your wave on top to check.','Energy grows with amplitude × amplitude. On the same rope, shorter waves mean a higher frequency.'],
  levels:WV_LEVELS,packs:WV_PACKS,
  mini:L=>{const R=L.rounds[0],A=R.A||R.A1||(R.waves?R.waves[0][0]:2),lam=R.lam||R.ans||20;let d='';for(let x=0;x<=40;x+=1)d+=(x?'L':'M')+(2+x)+' '+(15-Math.min(5,A)*2.2*Math.sin(2*Math.PI*x/lam)).toFixed(1);return svgEl(`<svg viewBox="0 0 44 30" width="48" height="32" aria-hidden="true"><rect width="44" height="30" rx="4" fill="#0d2233"/><path d="${d}" fill="none" stroke="#4fd1ff" stroke-width="2"/></svg>`);},
  start(G){G.st={r:0};wvRound(G);},
  hud(G){return {label:'Mistakes',val:G.miss,target:'3 ★ = no mistakes'};},
  render(G,main,side){
    const S=G.st;
    if(!S.el||S.el.r!==S.r||!S.el.svg.isConnected){const b=wvBuild(G);
      ngRC(main,h('div',{class:'wvwrap'},b),h('div',{class:'fgkey'},S.el.lanes?'Tap a wave (or press Tab, then Enter).':S.el.R.t==='pred'?'Drag the gold marker on the energy meter.':'Each small square is 1 cm. Gold knobs: drag them, or tap one and use the arrow keys.'));}
    else wvStatic(G);
    ngRC(side,...wvSide(G));
    if(!S.msg&&!S.okNow&&!S.busy)ngSay(S.touched?wvLive(G):S.el.R.t==='pick'?'Look at the wave heights, then tap one.':'Drag the gold knobs to tune your wave.');
  },
  hints(G){const L=G.L,R=L.rounds[G.st.r]||L.rounds[0];
    const big=R.t==='tune'||R.t==='meas'?(R.t==='meas'&&R.ask==='A'?`The amplitude is ${R.A} cm.`:R.t==='meas'&&R.ask==='L'?`The wavelength is ${R.lam} cm.`:`Amplitude ${R.A} cm, wavelength ${R.lam} cm.`)
      :R.t==='e4'?`Set the amplitude to ${R.ans} cm.`:R.t==='freq'?`40 ÷ ${R.f} = ${R.ans} cm.`:R.t==='pick'?`Wave ${'ABC'[R.ans]}.`:R.t==='pred'?'The meter fills to 4 units.'
      :R.t==='snd'?(R.need==='loud'?'Keep the wavelength at 20 cm. Raise the amplitude to 4 or 5 cm.':`Keep the amplitude at ${R.A} cm. Make the wavelength shorter, like 10 cm.`):`Wavelength ${R.lam} cm, amplitude ${R.minA} cm or more.`;
    return [L.clue,'Amplitude = middle line to crest. Wavelength = crest to crest. Energy grows with amplitude × amplitude. Same rope: speed = frequency × wavelength.',big+' Look for the gold ring.'];}
});
NGTHUMB.waves=()=>{
  let d='',f='';for(let x=0;x<=320;x+=4){const y=(100-34*Math.sin((x-20)/320*4*Math.PI)).toFixed(1);d+=(x?'L':'M')+x+' '+y;}
  f=d+'L320 180L0 180Z';let dg='';for(let x=0;x<=320;x+=4)dg+=(x?'L':'M')+x+' '+(100-18*Math.sin((x-20)/320*8*Math.PI)).toFixed(1);
  const t=`<defs><linearGradient id="tws" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8ff"/><stop offset="1" stop-color="#dff2ff"/></linearGradient><linearGradient id="tww" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3fb4f0"/><stop offset="1" stop-color="#0a3f75"/></linearGradient></defs>
<rect width="320" height="180" fill="url(#tws)"/><circle cx="270" cy="34" r="22" fill="#fff6c8" opacity=".9"/><path d="${f}" fill="url(#tww)"/><path d="${d}" fill="none" stroke="#e8f7ff" stroke-width="3"/>
<path d="${dg}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="8 6" opacity=".9"/>
<g transform="translate(238 104)"><path d="M-22 0V-20h5v-4h4v4h4v-4h4v4h5V0z" fill="#f2cf8a"/><path d="M-6 0V-30h4v-4h4v4h4V0z" fill="#e8bd6c"/><path d="M0 -34v-10l9 3-9 3" fill="#ef476f"/></g>
<circle cx="80" cy="66" r="11" fill="#ffd23f" stroke="#7a5200" stroke-width="2"/><path d="M76 64l4-4 4 4M76 69l4 4 4-4" stroke="#7a5200" stroke-width="1.8" fill="none"/>`+ngStar(30,24,8);
  return ngWrap('waves','#0d2233',t);
};
