/*<<EVDATA*/
const EV_TESTS={
  look:{n:'Look closely',q:'What does it look like?'},
  water:{n:'Add water',q:'Stir it into water'},
  vinegar:{n:'Add vinegar',q:'Drop vinegar on it'},
  iodine:{n:'Add iodine',q:'Drop iodine on it'},
  heat:{n:'Heat it',q:'Warm a pinch over a flame'},
  magnet:{n:'Magnet',q:'Hold a magnet close'},
  conduct:{n:'Conductivity',q:'Does the bulb light in a circuit?'},
  density:{n:'Density check',q:'Weigh it and measure its volume'}};
const EV_SUBS={
  sugar:{n:'Sugar',look:'White crystals',water:'Dissolves',vinegar:'No change',iodine:'Stays brown',heat:'Melts, browns',magnet:'No pull',conduct:'Bulb off',density:'1.6 g/mL'},
  salt:{n:'Table salt',look:'White crystals',water:'Dissolves',vinegar:'No change',iodine:'Stays brown',heat:'No change',magnet:'No pull',conduct:'Bulb lights',density:'2.2 g/mL'},
  soda:{n:'Baking soda',look:'Fine white powder',water:'Dissolves',vinegar:'Fizzes!',iodine:'Stays brown',heat:'Gives off gas',magnet:'No pull',conduct:'Bulb lights',density:'2.2 g/mL'},
  cornstarch:{n:'Cornstarch',look:'Fine white powder',water:'Cloudy',vinegar:'No change',iodine:'Turns blue-black',heat:'Tans, clumps',magnet:'No pull',conduct:'Bulb off',density:'1.5 g/mL'},
  flour:{n:'Flour',look:'Fine white powder',water:'Cloudy',vinegar:'No change',iodine:'Turns blue-black',heat:'Browns, burns',magnet:'No pull',conduct:'Bulb off',density:'1.4 g/mL'},
  chalk:{n:'Chalk powder',look:'Gritty white powder',water:'Does not dissolve',vinegar:'Fizzes!',iodine:'Stays brown',heat:'No change',magnet:'No pull',conduct:'Bulb off',density:'2.7 g/mL'},
  iron:{n:'Iron filings',look:'Shiny dark bits',water:'Does not dissolve',vinegar:'No change',iodine:'Stays brown',heat:'No change',magnet:'Sticks!',conduct:'Bulb off',density:'7.9 g/mL'},
  epsom:{n:'Epsom salt',look:'White crystals',water:'Dissolves',vinegar:'No change',iodine:'Stays brown',heat:'Crumbles',magnet:'No pull',conduct:'Bulb lights',density:'1.7 g/mL'},
  citric:{n:'Citric acid',look:'White crystals',water:'Dissolves',vinegar:'No change',iodine:'Stays brown',heat:'Melts, yellows',magnet:'No pull',conduct:'Bulb lights',density:'1.7 g/mL'},
  sand:{n:'Sand',look:'Gritty tan grains',water:'Does not dissolve',vinegar:'No change',iodine:'Stays brown',heat:'No change',magnet:'No pull',conduct:'Bulb off',density:'2.6 g/mL'},
  gold:{n:'Gold',look:'Shiny yellow metal',water:'Does not dissolve',vinegar:'No change',iodine:'Stays brown',heat:'No change',magnet:'No pull',conduct:'Bulb lights',density:'19.3 g/mL'},
  brass:{n:'Brass',look:'Shiny yellow metal',water:'Does not dissolve',vinegar:'No change',iodine:'Stays brown',heat:'No change',magnet:'No pull',conduct:'Bulb lights',density:'8.5 g/mL'},
  pyrite:{n:'Fool\'s gold',look:'Shiny yellow crystals',water:'Does not dissolve',vinegar:'No change',iodine:'Stays brown',heat:'No change',magnet:'No pull',conduct:'Bulb off',density:'5.0 g/mL'},
  leadbar:{n:'Painted lead',look:'Yellow painted block',water:'Does not dissolve',vinegar:'No change',iodine:'Stays brown',heat:'No change',magnet:'No pull',conduct:'Bulb lights',density:'11.3 g/mL'}};
