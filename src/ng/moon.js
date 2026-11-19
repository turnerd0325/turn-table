/* ================= EARTH 1: MOONWATCH (MS-ESS1-1) =================
   A top-down model of the Sun, Earth and Moon. Predict what the Moon looks like from Earth,
   place the Moon for a phase or an eclipse, and use Earth's tilt to explain the seasons.
   Every round is a prediction from the model; every miss is explained. */
const MW_NAMES={0:'New moon',45:'Waxing crescent',90:'First quarter',135:'Waxing gibbous',180:'Full moon',225:'Waning gibbous',270:'Third quarter',315:'Waning crescent'};
const MW_ALL=[0,45,90,135,180,225,270,315],MW_KEY=[0,90,180,270];
function mwPhase(th,r,cx,cy,dark,lit){
  th=((th%360)+360)%360;let t=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${dark||'#2a2f45'}"/>`;
  if(th===0)return t+`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#5a6385" stroke-width="1.2"/>`;
  if(th===180)return t+`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${lit||'#f6efc8'}"/>`;
  const c=Math.cos(th*Math.PI/180),rx=Math.abs(c)*r,wax=th<180;
  const p=wax?`M${cx} ${cy-r}A${r} ${r} 0 0 1 ${cx} ${cy+r}A${rx} ${r} 0 0 ${c>0?0:1} ${cx} ${cy-r}Z`:`M${cx} ${cy-r}A${r} ${r} 0 0 0 ${cx} ${cy+r}A${rx} ${r} 0 0 ${c>0?1:0} ${cx} ${cy-r}Z`;
  return t+`<path d="${p}" fill="${lit||'#f6efc8'}"/>`;
}
const mwIcon=(th,s)=>svgEl(`<svg viewBox="0 0 40 40" width="${s||38}" height="${s||38}" aria-hidden="true">${mwPhase(th,17,20,20)}</svg>`);
/* round makers */
const MR={see:th=>({t:'see',th}),place:th=>({t:'place',th}),ecl:k=>({t:'ecl',k}),mc:(q,opts,ans,why,pic)=>({t:'mc',q,opts,ans,why,pic}),season:(q,ans,why)=>({t:'season',q,ans:[].concat(ans),why}),tilt:()=>({t:'tilt'})};
const MWL=(name,story,rounds,o)=>Object.assign({name,story,rounds,opts:MW_ALL},o);
const MW_LEVELS=[
  MWL('Four Key Phases','Sunlight always lights up half of the Moon. How much of that lit half can we see from Earth?',[MR.see(0),MR.see(180),MR.see(90),MR.see(270)],{opts:MW_KEY,
    intro:'Sunlight comes from the **right**. The Moon moves around Earth **counterclockwise**. Look from Earth’s point of view: how much of the Moon’s lit half faces Earth?',
    fact:'The Moon makes no light of its own. Half of it is always lit by the Sun. The phases are how much of that lit half we can see from Earth.',
    clue:'Imagine standing on Earth and looking at the Moon. Is the Moon’s lit side facing you, facing away, or half and half?'}),
  MWL('In Between','Between the key phases are crescents and gibbous moons.',[MR.see(45),MR.see(135),MR.see(225),MR.see(315)],{
    intro:'**Waxing** means growing (more lit each night). **Waning** means shrinking. A **crescent** is less than half lit. **Gibbous** is more than half lit.',
    fact:'From New York, a waxing moon is lit on the right side and a waning moon is lit on the left side.',
    clue:'Is the Moon on its way from new moon to full (waxing) or from full back to new (waning)? The Moon moves counterclockwise.'}),
  MWL('Place the Moon','Now work backward: where in its orbit is the Moon?',[MR.place(45),MR.place(180),MR.place(270),MR.place(225)],{
    fact:'It takes about 29.5 days for the Moon to go through all its phases. That is where the idea of a "month" comes from.',
    clue:'Full moon: Earth is between the Sun and Moon. New moon: the Moon is between the Sun and Earth.'}),
  MWL('Moon Clock','The Moon’s position also tells you WHEN it is in the sky.',[
      MR.mc('A full moon rises in the east at about what time?',[['sunset','Sunset (about 6 pm)'],['noon','Noon'],['sunrise','Sunrise (about 6 am)']],'sunset','A full moon is opposite the Sun, so it rises as the Sun sets and is up all night.'),
      MR.mc('About how long is it from one full moon to the next?',[['29','About 29.5 days'],['7','About 7 days'],['365','About 365 days']],'29','The Moon takes about 29.5 days to go through all its phases.'),
      MR.see(90),
      MR.mc('Why do we always see the same side of the Moon?',[['spin','The Moon spins once in the same time it takes to orbit Earth.'],['nospin','The Moon does not spin at all.'],['dark','The other side is always in darkness.']],'spin','The Moon rotates once for every orbit, so the same side always faces Earth. The "far side" still gets sunlight!')],{
    fact:'The far side of the Moon is not dark. It gets just as much sunlight as the near side; we just never see it from Earth.',
    clue:'Full moon means the Moon is on the opposite side of Earth from the Sun.'}),
  MWL('Eclipse Maker','Sometimes the Sun, Earth and Moon line up exactly.',[MR.ecl('solar'),MR.ecl('lunar'),
      MR.mc('A lunar eclipse can only happen during which phase?',[['full','Full moon'],['new','New moon'],['quarter','First quarter']],'full','In a lunar eclipse, Earth is between the Sun and Moon, which is the full moon position.'),
      MR.mc('In a solar eclipse, what blocks the sunlight?',[['moon','The Moon blocks the Sun from part of Earth.'],['earth','Earth’s shadow covers the Sun.'],['cloud','Clouds cover the Sun.']],'moon','In a solar eclipse, the Moon passes between the Sun and Earth, and its shadow falls on Earth.')],{
    fact:'A total solar eclipse crossed New York State on April 8, 2024. The next one visible from New York will not happen until 2079.',
    clue:'Solar eclipse: the Moon blocks the Sun. Lunar eclipse: Earth’s shadow falls on the Moon.'}),
  MWL('Not Every Month','There is a new moon every month. So why are solar eclipses rare?',[MR.tilt(),
      MR.mc('Why is there not a solar eclipse at every new moon?',[['tilt','The Moon’s orbit is tilted, so it usually passes above or below the Sun.'],['far','The Moon is too far away most months.'],['small','The Moon is too small to block the Sun.']],'tilt','The Moon’s orbit is tilted about 5 degrees, so at most new moons its shadow misses Earth.')],{
    intro:'This is a **side view**. The yellow line points straight from Earth to the Sun.',
    fact:'The Moon’s orbit is tilted about 5° from Earth’s orbit. Eclipses only happen when a new or full moon lines up with the place where the two orbits cross.',
    clue:'For an eclipse, the Moon must be exactly on the line between Earth and the Sun.'}),
  MWL('Summer in New York','Earth’s axis is tilted, and it always points the same way in space.',[MR.season('Tap where Earth is when New York has summer.','jun','In June, the Northern Hemisphere tilts toward the Sun. Sunlight hits it more directly and days are longer.'),
      MR.mc('Why is it warmer in summer?',[['tilt','Our half of Earth is tilted toward the Sun: more direct light and longer days.'],['close','Earth is closer to the Sun in summer.'],['spin','Earth spins faster in summer.']],'tilt','Seasons are caused by the tilt, not distance. Direct sunlight is more concentrated, and longer days give more hours of heating.')],{
    intro:'A side view of Earth going around the Sun. The little **N** shows the North Pole. The axis always leans the same way in space.',
    fact:'Earth’s axis is tilted about 23.5°. As Earth orbits the Sun, first the Northern and then the Southern Hemisphere leans toward the Sun.',
    clue:'Find the spot where the North Pole leans TOWARD the Sun.'}),
  MWL('Down Under','Australia is in the Southern Hemisphere.',[MR.season('Tap where Earth is when Australia has summer.','dec','In December, the Southern Hemisphere tilts toward the Sun, so it is summer in Australia and winter in New York.'),
      MR.mc('When New York has winter, what season does Australia have?',[['summer','Summer'],['winter','Winter too'],['spring','Spring']],'summer','The hemispheres have opposite seasons, because when one tilts toward the Sun the other tilts away.'),
      MR.season('Tap a spot where both hemispheres get about EQUAL sunlight (spring or fall).',['mar','sep'],'In March and September, neither pole leans toward the Sun. Day and night are about equal everywhere.')],{
    fact:'In Australia, people often have Christmas at the beach because December is summer there.',
    clue:'Australia is in the bottom half of Earth. Find where the SOUTH Pole leans toward the Sun.'}),
  MWL('Closest in January','Earth’s orbit is almost a circle, but not quite.',[
      MR.mc('Earth is closest to the Sun in early January. What season is it in New York then?',[['winter','Winter'],['summer','Summer'],['spring','Spring']],'winter','It is winter in New York in January, even though Earth is closest to the Sun. Distance is not what causes seasons.'),
      MR.mc('So what really causes the seasons?',[['tilt','The tilt of Earth’s axis as Earth orbits the Sun'],['dist','How close Earth is to the Sun'],['moon','The phases of the Moon']],'tilt','Earth’s tilt changes how directly sunlight hits each hemisphere and how long the days are.'),
      MR.season('Tap where Earth is when New York has winter.','dec','In December, the Northern Hemisphere tilts away from the Sun. Light is spread out and days are short.'),
      MR.see(315)],{
    fact:'The difference in Earth’s distance from the Sun is only about 3%. That is far too small to cause the seasons.',
    clue:'If distance caused seasons, both hemispheres would have summer at the same time. Do they?'})
];
const MW_PACKS={0:'Pack 1: Moon phases',3:'Pack 2: Eclipses and timing',6:'Pack 3: Seasons'};
const MW_SEAS={jun:[60,150],sep:[230,228],dec:[400,150],mar:[230,72]};
function mwBoard(G){
  const L=G.L,S=G.st,R=L.rounds[S.r]||{},W=460,H=300,cx=200,cy=150,r=110;let t='';
  if(R.t==='season'||(S.lastT==='season'&&!R.t)){
    t+=`<rect width="${W}" height="${H}" fill="#0c1430"/><ellipse cx="230" cy="150" rx="170" ry="78" fill="none" stroke="#3a4a7a" stroke-width="2" stroke-dasharray="5 6"/><text x="12" y="22" font-size="12" font-weight="800" fill="#8d97c5">Side view of Earth\u2019s orbit</text>`+
      `<circle cx="230" cy="150" r="34" fill="#ffd34d"/><circle cx="230" cy="150" r="46" fill="#ffd34d" opacity=".2"/><text x="230" y="156" text-anchor="middle" font-size="14" font-weight="900" fill="#7a4a00">SUN</text>`;
    Object.entries(MW_SEAS).forEach(([k,[x,y]])=>{const ang=Math.atan2(150-y,230-x),pick=S.pick===k,ok=S.okSpot&&S.okSpot.includes(k);
      t+=`<g class="mwspot${pick?' on':''}" data-k="${k}" role="button" tabindex="0" aria-label="Earth position ${k}"><circle cx="${x}" cy="${y}" r="32" fill="${ok?'#1f9d55':pick?'#2f6bff':'#ffffff'}" opacity="${ok||pick?.35:.08}"/>`+
        `<circle cx="${x}" cy="${y}" r="20" fill="#2a3a6a"/><path d="M${x} ${y-20}A20 20 0 0 1 ${x} ${y+20}Z" fill="#3f8fe0" transform="rotate(${ang*180/Math.PI} ${x} ${y})"/>`+
        `<g transform="rotate(23.5 ${x} ${y})"><line x1="${x}" y1="${y-30}" x2="${x}" y2="${y+30}" stroke="#fff" stroke-width="2.4"/><text x="${x}" y="${y-33}" text-anchor="middle" font-size="12" font-weight="900" fill="#fff">N</text></g>`+
        (S.showMonths?`<text x="${x}" y="${y+46}" text-anchor="middle" font-size="12" font-weight="800" fill="#cfd8ff">${({jun:'June',sep:'September',dec:'December',mar:'March'})[k]}</text>`:'')+`</g>`;});
    return ngSvg(W,H,t,'ngsvg mwsvg','Earth at four places around the Sun');
  }
  if(R.t==='tilt'){
    t+=`<rect width="${W}" height="${H}" fill="#0c1430"/>`;
    [['jan',-14],['apr',0],['jul',12],['oct',-8]].forEach(([k,dy],i)=>{const y0=40+i*66,pick=S.pick===k,ok=S.okSpot&&S.okSpot.includes(k);
      t+=`<g class="mwspot${pick?' on':''}" data-k="${k}" role="button" tabindex="0" aria-label="New moon in ${k}"><rect x="10" y="${y0-26}" width="${W-20}" height="56" rx="10" fill="${ok?'#1f9d55':pick?'#2f6bff':'#fff'}" opacity="${ok||pick?.3:.06}"/>`+
        `<line x1="70" y1="${y0}" x2="${W-60}" y2="${y0}" stroke="#ffd34d" stroke-width="2" stroke-dasharray="4 4"/><circle cx="${W-40}" cy="${y0}" r="16" fill="#ffd34d"/><circle cx="70" cy="${y0}" r="13" fill="#3f8fe0"/>`+
        `<line x1="130" y1="${y0+dy*0.6+6}" x2="250" y2="${y0-dy*0.6-6+dy}" stroke="#8d97b5" stroke-width="1.5" opacity=".6"/><circle cx="190" cy="${y0+dy}" r="7" fill="#c9cdd8"/>`+
        `<text x="22" y="${y0+5}" font-size="12" font-weight="800" fill="#cfd8ff">${k.toUpperCase()}</text></g>`;});
    return ngSvg(W,H,t,'ngsvg mwsvg','Side views of four new moons');
  }
  t+=`<rect width="${W}" height="${H}" fill="#0c1430"/>`;
  for(let i=0;i<5;i++){const y=40+i*55;t+=`<path d="M${W-6} ${y}H${W-60}" stroke="#ffd34d" stroke-width="3" opacity=".7"/><path d="M${W-60} ${y}l9-5v10z" fill="#ffd34d" opacity=".7"/>`;}
  t+=`<text x="${W-10}" y="20" text-anchor="end" font-size="12" font-weight="800" fill="#ffd34d">← Sunlight</text>`;
  t+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#3a4a7a" stroke-width="2" stroke-dasharray="5 6"/><path d="M${cx-8} ${cy-r-10}l-10 0" stroke="#3a4a7a" stroke-width="2"/><path d="M${cx-18} ${cy-r-10}l6-4v8z" fill="#3a4a7a"/>`;
  t+=`<circle cx="${cx}" cy="${cy}" r="30" fill="#1d3b78"/><path d="M${cx} ${cy-30}A30 30 0 0 1 ${cx} ${cy+30}Z" fill="#3f8fe0"/><text x="${cx}" y="${cy+5}" text-anchor="middle" font-size="12" font-weight="900" fill="#fff">Earth</text>`;
  const showAll=R.t==='place'||R.t==='ecl';
  MW_ALL.forEach(th=>{const x=cx+r*Math.cos(th*Math.PI/180),y=cy-r*Math.sin(th*Math.PI/180),cur=R.t==='see'&&R.th===th,pick=S.pick===th,ok=S.okSpot&&S.okSpot.includes(th);
    if(cur||(!showAll&&!cur&&S.okSpot&&S.okSpot.includes(th))){t+=`<circle cx="${x}" cy="${y}" r="15" fill="#2a2f45"/><path d="M${x} ${y-15}A15 15 0 0 1 ${x} ${y+15}Z" fill="#f6efc8"/>`+(cur?`<circle cx="${x}" cy="${y}" r="21" fill="none" stroke="#f4b13a" stroke-width="3"/>`:'');}
    else if(showAll)t+=`<g class="mwspot${pick?' on':''}" data-k="${th}" role="button" tabindex="0" aria-label="Moon position ${MW_ALL.indexOf(th)+1}"><circle cx="${x}" cy="${y}" r="19" fill="${ok?'#1f9d55':pick?'#2f6bff':'#ffffff'}" opacity="${ok||pick?.45:.12}"/><circle cx="${x}" cy="${y}" r="13" fill="#2a2f45"/><path d="M${x} ${y-13}A13 13 0 0 1 ${x} ${y+13}Z" fill="#f6efc8"/></g>`;
  });
  if(R.t==='ecl'&&S.okSpot){const th=S.okSpot[0],x=cx+r*Math.cos(th*Math.PI/180),y=cy-r*Math.sin(th*Math.PI/180);
    t+=th===0?`<path d="M${x} ${y-13}L${cx+30} ${cy-8}L${cx+30} ${cy+8}L${x} ${y+13}Z" fill="#000" opacity=".55"/>`:`<path d="M${cx} ${cy-30}L${x} ${y-16}L${x} ${y+16}L${cx} ${cy+30}Z" fill="#000" opacity=".5"/>`;}
  return ngSvg(W,H,t,'ngsvg mwsvg','Top view of the Sun, Earth and the Moon’s orbit');
}
function mwRoundBox(G){
  const L=G.L,S=G.st,R=L.rounds[S.r];if(!R)return [h('div',{class:'ppdone'},'✓ All rounds done!')];
  const lock=G.done||S.okNow;
  if(R.t==='see')return [h('p',{class:'ppq'},'What does the Moon (circled in gold) look like from Earth?'),
    h('div',{class:'mwopts'},...L.opts.map(th=>h('button',{type:'button',class:'ngc mwopt'+(S.pick===th?' on':'')+(S.bad.includes(th)?' no':'')+(S.okNow&&th===R.th?' ok':''),disabled:lock||S.bad.includes(th),onclick:()=>{S.pick=th;mwCheck();}},mwIcon(th,40),h('small',null,MW_NAMES[th]))))];
  if(R.t==='place')return [h('p',{class:'ppq'},'Tap the place in the orbit where the Moon looks like this from Earth:'),h('div',{class:'mwtarget'},mwIcon(R.th,64),h('b',null,MW_NAMES[R.th]))];
  if(R.t==='ecl')return [h('p',{class:'ppq'},`Tap where the Moon must be for a ${R.k==='solar'?'SOLAR':'LUNAR'} eclipse.`),h('div',{class:'mwtarget'},h('b',null,R.k==='solar'?'☀ Solar eclipse: the Sun goes dark':'🌕 Lunar eclipse: the Moon turns dark red'))];
  if(R.t==='season')return [h('p',{class:'ppq'},R.q)];
  if(R.t==='tilt')return [h('p',{class:'ppq'},'Each row shows a new moon in a different month (side view). Tap the month when there will be a solar eclipse.')];
  return [h('p',{class:'ppq'},R.q),h('div',{class:'ppmc'},...R.opts.map(([v,t])=>h('button',{type:'button',class:'ngc wide'+(S.pick===v?' on':'')+(S.bad.includes(v)?' no':'')+(S.okNow&&v===R.ans?' ok':''),disabled:lock||S.bad.includes(v),onclick:()=>{S.pick=v;mwCheck();}},t)))];
}
function mwAnswer(R){return R.t==='see'||R.t==='place'?[R.th]:R.t==='ecl'?[R.k==='solar'?0:180]:R.t==='tilt'?['apr']:R.t==='season'?R.ans:[R.ans];}
function mwWhy(R,ok){
  if(R.t==='see'||R.t==='place')return ok?`Yes: ${MW_NAMES[R.th].toLowerCase()}. `+(R.th===0?'The lit side faces away from Earth.':R.th===180?'The whole lit side faces Earth.':R.th<180?'Waxing: the right side is lit.':'Waning: the left side is lit.')
    :R.t==='see'?'Look from Earth toward the Moon. Which part of the Moon’s lit (right) half faces Earth?':'Not there. Think about which way the lit half faces compared with Earth.';
  if(R.t==='ecl')return ok?(R.k==='solar'?'Yes! The Moon is between the Sun and Earth, and its shadow falls on Earth.':'Yes! Earth is between the Sun and the Moon, and Earth’s shadow falls on the Moon.'):(R.k==='solar'?'For a solar eclipse, something must block the Sun from Earth. Which body could do that?':'For a lunar eclipse, Earth’s shadow must fall on the Moon. Where is Earth’s shadow?');
  if(R.t==='tilt')return ok?'Yes! In April the Moon is exactly on the Earth–Sun line, so its shadow hits Earth.':'In that month the Moon passes above or below the line to the Sun, so its shadow misses Earth.';
  return ok?R.why:'Not quite. '+(R.t==='season'?'Look at which way the North Pole (N) leans compared with the Sun.':R.why);
}
function mwCheck(){
  const L=G.L,S=G.st,R=L.rounds[S.r];if(!R||G.done||S.okNow||S.pick==null)return;
  const ans=mwAnswer(R),ok=ans.includes(S.pick);
  if(ok){S.okNow=true;S.okSpot=ans.includes(S.pick)?[S.pick]:ans;if(R.t==='season')S.showMonths=true;S.msg=['ok',mwWhy(R,true)];fx.pop({icon:'moon',text:'Correct!',kind:'good'});ngRender();ngSay(mwWhy(R,true),'go');}
  else{S.bad.push(S.pick);G.miss++;G.tries++;S.msg=['no',mwWhy(R,false)];fx.pop({icon:'moon',text:'Not quite',kind:'oops'});S.pick=null;ngRender();ngSay(mwWhy(R,false),'alert');}
}
function mwNext(){const S=G.st;S.lastT=G.L.rounds[S.r].t;S.r++;S.pick=null;S.bad=[];S.okNow=false;S.okSpot=null;S.msg=null;S.showMonths=false;
  if(S.r>=G.L.rounds.length){ngRender();G.detail={mistakes:G.miss};ngWin(ngStars(G.miss,0,2),['You finished with ',h('b',null,G.miss),` mistake${G.miss===1?'':'s'}.`]);return;}
  ngRender();}
