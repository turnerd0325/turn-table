/* ================= PHYSICS 4: WAVE TUNER (MS-PS4-1) =================
   Read waves off a grid: amplitude, wavelength and frequency. Measure first, THEN check by
   overlaying your wave on the target (no live dragging to match). Energy grows with amplitude;
   on the same rope, a faster shake makes shorter waves. */
const WV_CM=12,WV_AY=18,WV_W=504,WV_H=230,WV_MID=115,WV_X0=14;
const WVR={amp:(A,lam)=>({t:'amp',A,lam}),lam:(A,lam)=>({t:'lam',A,lam}),both:(A,lam)=>({t:'both',A,lam}),
  pick:(q,waves,ans,why)=>({t:'pick',q,waves,ans,why}),mc:(q,opts,ans,why)=>({t:'mc',q,opts,ans,why}),
  freq:(f,ans)=>({t:'freq',f,ans}),e4:(A,lam,ans)=>({t:'e4',A,lam,ans})};
const WV_AOPT=[1,2,3,4,5].map(n=>[n,n+' cm']),WV_LOPT=[5,10,15,20,40].map(n=>[n,n+' cm']);
const WVL=(name,story,rounds,o)=>Object.assign({name,story,rounds},o);
const WV_LEVELS=[
  WVL('Amplitude','Measure how tall each wave is.',[WVR.amp(3,20),WVR.amp(1,10),WVR.amp(4,40)],{
    intro:'**Amplitude** is the height from the **middle line** to the top of a crest. Each grid square is 1 cm. Measure, then press **Check**.',
    fact:'Amplitude is measured from the rest position (the middle line) to the crest, not from the bottom of a trough to the top of a crest.',
    clue:'Count the squares from the middle line up to the very top of a crest. Do not count all the way down to the trough.'}),
  WVL('Wavelength','Measure how long each wave is.',[WVR.lam(2,20),WVR.lam(3,10),WVR.lam(2,15)],{
    intro:'**Wavelength** is the distance from one crest to the next crest. Each grid square is 1 cm wide; the numbers along the bottom count every 5 cm.',
    fact:'Wavelength can be measured from any point on a wave to the same point on the next wave: crest to crest, or trough to trough.',
    clue:'Find two crests next to each other. How far apart are they?'}),
  WVL('Read Both','Measure the amplitude AND the wavelength.',[WVR.both(2,10),WVR.both(4,20),WVR.both(1,40)],{
    fact:'Scientists describe a wave with numbers: its amplitude, wavelength, frequency and speed. Two waves with the same numbers behave the same way.',
    clue:'Measure up from the middle for amplitude. Measure across from crest to crest for wavelength.'}),
  WVL('Bigger Wave','Which wave carries more energy?',[
      WVR.pick('Which ocean wave carries more energy?',[[2,20],[4,20]],1,'The wave with the bigger amplitude carries more energy.'),
      WVR.pick('Which wave carries more energy?',[[3,10],[1,10]],0,'Bigger amplitude, more energy. That is why taller ocean waves can knock you over.'),
      WVR.mc('If you double the amplitude of a wave, what happens to its energy?',[['4','It becomes 4 times as much.'],['2','It doubles.'],['same','It stays the same.']],'4','Wave energy depends on the amplitude squared: 2 × 2 = 4 times the energy.')],{
    fact:'The energy carried by a wave grows with the square of its amplitude. Double the amplitude, and the wave carries four times the energy.',
    clue:'Taller waves are more powerful. Compare the heights.'}),
  WVL('Energy Ladder','Use amplitude to control energy.',[
      WVR.e4(1,20,2),WVR.e4(2,10,4),
      WVR.pick('Which of these waves carries the MOST energy?',[[2,10],[3,20],[1,40]],1,'The 3 cm wave has the biggest amplitude, so it carries the most energy.')],{
    intro:'Each round shows a wave. Set the amplitude of a new wave that carries **4 times the energy**.',
    fact:'Because energy grows with amplitude squared, a little more amplitude means a lot more energy. Earthquake waves with bigger amplitudes do much more damage.',
    clue:'4 times the energy needs 2 times the amplitude (because 2 × 2 = 4).'}),
  WVL('Sound Waves','Sound is a wave too.',[
      WVR.mc('You turn up the volume on a speaker. What changes about the sound wave?',[['amp','Its amplitude gets bigger.'],['lam','Its wavelength gets longer.'],['speed','It travels faster.']],'amp','Louder sounds have bigger amplitudes and carry more energy.'),
      WVR.mc('A singer sings a higher note. What changes about the sound wave?',[['freq','Its frequency gets higher (more waves each second).'],['amp','Its amplitude gets bigger.'],['slow','It moves more slowly.']],'freq','Pitch depends on frequency. A higher pitch means more vibrations each second.'),
      WVR.mc('You pluck a guitar string harder. What happens?',[['loud','The sound is louder, because the amplitude is bigger.'],['high','The note is higher.'],['nothing','Nothing changes.']],'loud','Plucking harder gives the string more energy, so it vibrates with a bigger amplitude and sounds louder. The pitch stays the same.')],{
    fact:'Loudness is about amplitude (energy). Pitch is about frequency. A whisper and a shout can be the same note.',
    clue:'Volume = amplitude. Pitch = frequency.'}),
  WVL('Faster Shake','You shake a long rope. The waves always travel at 40 cm per second on this rope.',[WVR.freq(1,40),WVR.freq(2,20),WVR.freq(4,10)],{
    intro:'**Frequency** is how many waves pass each second. On the same rope, waves move at the same speed: **speed = frequency × wavelength**.',
    fact:'On the same rope (or in the same material), wave speed stays the same. Shake faster (higher frequency), and the wavelength gets shorter.',
    clue:'40 cm per second. If 2 waves pass each second, how long is each wave?'}),
  WVL('Count the Waves','Count complete waves to find the wavelength.',[WVR.lam(3,10),WVR.both(2,5),WVR.lam(4,40)],{
    fact:'If 4 complete waves fit in 40 cm, each wave is 40 ÷ 4 = 10 cm long. Counting waves is a quick way to measure wavelength.',
    clue:'Count how many complete waves fit in the 40 cm window, then divide.'}),
  WVL('Wave Master','A mix of everything.',[WVR.both(3,15),WVR.e4(2,20,4),WVR.freq(2,20),
      WVR.mc('Two waves have the same amplitude. Wave A has a longer wavelength than wave B on the same rope. Which has the higher frequency?',[['B','Wave B'],['A','Wave A'],['same','Same frequency']],'B','Same rope means same speed. Shorter wavelength means more waves pass each second: a higher frequency.')],{
    fact:'Waves of light, sound and water all share these properties. Engineers use them to design everything from speakers to cell phones.',
    clue:'Amplitude: up from the middle. Wavelength: crest to crest. Same rope: higher frequency, shorter wavelength.'})
];
const WV_PACKS={0:'Pack 1: Read the wave',3:'Pack 2: Energy and sound',6:'Pack 3: Frequency'};
function wvPath(A,lam,phase){let d='';for(let x=0;x<=40.01;x+=0.25){const y=WV_MID-A*WV_AY*Math.sin(2*Math.PI*(x/lam)+(phase||0));d+=(x?'L':'M')+(WV_X0+x*WV_CM).toFixed(1)+' '+y.toFixed(1);}return d;}
function wvGrid(rounds){let t=`<rect width="${WV_W}" height="${WV_H}" fill="#0d2233"/>`;
  for(let x=0;x<=40;x++)t+=`<line x1="${WV_X0+x*WV_CM}" y1="10" x2="${WV_X0+x*WV_CM}" y2="${WV_H-20}" stroke="#1f4a6a" stroke-width="${x%5?0.6:1.4}"/>`;
  for(let k=-5;k<=5;k++)t+=`<line x1="${WV_X0}" y1="${WV_MID-k*WV_AY}" x2="${WV_X0+40*WV_CM}" y2="${WV_MID-k*WV_AY}" stroke="#1f4a6a" stroke-width="${k?0.6:2}"/>`;
  for(let x=0;x<=40;x+=5)t+=`<text x="${WV_X0+x*WV_CM}" y="${WV_H-5}" text-anchor="middle" font-size="11" fill="#7fb6dd" font-weight="700">${x}</text>`;
  t+=`<text x="${WV_W-4}" y="${WV_MID-4}" text-anchor="end" font-size="10" fill="#7fb6dd">middle line</text>`;void rounds;return t;}