/* reaction-or-not tests */
const EV_RT={
  gas:{n:'New gas?',q:'Look for new bubbles (not from boiling)',strong:true},
  solid:{n:'New solid?',q:'Look for a new solid or crust',strong:true},
  smell:{n:'New smell or light?',q:'Waft a sniff. Look for a glow.',strong:true},
  props:{n:'Same properties?',q:'Compare with the starting stuff',strong:true},
  color:{n:'Color change?',q:'Compare the color to before',strong:false},
  temp:{n:'Temperature change?',q:'Touch the container',strong:false}};
const EV_SC={
  soda_vin:{n:'Baking soda + vinegar',story:'You stir baking soda into a cup of vinegar.',truth:'chem',
    gas:[1,'Tons of new gas bubbles'],solid:[0,'No new solid'],smell:[0,'Nothing new to smell'],props:[0,'No. The gas and liquid are new stuff'],color:[0,'Still clear'],temp:[1,'The cup gets colder']},
  salt_water:{n:'Salt + water',story:'You stir table salt into warm water until it vanishes.',truth:'phys',
    gas:[0,'No new gas'],solid:[0,'No new solid'],smell:[0,'Nothing new to smell'],props:[1,'Yes. Still salt and water (evaporate it to get salt back)'],color:[0,'Still clear'],temp:[0,'No change']},
  ice:{n:'Ice melting',story:'An ice cube sits in a warm room.',truth:'phys',
    gas:[0,'No new gas'],solid:[0,'No new solid'],smell:[0,'Nothing new to smell'],props:[1,'Yes. Melted ice is still water (freeze it to get ice)'],color:[0,'Still clear'],temp:[1,'It feels cold']},
  dye:{n:'Food coloring + water',story:'You drop red food coloring into a glass of water.',truth:'phys',
    gas:[0,'No new gas'],solid:[0,'No new solid'],smell:[0,'Nothing new to smell'],props:[1,'Yes. Still dye and water, just spread out'],color:[1,'The water turns pink'],temp:[0,'No change']},
  rust:{n:'Rusting nail',story:'A nail has sat in salty water for a week.',truth:'chem',
    gas:[0,'No new gas'],solid:[1,'A flaky orange crust formed'],smell:[0,'Nothing new to smell'],props:[0,'No. Rust is crumbly and not magnetic'],color:[1,'Orange-brown patches'],temp:[0,'No change']},
  paper:{n:'Tearing paper',story:'You rip a sheet of paper into little bits.',truth:'phys',
    gas:[0,'No new gas'],solid:[0,'No new solid'],smell:[0,'Nothing new to smell'],props:[1,'Yes. Every piece is still paper'],color:[0,'Same color'],temp:[0,'No change']},
  match:{n:'Burning a match',story:'You strike a match and let it burn down.',truth:'chem',
    gas:[1,'Smoke and gas are given off'],solid:[1,'Black ash is left behind'],smell:[1,'Smoky smell and bright light'],props:[0,'No. Ash is not wood'],color:[1,'Wood turns black'],temp:[1,'It gets hot']},
  sandiron:{n:'Sand + iron filings',story:'You stir sand and iron filings together in a bowl.',truth:'phys',
    gas:[0,'No new gas'],solid:[0,'No new solid'],smell:[0,'Nothing new to smell'],props:[1,'Yes. A magnet pulls the iron back out'],color:[0,'Just a speckled mix'],temp:[0,'No change']},
  alka:{n:'Fizzy tablet in water',story:'You drop a fizzy antacid tablet into a glass of water.',truth:'chem',
    gas:[1,'Streams of new bubbles'],solid:[0,'No new solid'],smell:[0,'Nothing new to smell'],props:[0,'No. The tablet is gone and gas escapes'],color:[0,'Still clear'],temp:[0,'No change']},
  egg:{n:'Frying an egg',story:'You crack an egg onto a hot pan.',truth:'chem',
    gas:[0,'No new gas'],solid:[1,'The runny egg turns solid'],smell:[1,'It smells cooked'],props:[0,'No. You cannot un-fry an egg'],color:[1,'Clear turns white'],temp:[1,'It is hot (but the pan is hot too)']},
  caramel:{n:'Heating sugar',story:'You heat sugar in a pan until it turns brown.',truth:'chem',
    gas:[0,'No new gas'],solid:[0,'No new solid'],smell:[1,'A sweet burnt-sugar smell'],props:[0,'No. Caramel is not sugar anymore'],color:[1,'White turns brown'],temp:[1,'It is hot']}};
/* answer logic ------------------------------------------------------------ */
function evSubsOK(cands,tests,secret){ /* do these tests separate secret from every other candidate? */
  return cands.every(c=>c===secret||tests.some(t=>EV_SUBS[c][t]!==EV_SUBS[secret][t]));}