ngDef({key:'moon',name:'Moonwatch',ic:'moon',std:'MS-ESS1-1',subj:'earth',cap3:true,
  short:'Use a Sun-Earth-Moon model to explain phases, eclipses and seasons.',menuDesc:'Use a model of the Sun, Earth and Moon to predict moon phases, make eclipses and explain the seasons.',
  intro:'Use a model of the Sun, Earth and Moon to predict what we see from Earth. Name the Moon’s phase, place the Moon for an eclipse, and find where Earth is in each season. No mistakes earns 3 stars.',
  how:['**Study the model.** Sunlight comes from the right. The Moon orbits counterclockwise.','**Answer each round** by picking a phase or tapping a spot in the model.','A wrong answer explains why. Fewer mistakes earns more stars.'],
  levels:MW_LEVELS,packs:MW_PACKS,cap3:true,
  mini:L=>{const w=h('span',{class:'ppmini'});[0,90,180].forEach(th=>w.append(mwIcon(L.rounds[0].th!=null?(L.rounds[0].th+th)%360:th+45,20)));return w;},
  start(G){G.st={r:0,pick:null,bad:[],okNow:false,okSpot:null,msg:null};},
  hud(G){return {label:'Mistakes',val:G.miss,target:'3 ★ = no mistakes'};},
  render(G,main,side){
    const L=G.L,S=G.st,b=mwBoard(G);
    b.querySelectorAll('.mwspot').forEach(el=>{const go=()=>{const R=L.rounds[S.r];if(!R||S.okNow||G.done)return;const k=el.dataset.k,v=/^\d+$/.test(k)?+k:k;if(S.bad.includes(v))return;S.pick=v;mwCheck();};
      el.addEventListener('click',go);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});});
    ngRC(main,b);
    const prog=h('div',{class:'ppsteps'},...L.rounds.map((R,k)=>h('span',{class:'ppst'+(k<S.r||(k===S.r&&S.okNow)?' ok':k===S.r?' on':'')},'Round '+(k+1))));
    ngRC(side,prog,...mwRoundBox(G),S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null,
      S.okNow&&S.r<L.rounds.length?ngBtn(S.r+1<L.rounds.length?'Next round ▶':'Finish ▶',mwNext,'good',{style:'width:100%;margin-top:6px'}):null);
    if(!S.msg){const R=L.rounds[S.r];if(R)ngSay(R.t==='see'?'Picture yourself on Earth looking at the Moon.':R.t==='mc'?'Use the model to explain.':'Tap a spot in the model.');}
  },
  hints(G){const L=G.L,R=L.rounds[G.st.r]||L.rounds[0],a=mwAnswer(R)[0];
    return [L.clue,'Half of the Moon is always lit (the side facing the Sun, on the right). New moon: lit side faces away from Earth. Full moon: lit side faces Earth. Waxing = lit on the right, waning = lit on the left.',
      R.t==='see'||R.t==='place'?`This one is the ${MW_NAMES[R.th].toLowerCase()}.`:R.t==='ecl'?(R.k==='solar'?'Put the Moon between Earth and the Sun (the new moon spot).':'Put the Moon behind Earth, opposite the Sun (the full moon spot).'):R.t==='tilt'?'Look for the month when the Moon sits right on the dashed line to the Sun.':R.t==='season'?'Look for where the N end of the axis leans '+(a==='jun'?'toward':'away from')+' the Sun.':'The answer: '+(R.opts.find(o=>o[0]===R.ans)||['',''])[1]];}
});
NGTHUMB.moon=()=>{
  let t=`<circle cx="292" cy="90" r="60" fill="#ffd34d" opacity=".18"/><circle cx="320" cy="90" r="46" fill="#ffd34d"/>`;
  t+=`<circle cx="140" cy="90" r="64" fill="none" stroke="#5a6aa8" stroke-width="2.5" stroke-dasharray="6 7"/><circle cx="140" cy="90" r="26" fill="#1d3b78"/><path d="M140 64a26 26 0 0 1 0 52z" fill="#3f8fe0"/>`;
  [[0,204,90],[90,140,26],[180,76,90],[270,140,154]].forEach(([th,x,y])=>{t+=`<g>${mwPhase(th===0?45:th===180?180:th===90?90:270,13,x,y,'#2a2f45','#f6efc8')}</g>`;});
  t+=ngStar(30,24,6,'#f6efe0',.8)+ngStar(250,160,5,'#f6efe0',.6)+ngStar(40,150,4,'#f6efe0',.6);
  return ngWrap('moon','#121c45',t);
};