function wvBoard(G){
  const L=G.L,S=G.st,R=L.rounds[S.r]||L.rounds[L.rounds.length-1];let t=wvGrid();
  if(R.t==='pick'){const n=R.waves.length;t='';
    R.waves.forEach(([A,lam],i)=>{const y0=i*(WV_H/n),hh=WV_H/n,mid=y0+hh/2,sc=hh/2/6;let d='';for(let x=0;x<=40.01;x+=.25){d+=(x?'L':'M')+(WV_X0+x*WV_CM).toFixed(1)+' '+(mid-A*sc*Math.sin(2*Math.PI*x/lam)).toFixed(1);}
      const pick=S.pick===i,ok=S.okNow&&i===R.ans,bad=S.wrong.includes(i);
      t+=`<g class="wvpick" data-i="${i}" role="button" tabindex="0" aria-label="Wave ${String.fromCharCode(65+i)}"><rect x="0" y="${y0}" width="${WV_W}" height="${hh}" fill="${ok?'#13402a':bad?'#40131a':pick?'#132f50':'#0d2233'}" stroke="#1f4a6a"/><line x1="${WV_X0}" x2="${WV_X0+480}" y1="${mid}" y2="${mid}" stroke="#1f4a6a"/>`+
        `<path d="${d}" fill="none" stroke="#4fd1ff" stroke-width="3"/><text x="${WV_W-10}" y="${y0+22}" text-anchor="end" font-size="16" font-weight="900" fill="#fff">${String.fromCharCode(65+i)}</text></g>`;});
    return ngSvg(WV_W,WV_H,t,'ngsvg wvsvg','Waves to compare');}
  if(R.t==='mc'){t+=`<path d="${wvPath(2,20)}" fill="none" stroke="#4fd1ff" stroke-width="3" opacity=".5"/>`;return ngSvg(WV_W,WV_H,t,'ngsvg wvsvg','A wave');}
  if(R.t==='freq'){t+=S.okNow?`<path d="${wvPath(2,R.ans)}" fill="none" stroke="#4fd1ff" stroke-width="3.5"/>`:`<text x="${WV_W/2}" y="${WV_MID-30}" text-anchor="middle" font-size="18" font-weight="900" fill="#ffd34d">${R.f} wave${R.f>1?'s':''} pass each second</text><text x="${WV_W/2}" y="${WV_MID}" text-anchor="middle" font-size="14" fill="#cfe8ff">speed = 40 cm per second</text>`;
    if(S.tryLam)t+=`<path d="${wvPath(2,S.tryLam)}" fill="none" stroke="${S.okNow?'#7df0b0':'#ff8a8a'}" stroke-width="3" opacity=".9" stroke-dasharray="${S.okNow?'':'7 5'}"/>`;
    return ngSvg(WV_W,WV_H,t,'ngsvg wvsvg','The rope');}
  t+=`<path d="${wvPath(R.A,R.lam)}" fill="none" stroke="#4fd1ff" stroke-width="3.5" ${R.t==='e4'?'':'stroke-dasharray="9 6"'}/>`;
  if(S.try){const [A,lam]=S.try;t+=`<path d="${wvPath(A,lam)}" fill="none" stroke="${S.okNow?'#7df0b0':'#ffd34d'}" stroke-width="3" opacity=".95"/>`;}
  return ngSvg(WV_W,WV_H,t,'ngsvg wvsvg','The target wave on a centimeter grid');
}
function wvBox(G){
  const L=G.L,S=G.st,R=L.rounds[S.r];if(!R)return [];const lock=G.done||S.okNow;
  const pickNum=(lab,opts,key)=>[h('div',{class:'osl'},lab),ngChoices(opts,S[key],v=>{if(lock)return;S[key]=v;S.msg=null;ngRender();},{locked:lock,label:lab})];
  if(R.t==='amp')return [h('p',{class:'ppq'},'What is the amplitude of the dashed wave?'),...pickNum('Amplitude',WV_AOPT,'a'),ngBtn('Check',wvCheck,'good',{style:'width:100%;margin-top:6px',disabled:S.a==null||lock})];
  if(R.t==='lam')return [h('p',{class:'ppq'},'What is the wavelength of the dashed wave?'),...pickNum('Wavelength',WV_LOPT,'l'),ngBtn('Check',wvCheck,'good',{style:'width:100%;margin-top:6px',disabled:S.l==null||lock})];
  if(R.t==='both')return [h('p',{class:'ppq'},'Measure the dashed wave.'),...pickNum('Amplitude',WV_AOPT,'a'),...pickNum('Wavelength',WV_LOPT,'l'),ngBtn('Check',wvCheck,'good',{style:'width:100%;margin-top:6px',disabled:S.a==null||S.l==null||lock})];
  if(R.t==='e4')return [h('p',{class:'ppq'},`This wave has an amplitude of ${R.A} cm. Pick the amplitude for a wave with 4 TIMES the energy.`),...pickNum('New amplitude',WV_AOPT,'a'),ngBtn('Check',wvCheck,'good',{style:'width:100%;margin-top:6px',disabled:S.a==null||lock})];
  if(R.t==='freq')return [h('p',{class:'ppq'},`The rope carries waves at 40 cm per second. If ${R.f} wave${R.f>1?'s':''} pass each second, what is the wavelength?`),...pickNum('Wavelength',WV_LOPT,'l'),ngBtn('Check',wvCheck,'good',{style:'width:100%;margin-top:6px',disabled:S.l==null||lock})];
  if(R.t==='pick')return [h('p',{class:'ppq'},R.q+' Tap a wave.')];
  return [h('p',{class:'ppq'},R.q),h('div',{class:'ppmc'},...R.opts.map(([v,t])=>h('button',{type:'button',class:'ngc wide'+(S.wrong.includes(v)?' no':'')+(S.okNow&&v===R.ans?' ok':''),disabled:lock||S.wrong.includes(v),onclick:()=>{S.pick=v;wvCheck();}},t)))];
}
function wvCheck(){
  const L=G.L,S=G.st,R=L.rounds[S.r];if(!R||S.okNow||G.done)return;let ok=false,why='';
  if(R.t==='amp'){S.try=[S.a,R.lam];ok=S.a===R.A;why=ok?`Yes: ${R.A} cm from the middle line to the crest.`:S.a===R.A*2?'That is crest-to-trough. Amplitude is only from the MIDDLE line to the crest.':'Count the squares from the middle line to the top of a crest again.';}
  else if(R.t==='lam'){S.try=[R.A,S.l];ok=S.l===R.lam;why=ok?`Yes: crests are ${R.lam} cm apart.`:S.l===R.lam/2?'That is only half a wave (crest to trough). Measure crest to crest.':'Find two crests next to each other and read the distance on the bottom scale.';}
  else if(R.t==='both'){S.try=[S.a,S.l];const oa=S.a===R.A,ol=S.l===R.lam;ok=oa&&ol;why=ok?`Yes: amplitude ${R.A} cm, wavelength ${R.lam} cm.`:!oa&&!ol?'Both measurements are off. Look where your yellow wave is different.':!oa?'The wavelength is right, but the amplitude is off.':'The amplitude is right, but the wavelength is off.';}
  else if(R.t==='e4'){S.try=[S.a,R.lam];ok=S.a===R.ans;why=ok?`Yes: ${R.A} × 2 = ${R.ans} cm. Twice the amplitude gives 2 × 2 = 4 times the energy.`:S.a===R.A*4?'4 times the amplitude would give 16 times the energy! Energy grows with amplitude × amplitude.':'Energy grows with amplitude × amplitude. What amplitude, times itself, is 4 times bigger?';}
  else if(R.t==='freq'){S.tryLam=S.l;ok=S.l===R.ans;why=ok?`Yes: 40 ÷ ${R.f} = ${R.ans} cm.`:'Speed = frequency × wavelength, so wavelength = 40 ÷ frequency.';}
  else if(R.t==='pick'){ok=S.pick===R.ans;why=ok?R.why:'Compare the amplitudes: which wave is taller from its middle line?';}
  else{ok=S.pick===R.ans;why=R.why;}
  if(ok){S.okNow=true;S.msg=['ok',why];fx.pop({icon:'wave',text:'Correct!',kind:'good'});ngRender();ngSay(why,'go');}
  else{G.miss++;G.tries++;if(R.t==='pick'||R.t==='mc')S.wrong.push(S.pick);S.msg=['no',why];fx.pop({icon:'wave',text:'Not quite',kind:'oops'});ngRender();ngSay(why,'alert');}
}
function wvNext(){const S=G.st;S.r++;Object.assign(S,{a:null,l:null,pick:null,wrong:[],okNow:false,msg:null,try:null,tryLam:null});
  if(S.r>=G.L.rounds.length){S.r--;S.okNow=true;G.detail={mistakes:G.miss};ngWin(ngStars(G.miss,0,2),['You finished with ',h('b',null,G.miss),` mistake${G.miss===1?'':'s'}.`]);return;}ngRender();}