function evParPowder(cs){
  const ts=cs.tests,n=ts.length;let best=99,bs=null;
  for(let m=1;m<(1<<n);m++){const sub=ts.filter((t,i)=>m>>i&1);if(sub.length<best&&evSubsOK(cs.cands,sub,cs.secret)){best=sub.length;bs=sub;}}
  if(!bs)throw new Error('unsolvable '+cs.secret);
  return {par:best,set:bs};
}
function evProof(sc,done,avail){ /* what do the finished tests prove? 'chem' | 'phys' | null */
  const S=EV_SC[sc];
  for(const t of done){if(EV_RT[t].strong&&t!=='props'&&S[t][0])return 'chem';}
  if(done.indexOf('props')>=0)return S.props[0]?'phys':'chem';
  if(avail.indexOf('props')<0&&['gas','solid','smell'].every(t=>done.indexOf(t)>=0))return 'phys';
  return null;
}
function evParReact(cs){
  const ts=cs.tests,n=ts.length;let best=99,bs=null;
  for(let m=1;m<(1<<n);m++){const sub=ts.filter((t,i)=>m>>i&1);if(sub.length<best&&evProof(cs.sc,sub,ts)){best=sub.length;bs=sub;}}
  if(!bs)throw new Error('no proof '+cs.sc);
  if(evProof(cs.sc,bs,ts)!==EV_SC[cs.sc].truth)throw new Error('proof disagrees '+cs.sc);
  return {par:best,set:bs};
}
const EVP=['look','water','vinegar','iodine','heat','magnet','conduct'],EVR=['gas','solid','smell','props','color','temp'],EVR2=['gas','solid','smell','color','temp'];
const EV_LEVELS=[
 {pack:'Pack 1: Kitchen Powders',name:'Kitchen Mix-Up',kind:'powder',
  story:'Three white powders from the pantry lost their labels. Which one is baking soda?',
  clue:'Baking soda is a base. Acids like vinegar make it bubble.',
  intro:'New tool: the field guide. Each row shows what a substance does in each test. Run a test on the mystery sample, then match its result to a row.',
  fact:'A chemical reaction between an acid (vinegar) and baking soda makes carbon dioxide gas. That gas is the fizz.',
  cases:[{cands:['sugar','salt','soda'],secret:'soda',tests:['look','water','vinegar']}]},
 {pack:null,name:'Starch Detective',kind:'powder',
  story:'A cook mixed up a jar of cornstarch. Find it among these four.',
  clue:'Iodine turns starchy foods blue-black. Starch makes water cloudy, too.',
  fact:'Iodine reacts with starch to make a deep blue-black color. Chemists use that to find starch in foods.',
  cases:[{cands:['sugar','cornstarch','soda','chalk'],secret:'cornstarch',tests:['look','water','vinegar','iodine']}]},
 {pack:null,name:'Sweet or Salty?',kind:'powder',
  story:'Two jars look the same: white crystals. One of them is sugar. Which?',
  clue:'Looks can fool you. Try a test that depends on what the stuff is made of.',
  fact:'Sugar is made of molecules, so it does not carry current. Salt breaks into charged particles in water, so the bulb lights.',
  cases:[{cands:['sugar','salt','epsom'],secret:'sugar',tests:['look','water','vinegar','heat','conduct']}]},
 {pack:null,name:'Flour Power',kind:'powder',
  story:'Cornstarch, flour and baking soda all look alike. Name the flour.',
  clue:'Flour and cornstarch both have starch. Which test might tell them apart?',
  fact:'Flour also contains proteins and other stuff, so it browns and burns when heated. Pure cornstarch just tans.',
  cases:[{cands:['flour','cornstarch','soda'],secret:'flour',tests:['look','water','vinegar','iodine','heat']}]},
 {pack:null,name:'Three Samples',kind:'powder',
  story:'The lab has three mystery samples today. Name all three!',
  clue:'Each sample has its own list of candidates. Pick the best test for each one.',
  fact:'Every pure substance has its own set of properties. Like a fingerprint, they identify what it is.',
  cases:[{cands:['sugar','salt','soda'],secret:'soda',tests:['water','vinegar','heat']},
         {cands:['iron','sand','chalk'],secret:'iron',tests:['water','vinegar','magnet']},
         {cands:['salt','citric','epsom'],secret:'salt',tests:['look','heat','conduct']}]},
 {pack:'Pack 2: Tough Cases',name:'Two Tests Needed',kind:'powder',
  story:'The heat lamp is broken. With only these tests, find the table salt.',
  clue:'No single test points to salt. Combine two tests to rule out every other candidate.',
  intro:'Some cases need more than one test. Each test narrows the list. Use as few as you can.',
  fact:'Scientists often use two or three properties together. One property alone can match many substances.',
  cases:[{cands:['salt','soda','sugar','chalk'],secret:'salt',tests:['look','vinegar','conduct']}]},
 {pack:null,name:'Dark Dust',kind:'powder',
  story:'A sample from the workshop floor. Is it iron, sand or chalk?',
  clue:'One tool is great for metal. Another one is great for chalk.',
  fact:'Iron is one of only a few elements that magnets pull. That makes sorting scrap metal easy.',
  cases:[{cands:['iron','sand','chalk','soda'],secret:'chalk',tests:['water','vinegar','magnet']}]},
 {pack:null,name:'Salt Family',kind:'powder',
  story:'Epsom salt, table salt and citric acid look like twins. Find the Epsom salt.',
  clue:'All three dissolve and light the bulb. Think about what happens when you heat them.',
  fact:'Epsom salt holds water inside its crystals. Heat drives that water out and the crystals crumble.',
  cases:[{cands:['epsom','salt','citric','sugar'],secret:'epsom',tests:['look','water','iodine','heat','conduct']}]},
 {pack:null,name:'Weigh It In',kind:'powder',
  story:'Four jars have different weights for the same scoop. Use density to find the table salt.',
  clue:'Density is mass divided by volume. Every substance has its own density.',
  intro:'New test: Density check. Density is how much mass fits in a certain volume (g/mL).',
  fact:'Density = mass ÷ volume. It does not change with the size of the sample, so it helps identify a substance.',
  cases:[{cands:['salt','sugar','cornstarch','chalk'],secret:'salt',tests:['look','density','heat']}]},
 {pack:null,name:'Fool\'s Gold',kind:'powder',
  story:'A pawn shop customer brings in a shiny yellow bar. Is it real gold, or a fake?',
  clue:'Several metals look the same. Which test can tell them apart for sure?',
  fact:'Gold is extremely dense (19.3 g/mL). Fake gold is lighter, so density catches the cheat every time.',
  cases:[{cands:['gold','brass','pyrite','leadbar'],secret:'gold',tests:['look','magnet','density']}]},
 {pack:null,name:'Mystery Trio',kind:'powder',
  story:'Three tricky samples. The tools in each case are limited. Be smart!',
  clue:'Check the tests available for each sample before you choose.',
  fact:'A good investigator plans tests that rule out the most suspects at once.',
  cases:[{cands:['salt','soda','sugar','chalk'],secret:'salt',tests:['look','vinegar','conduct']},
         {cands:['flour','cornstarch','chalk','sand'],secret:'flour',tests:['look','water','iodine','heat']},
         {cands:['cornstarch','flour'],secret:'cornstarch',tests:['look','iodine','heat']}]},
 {pack:'Pack 3: Reaction or Not?',name:'Fizz or Fake?',kind:'react',
  story:'Three events happened in the lab. Did a chemical reaction make new stuff, or was it only a physical change?',
  clue:'Look for strong evidence: a new gas, a new solid, a new smell or light, or new properties.',
  intro:'Run evidence tests. Some are strong proof. Others (color, temperature) are only weak clues. When you have strong proof, decide.',
  fact:'In a chemical reaction the atoms rearrange to make NEW substances with new properties. In a physical change the substance stays the same.',
  cases:[{sc:'soda_vin',tests:EVR},{sc:'salt_water',tests:EVR},{sc:'ice',tests:EVR}]},
 {pack:null,name:'Weak Clues',kind:'react',
  story:'A color change and a temperature change are tempting clues. Are they proof?',
  clue:'A color change alone does not prove a reaction. Dye spreading in water changes the color too.',
  fact:'Color and temperature changes can come from physical changes, such as dissolving. You need strong evidence to be sure.',
  cases:[{sc:'dye',tests:EVR},{sc:'rust',tests:EVR},{sc:'paper',tests:EVR}]},
 {pack:null,name:'Broken Comparer',kind:'react',
  story:'The properties kit is broken. Use the other tests to decide.',
  clue:'To call it physical, you must check for new gas, new solid and new smell and find none.',
  fact:'Proving something did NOT happen takes more work. You have to rule out every sign of a reaction.',
  cases:[{sc:'match',tests:EVR2},{sc:'sandiron',tests:EVR2},{sc:'alka',tests:EVR2}]},
 {pack:null,name:'Cold Case',kind:'react',
  story:'The final cases. Watch out for weak clues that point the wrong way.',
  clue:'Cold, hot, and colored can all happen in a physical change. Look for strong proof.',
  fact:'You cannot un-fry an egg. New substances with new properties are the sign of a chemical change.',
  cases:[{sc:'dye',tests:EVR2},{sc:'egg',tests:EVR2},{sc:'ice',tests:EVR2}]}
];
EV_LEVELS.forEach(L=>{L.cases.forEach(c=>{const r=L.kind==='powder'?evParPowder(c):evParReact(c);c.par=r.par;c.set=r.set;});
  L.par=L.cases.reduce((a,c)=>a+c.par,0);L.slack=L.kind==='react'?L.cases.length:0;});