ngDef({key:'waves',name:'Wave Tuner',ic:'wave',std:'MS-PS4-1',subj:'phys',cap3:true,
  short:'Measure waves and connect amplitude to energy.',menuDesc:'Measure amplitude and wavelength on a grid, then use them to predict a wave’s energy and frequency.',
  intro:'Waves carry energy. Measure their amplitude and wavelength on a grid, find out how amplitude controls energy, and see how frequency and wavelength trade off on the same rope. No mistakes earns 3 stars.',
  how:['**Measure** the dashed wave using the 1 cm grid.','**Pick your answer**, then press **Check**: your wave appears on top of the target.','Energy rounds: remember energy grows with amplitude × amplitude.'],
  levels:WV_LEVELS,packs:WV_PACKS,cap3:true,
  mini:L=>{const R=L.rounds[0],A=R.A||2,lam=R.lam||R.ans||20;let d='';for(let x=0;x<=40;x+=1)d+=(x?'L':'M')+(2+x)+' '+(15-A*2.2*Math.sin(2*Math.PI*x/lam)).toFixed(1);return svgEl(`<svg viewBox="0 0 44 30" width="48" height="32" aria-hidden="true"><rect width="44" height="30" rx="4" fill="#0d2233"/><path d="${d}" fill="none" stroke="#4fd1ff" stroke-width="2"/></svg>`);},
  start(G){G.st={r:0,a:null,l:null,pick:null,wrong:[],okNow:false,msg:null,try:null,tryLam:null};},
  hud(G){return {label:'Mistakes',val:G.miss,target:'3 ★ = no mistakes'};},
  render(G,main,side){
    const L=G.L,S=G.st,b=wvBoard(G);
    b.querySelectorAll('.wvpick').forEach(el=>{const go=()=>{if(S.okNow||G.done)return;const i=+el.dataset.i;if(S.wrong.includes(i))return;S.pick=i;wvCheck();};el.addEventListener('click',go);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});});
    ngRC(main,b,h('div',{class:'fgkey'},'Each small square is 1 cm. Dashed = the wave to measure. Yellow = your answer after you check.'));
    const prog=h('div',{class:'ppsteps'},...L.rounds.map((x,k)=>h('span',{class:'ppst'+(k<S.r||(k===S.r&&S.okNow)?' ok':k===S.r?' on':'')},'Round '+(k+1))));
    ngRC(side,prog,...wvBox(G),S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null,
      S.okNow&&!G.done?ngBtn(S.r+1<L.rounds.length?'Next round ▶':'Finish ▶',wvNext,'good',{style:'width:100%;margin-top:6px'}):null);
    if(!S.msg)ngSay('Measure carefully. Each small square is 1 cm.');
  },
  hints(G){const L=G.L,R=L.rounds[G.st.r]||L.rounds[0];
    return [L.clue,'Amplitude = middle line to crest. Wavelength = crest to crest. Energy grows with amplitude × amplitude. Same rope: speed = frequency × wavelength.',
      R.t==='amp'?`The amplitude is ${R.A} cm.`:R.t==='lam'?`The wavelength is ${R.lam} cm.`:R.t==='both'?`Amplitude ${R.A} cm, wavelength ${R.lam} cm.`:R.t==='e4'?`The answer is ${R.ans} cm.`:R.t==='freq'?`40 ÷ ${R.f} = ${R.ans} cm.`:R.t==='pick'?`Wave ${String.fromCharCode(65+R.ans)}.`:'Answer: '+R.opts.find(o=>o[0]===R.ans)[1]];}
});
NGTHUMB.waves=()=>{
  let t='';for(let x=0;x<=320;x+=16)t+=`<line x1="${x}" y1="0" x2="${x}" y2="180" stroke="#1f4a6a" stroke-width="1"/>`;for(let y=10;y<=180;y+=16)t+=`<line x1="0" y1="${y}" x2="320" y2="${y}" stroke="#1f4a6a" stroke-width="1"/>`;
  let d1='',d2='';for(let x=0;x<=320;x+=2){d1+=(x?'L':'M')+x+' '+(90-50*Math.sin(x/320*4*Math.PI)).toFixed(1);d2+=(x?'L':'M')+x+' '+(90-22*Math.sin(x/320*8*Math.PI)).toFixed(1);}
  t+=`<path d="${d2}" fill="none" stroke="#ffd34d" stroke-width="4" stroke-dasharray="8 6"/><path d="${d1}" fill="none" stroke="#4fd1ff" stroke-width="6"/><path d="M80 90V40" stroke="#fff" stroke-width="3"/><path d="M74 46l6-8 6 8" fill="#fff"/>`+ngStar(296,20,8);
  return ngWrap('waves','#0d2233',t);
};