const EV_N=EV_LEVELS.length;
/*EVDATA>>*/
/*<<EVUI*/
const EV_PACKS={0:'Pack 1: Kitchen Powders',5:'Pack 2: Tough Cases',11:'Pack 3: Reaction or Not?'};
let EVS=null;
const evLv=()=>EV_LEVELS[EVS.i],evCase=()=>evLv().cases[EVS.ci];
const evMini=L=>{const pw=L.kind==='powder',col=pw?'#6aa7ff':'#ff8a5c';
  const b=pw?`<path d="M11 4h10M13 4v8l-6 11a3 3 0 0 0 3 4h12a3 3 0 0 0 3-4l-6-11V4" fill="none" stroke="${col}" stroke-width="2.4" stroke-linejoin="round"/><path d="M9.5 19h13" stroke="${col}" stroke-width="2.4"/><circle cx="14" cy="23" r="1.4" fill="${col}"/><circle cx="19" cy="22" r="1.1" fill="${col}"/>`
  :`<circle cx="9" cy="16" r="5" fill="none" stroke="${col}" stroke-width="2.4"/><circle cx="23" cy="16" r="5" fill="none" stroke="#37e0c1" stroke-width="2.4"/><path d="M14 16h4m-1.8-2.2L18 16l-1.8 2.2" fill="none" stroke="#8d97b5" stroke-width="2" stroke-linecap="round"/>`;
  return svgEl(`<svg viewBox="0 0 32 32" width="40" height="40" aria-hidden="true">${b}</svg>`);};
function renderEvidenceSetup(){renderLevelPicker($('evLevels'),$('evTotal'),'evidence',EV_LEVELS,EV_PACKS,evStart,evMini);}
function evStart(i){
  EVS={i,ci:0,done:[],used:0,wrong:[],hint:0,caseOK:false,done_all:false,rec:EVS&&EVS.i===i?EVS.rec:0};
  show('s-evidence');$('evResult').hidden=true;evRender();
}
function evSay(t,kind){const c=$('evCoach');c.className='coach'+(kind?' '+kind:'');c.replaceChildren(h('span',{class:'ci'},I('bulb')),t);}
function evRunTest(t){
  if(EVS.caseOK||EVS.done.indexOf(t)>=0)return;
  EVS.done.push(t);EVS.used++;fx.pop({icon:'flask',text:(EV_TESTS[t]||EV_RT[t]).n,kind:'tip',size:'small'});evRender();
}
function evCaseStats(){
  const L=evLv(),cs=evCase();
  if(L.kind==='powder'){
    const sec=EV_SUBS[cs.secret];
    const alive=cs.cands.filter(c=>!EVS.wrong.includes(c)&&EVS.done.every(t=>EV_SUBS[c][t]===sec[t]));
    return {alive};
  }
  return {proof:evProof(cs.sc,EVS.done,cs.tests)};
}
function evBench(){
  const L=evLv(),cs=evCase(),st=evCaseStats(),box=$('evBench'),ghost=EVS.hint>=3;
  if(L.kind==='powder'){
    const sec=EV_SUBS[cs.secret];
    const head=h('tr',null,h('th',{class:'evn'},'Substance'),...cs.tests.map(t=>{
      const dn=EVS.done.indexOf(t)>=0,isg=ghost&&cs.set.indexOf(t)>=0;
      return h('th',null,h('button',{class:'evtb'+(dn?' done':'')+(isg?' ghost':''),disabled:dn||EVS.caseOK,title:EV_TESTS[t].q,onclick:()=>evRunTest(t)},EV_TESTS[t].n,h('small',null,dn?'done':EV_TESTS[t].q)));}),h('th',null,''));
    const mystery=h('tr',{class:'evmys'},h('td',{class:'evn'},h('b',null,'❓ Mystery sample')),...cs.tests.map(t=>h('td',{class:EVS.done.indexOf(t)>=0?'got':'unk'},EVS.done.indexOf(t)>=0?sec[t]:'?')),h('td',null,''));
    const rows=cs.cands.map(c=>{
      const bad=EVS.wrong.includes(c),dead=bad||EVS.done.some(t=>EV_SUBS[c][t]!==sec[t]);
      return h('tr',{class:'evrow'+(dead?' elim':'')+(!dead&&EVS.done.length&&st.alive.length===1?' only':'')},
        h('td',{class:'evn'},h('b',null,EV_SUBS[c].n)),
        ...cs.tests.map(t=>{const dn=EVS.done.indexOf(t)>=0,mis=dn&&EV_SUBS[c][t]!==sec[t];return h('td',{class:dn?(mis?'no':'yes'):''},EV_SUBS[c][t]);}),
        h('td',null,EVS.caseOK?(c===cs.secret?h('b',{class:'evgood'},'✓ Correct'):''):h('button',{class:'btn sm'+(dead?' ghost':''),disabled:bad,onclick:()=>evNamePowder(c)},bad?'Not this':'It is this!')));});
    box.replaceChildren(h('div',{class:'evscroll'},h('table',{class:'evtbl'},h('thead',null,head),h('tbody',null,mystery,...rows))));
  }else{
    const S=EV_SC[cs.sc];
    const tiles=cs.tests.map(t=>{const dn=EVS.done.indexOf(t)>=0,r=EV_RT[t],v=S[t];
      return h('button',{class:'evrt'+(dn?' done':'')+(r.strong?' strong':' weak')+(ghost&&cs.set.indexOf(t)>=0?' ghost':''),disabled:dn||EVS.caseOK,onclick:()=>evRunTest(t)},
        h('b',null,r.n),h('small',null,dn?v[1]:r.q),h('span',{class:'evbadge'},r.strong?'Strong proof':'Weak clue'));});
    const proof=st.proof;
    box.replaceChildren(
      h('div',{class:'evscene'},h('b',null,S.n),h('span',null,S.story)),
      h('div',{class:'evtiles'},...tiles),
      h('div',{class:'evproof'+(proof?' has':'')},proof?'✔ You have strong proof. Make your call!':'No strong proof yet. Keep testing.'),
      EVS.caseOK?h('div',{class:'evgood'},'✓ Correct: '+(S.truth==='chem'?'chemical reaction':'physical change')+'. Properties check: '+S.props[1]+'.'):
      h('div',{class:'evdecide'},h('button',{class:'btn',onclick:()=>evDeclare('chem')},'🧪 Chemical reaction'),h('button',{class:'btn',onclick:()=>evDeclare('phys')},'🧊 Physical change')));
  }
}
function evRender(){
  const L=evLv(),cs=evCase(),n=L.cases.length;
  $('evLvl').textContent=EVS.i+1;$('evLvlN').textContent=EV_N;$('evUsed').textContent=EVS.used;$('evPar').textContent=L.par+L.slack;
  $('evName').textContent=L.name;$('evStory').textContent=L.story;$('evIntro').hidden=!L.intro;$('evIntro').textContent=L.intro||'';
  $('evCaseBar').replaceChildren(...L.cases.map((c,k)=>h('span',{class:'evcase'+(k<EVS.ci||(k===EVS.ci&&EVS.caseOK)?' ok':k===EVS.ci?' on':'')},L.kind==='powder'?'Sample '+(k+1):EV_SC[c.sc].n.split(' ')[0]+'…',' ',k<EVS.ci||(k===EVS.ci&&EVS.caseOK)?'✓':'')));
  $('evCaseBar').hidden=n<2;
  evBench();evCoach();evHintUI();
  $('evNextCase').hidden=!(EVS.caseOK&&EVS.ci<n-1);
}
function evCoach(){
  const L=evLv(),st=evCaseStats();
  if(EVS.caseOK)return evSay(EVS.ci<evLv().cases.length-1?'Case solved! Press Next sample.':'All samples named!');
  if(L.kind==='powder'){
    if(!EVS.done.length)return evSay('Pick a test (the buttons at the top of each column). Then match the result to a row.');
    if(st.alive.length===1)return evSay('Only one substance still fits. Press its "It is this!" button.');
    return evSay(`${st.alive.length} substances still fit. Run another test to rule more out.`);
  }
  if(!EVS.done.length)return evSay('Run evidence tests. Strong tests give proof; weak ones are just clues.');
  evSay(st.proof?'You have strong proof. Make your call!':'Weak clues are not enough. Look for strong proof.');
}
function evNamePowder(c){
  const cs=evCase();
  if(c===cs.secret){EVS.caseOK=true;fx.pop({icon:'flask',text:'Case solved!',kind:'great'});fx.confetti(30);evCaseDone();return;}
  EVS.wrong.push(c);EVS.used+=2;fx.pop({icon:'question',text:'Not that one (+2)',kind:'oops'});
  evSay(EV_SUBS[c].n+' does not match your evidence for every test. A wrong answer costs 2 tests.','alert');evRender();
}
function evDeclare(a){
  const cs=evCase(),S=EV_SC[cs.sc],proof=evProof(cs.sc,EVS.done,cs.tests);
  if(!proof){evSay('You need strong proof first: a new gas, solid, smell or light, or the properties check. Keep testing!','alert');return;}
  if(a===S.truth){EVS.caseOK=true;fx.pop({icon:'flask',text:'Correct!',kind:'great'});fx.confetti(30);evCaseDone();return;}
  EVS.used+=2;fx.pop({icon:'question',text:'Check the proof (+2)',kind:'oops'});evSay('Look at the strong evidence again. Did new stuff form? A wrong call costs 2 tests.','alert');evRender();
}
function evCaseDone(){
  const L=evLv();evRender();
  if(EVS.ci>=L.cases.length-1)setTimeout(evWin,650);
}
function evWin(){
  const L=evLv(),n=L.cases.length,allow=L.par+L.slack,stars=EVS.used<=allow?3:EVS.used<=allow+2*n?2:1;
  if(!(EVS.rec>=stars)){EVS.rec=stars;recordStars('evidence',EVS.i+1,stars,{tests:EVS.used,par:L.par});}
  fx.pop({icon:'flask',text:stars===3?'Master detective!':'Case closed!',kind:'great',size:'big'});fx.confetti(stars===3?90:50);
  levelResult($('evResult'),{stars,next:EVS.i+1<EV_N,
    line:['You ran ',h('b',null,EVS.used),` test${EVS.used===1?'':'s'} (counting penalties). 3 stars needs `,h('b',null,allow),' or fewer.',stars<3?' Can you spot the best test sooner?':' Sharp detective work!'],
    fact:L.fact,onNext:()=>evStart(EVS.i+1),onRetry:()=>evStart(EVS.i),onLevels:()=>{renderEvidenceSetup();show('s-evidence-setup');}});
}
function evHintUI(){
  const L=evLv(),cs=evCase(),n=EVS.hint;
  $('evHintTxt').textContent=['Need a hint?','Another hint','Show me the best tests','Answer shown'][n];$('evHint').disabled=n>=3||EVS.caseOK;
  const nm=t=>(EV_TESTS[t]||EV_RT[t]).n,b=$('evHintBox');
  b.hidden=n===0;
  b.replaceChildren(...[n>=1?h('div',null,I('bulb'),' ',h('b',null,'Clue: '),L.clue):null,
    n>=2?h('div',null,I('lens'),' ',h('b',null,'Tip: '),'This sample can be named with '+cs.par+' test'+(cs.par>1?'s':'')+'. Check which test gives a different result for just one candidate.'):null,
    n>=3?h('div',null,I('eye'),' ',h('b',null,'Best tests: '),cs.set.map(nm).join(' + ')+' (outlined in teal).'):null]);
}
$('evHint').onclick=()=>{if(EVS.hint<3){EVS.hint++;evRender();}};
$('evBack').onclick=()=>{renderEvidenceSetup();show('s-evidence-setup');};
$('evNextCase').onclick=()=>{EVS.ci++;EVS.done=[];EVS.wrong=[];EVS.caseOK=false;EVS.hint=0;$('evResult').hidden=true;evRender();};
/*EVUI>>*/
