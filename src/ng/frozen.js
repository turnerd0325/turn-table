/* ================= PHYSICS 2: KEEP IT FROZEN (MS-PS3-3, PS3-4) =================
   Design a cooler that keeps ice cream frozen long enough: choose insulators, a lid and a color,
   THEN test it. Pack 2 predicts how mass and type of matter change temperature. Heat always
   flows from hot to cold; good designs only slow it down. */
const KF_OPT={
  wall:{lab:'Walls',o:{alu:['Aluminum',0.5,1],steel:['Steel',0.7,3],card:['Cardboard',2,2],wood:['Wood',3,2],foam:['Foam',8,4]}},
  lid:{lab:'Lid',o:{none:['No lid',3,0],thin:['Thin plastic lid',1.6,1],foam:['Foam lid',1,2]}},
  color:{lab:'Outside color',o:{black:['Black',12,0],blue:['Dark blue',8,0],white:['White',2,1]}},
  ice:{lab:'Ice pack',o:{small:['Small ice pack',40,1],big:['Big ice pack',80,3]}}
};
const KF_INFO={alu:'Metal: a heat conductor',steel:'Metal: a heat conductor',card:'Paper with air pockets',wood:'Wood: a fair insulator',foam:'Foam: full of trapped air',none:'Open top',thin:'Thin plastic',black:'Absorbs sunlight',blue:'Absorbs most sunlight',white:'Reflects sunlight',small:'A little cold to spare',big:'Lots of cold to spare'};
function kfHours(L,d){const w=KF_OPT.wall.o[d.wall][1],l=KF_OPT.lid.o[d.lid][1],sun=L.sun?KF_OPT.color.o[d.color][1]:0,cap=KF_OPT.ice.o[d.ice][1]*(L.capMul||1);
  const rate=Math.abs(L.Tin-L.Tout)/w*l+sun;return cap/rate;}
const kfCost=(L,d)=>L.choose.reduce((a,c)=>a+KF_OPT[c].o[d[c]][2],0);
function kfDesigns(L){const cats=L.choose,res=[];const go=(k,d)=>{if(k===cats.length){res.push(Object.assign({},d));return;}Object.keys(L.opts&&L.opts[cats[k]]?L.opts[cats[k]].reduce((o,x)=>(o[x]=1,o),{}):KF_OPT[cats[k]].o).forEach(v=>{d[cats[k]]=v;go(k+1,d);});};
  go(0,Object.assign({},L.fixed));return res;}
const kfPass=(L,d)=>kfHours(L,d)>=L.goal&&(!L.budget||kfCost(L,d)<=L.budget);
const KFL=(name,story,o)=>Object.assign({name,story,type:'design',Tin:-10,Tout:30,sun:false},o);
const KF_LEVELS=[
  KFL('Insulator Test','Pick the walls for a cooler that keeps ice cream frozen for 5 hours.',{goal:5,choose:['wall'],opts:{wall:['alu','steel','wood','foam']},fixed:{lid:'foam',color:'white',ice:'small'},
    intro:'Heat always moves from **warmer** things to **colder** things. A cooler cannot stop heat, but good walls can **slow it down**. Choose, then press **Test it**.',
    fact:'Metals are conductors: heat moves through them quickly. Foam is an insulator: it is full of tiny pockets of trapped air, and air moves heat very slowly.',
    clue:'Which wall material would feel warm to the touch, and which would feel cold, if you held it on a hot day? Metal moves heat fast.'}),
  KFL('Lid or Not?','The foam cooler needs a lid. Keep the ice cream frozen for 7 hours.',{goal:7,choose:['lid'],fixed:{wall:'foam',color:'white',ice:'small'},
    fact:'An open top lets warm air flow right in. That is convection: heat moving with flowing air or liquid. A tight insulated lid stops it.',
    clue:'Warm air can flow in through any opening. Which lid blocks the air AND insulates?'}),
  KFL('Beach Day','Bright sun on the beach, 35°C. Keep it frozen for 5 hours.',{goal:5,Tout:35,sun:true,choose:['color'],fixed:{wall:'foam',lid:'foam',ice:'small'},
    fact:'Dark colors absorb more of the Sun’s energy (radiation), and light colors reflect more. That is why light clothes feel cooler in summer.',
    clue:'Which color shirt feels hotter on a sunny day?'}),
  {name:'Cocoa Cool-Down',story:'Two mugs of hot cocoa sit in a 20°C room.',type:'predict',rounds:[
      {q:'A small cup (100 g) and a big pot (500 g) of cocoa both start at 70°C. Which cools down to room temperature first?',opts:[['small','The small cup'],['big','The big pot'],['same','Both at the same time']],ans:'small',
        a:['Small cup (100 g)',[70,52,40,32,27,24,22,21,20.5,20.2,20]],b:['Big pot (500 g)',[70,64,58,53,48,44,40,37,34,32,30]],why:'The small cup has less mass, so it has less thermal energy to lose. It cools faster.'},
      {q:'By the time BOTH reach room temperature, which one gave off more heat energy to the room?',opts:[['big','The big pot'],['small','The small cup'],['same','They gave off the same amount']],ans:'big',why:'Both cooled by 50°C, but the big pot has 5 times the mass, so it gave off about 5 times as much energy.'}],
    intro:'Make your prediction, then watch the thermometers.',fact:'The energy needed to change temperature depends on the mass. More mass means more energy is transferred for the same temperature change.',
    clue:'More mass means more matter to warm up or cool down.'},
  {name:'Sand vs Water',story:'A heat lamp shines on 1 kg of sand and 1 kg of water for 10 minutes.',type:'predict',rounds:[
      {q:'Both start at 20°C and get the same energy from the lamp. Which one gets hotter?',opts:[['sand','The sand'],['water','The water'],['same','They warm up the same']],ans:'sand',
        a:['Sand',[20,24,28,32,36,40,44,47,50,53,56]],b:['Water',[20,21,22,23,24,25,26,27,28,29,30]],why:'Water needs much more energy to warm up than sand does. With the same energy, the sand gets much hotter.'},
      {q:'On a sunny beach, why is the sand burning hot while the water is still cool?',opts:[['water','Water needs more energy to change temperature than sand.'],['wet','The water is wet, so it can’t get hot.'],['shade','The water is in the shade.']],ans:'water',why:'Different materials need different amounts of energy to change temperature. Water needs a lot.'}],
    fact:'Water can absorb a lot of energy with only a small temperature change. That is why oceans and lakes keep nearby places milder.',
    clue:'Same mass, same energy, different materials. Which material changes temperature more easily?'},
  {name:'Ice Pack Size',story:'Two identical coolers. One has a 200 g ice pack, one has an 800 g ice pack.',type:'predict',rounds:[
      {q:'Which cooler keeps the ice cream frozen longer?',opts:[['big','The one with the 800 g ice pack'],['small','The one with the 200 g ice pack'],['same','Both the same']],ans:'big',
        a:['800 g pack',[-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0]],b:['200 g pack',[-10,-6,-2,1,4,7,10,12,14,15,16]],why:'More ice has to absorb more energy before it all melts, so the bigger pack lasts longer.'},
      {q:'One pot holds 1 liter of water and another holds 2 liters. Both are on the same burner. To warm each by 10°C, the 2-liter pot takes...',opts:[['twice','About twice as long'],['half','About half as long'],['same','The same time']],ans:'twice',why:'Twice the mass needs about twice the energy for the same temperature change, so it takes about twice as long.'}],
    fact:'Energy transferred = how much matter × how much the temperature changes × what kind of matter it is. Change any one and the energy changes.',
    clue:'More mass, more energy needed.'},
  KFL('Picnic Planner','A shady park, 30°C. Keep it frozen for 6 hours on a $8 budget.',{goal:6,choose:['wall','lid','ice'],opts:{wall:['alu','card','foam']},fixed:{color:'white'},budget:8,
    fact:'Good engineers balance cost and performance. An insulated lid can matter as much as thick walls.',
    clue:'Spend your money where heat gets in the most. Metal walls are hopeless; which upgrades help most?'}),
  KFL('Delivery Truck','A sunny summer street, 38°C. Keep it frozen for 6 hours on a $10 budget.',{goal:6,Tout:38,sun:true,choose:['wall','lid','color','ice'],opts:{wall:['steel','wood','foam']},budget:10,
    fact:'Ice cream trucks use thick insulated walls, tight doors and light colors, and many have a freezer that removes heat using energy.',
    clue:'Sun, open lids and metal walls all let energy in. Fix the biggest leaks first.'}),
  KFL('Hot Soup','A freezing day at -10°C. Keep soup hot (above 60°C) for 4 hours on a $9 budget.',{goal:4,Tin:80,Tout:-10,capMul:1,choose:['wall','lid','ice'],opts:{wall:['alu','card','wood','foam']},fixed:{color:'white'},budget:9,soup:true,
    intro:'Now heat flows **out** of the hot soup into the cold air. The same insulators slow it down. (The "ice pack" here is the size of the soup pot.)',
    fact:'Insulators slow heat flow in both directions. A thermos keeps cold drinks cold AND hot drinks hot.',
    clue:'Does an insulator care which way the heat is moving?'})
];
const KF_PACKS={0:'Pack 1: Stop the heat',3:'Pack 2: Mass and matter',6:'Pack 3: Design on a budget'};
function kfCooler(L,d,state){
  const W=380,H=220,col={black:'#2a2a2a',blue:'#284a8a',white:'#f2f2f2'}[d.color||'white'],wall={alu:'#c3cad5',steel:'#8a93a3',card:'#c9a46a',wood:'#a8723a',foam:'#f4f6fb'}[d.wall||'foam'];
  let t=`<rect width="${W}" height="${H}" fill="${L.sun?'#ffe9a8':L.Tout<0?'#dfeefa':'#e6f2df'}"/>`;
  if(L.sun)t+=`<circle cx="340" cy="34" r="22" fill="#ffc72a"/>`+[0,1,2,3,4].map(i=>`<path d="M${330-i*14} ${58+i*6}l-18 18" stroke="#ffb000" stroke-width="3"/>`).join('');
  if(L.Tout<0)t+=[30,90,150,260,320].map((x,i)=>`<text x="${x}" y="${30+i%2*20}" font-size="16">❄</text>`).join('');
  t+=`<rect x="90" y="70" width="200" height="120" rx="10" fill="${wall}" stroke="#5a6475" stroke-width="3"/><rect x="104" y="84" width="172" height="96" rx="6" fill="${col==='#f2f2f2'?'#ffffff':col}" opacity="${d.color?1:0}"/>`+
    `<rect x="114" y="94" width="152" height="80" rx="4" fill="#eaf4ff"/>`;
  const melt=state==='fail';
  t+=L.soup?`<ellipse cx="190" cy="150" rx="50" ry="16" fill="#c96a2a"/><text x="190" y="${melt?150:140}" text-anchor="middle" font-size="26">${melt?'🥶':'🍲'}</text>`:`<text x="190" y="150" text-anchor="middle" font-size="40">${melt?'🫠':'🍨'}</text>`;
  if(d.ice)t+=`<rect x="${d.ice==='big'?122:128}" y="${d.ice==='big'?100:110}" width="${d.ice==='big'?36:22}" height="${d.ice==='big'?60:40}" rx="4" fill="#8fd0ff" stroke="#4fa3ff" stroke-width="2"/>`;
  if(d.lid==='foam')t+=`<rect x="84" y="58" width="212" height="18" rx="6" fill="#f4f6fb" stroke="#5a6475" stroke-width="3"/>`;
  else if(d.lid==='thin')t+=`<rect x="86" y="64" width="208" height="8" rx="3" fill="#bde0ff" stroke="#5a6475" stroke-width="2" opacity=".85"/>`;
  else t+=`<path d="M120 60q10-14 20 0t20 0M220 60q10-14 20 0t20 0" stroke="#ff7a4a" stroke-width="3" fill="none"/>`;
  t+=`<text x="16" y="${H-12}" font-size="13" font-weight="800" fill="#1b2433">Outside: ${L.Tout}°C</text>`;
  return ngSvg(W,H,t,'ngsvg kfsvg','Your cooler design');
}
ngDef({key:'frozen',name:'Keep It Frozen',ic:'snow',std:'MS-PS3-3 · PS3-4',subj:'phys',cap3:true,
  short:'Design a cooler that slows down heat transfer.',menuDesc:'Design a cooler that keeps ice cream frozen, and predict how mass and materials change temperature.',
  intro:'Heat always flows from warmer things to colder things. Design coolers that slow that flow down, and predict how the amount and type of matter change how fast things heat up and cool down.',
  how:['**Choose** walls, a lid, a color or an ice pack. Read what each one is made of.','Press **Test it** to run the clock. The goal line shows how long it must last.','Pass on the first test for 3 ★. Prediction levels: predict first, then watch the graph.'],
  levels:KF_LEVELS,packs:KF_PACKS,
  mini:L=>svgEl(`<svg viewBox="0 0 44 30" width="48" height="32" aria-hidden="true">${L.type==='predict'?'<polyline points="4,6 14,14 24,20 40,24" fill="none" stroke="#e2483f" stroke-width="2.6"/><polyline points="4,6 14,9 24,12 40,16" fill="none" stroke="#2f6bff" stroke-width="2.6"/>':`<rect x="6" y="9" width="32" height="18" rx="3" fill="#f4f6fb" stroke="#5a6475" stroke-width="2"/><text x="22" y="23" text-anchor="middle" font-size="12">${L.soup?'🍲':'🍨'}</text>`}</svg>`),
  start(G){const L=G.L;G.st=L.type==='predict'?{r:0,pick:null,wrong:[],okNow:false,msg:null,ran:false}:{d:Object.assign({},L.fixed||{}),res:null,msg:null};
    if(L.type!=='predict')L.choose.forEach(c=>{if(!G.st.d[c])G.st.d[c]=null;});},
  hud(G){return G.L.type==='predict'?{label:'Mistakes',val:G.miss,target:'3 ★ = no mistakes'}:{label:'Tests',val:G.tries,target:'3 ★ = pass on the first test'};},
  render(G,main,side){
    const L=G.L,S=G.st;
    if(L.type==='predict'){const R=L.rounds[S.r];
      const graph=R&&R.a&&S.ran?ngChart([{name:R.a[0],color:'#e2483f',vals:R.a[1].map(v=>(v+10)/90)},{name:R.b[0],color:'#2f6bff',vals:R.b[1].map(v=>(v+10)/90)}],{w:460,h:220,xlab:'Time →',ylab:'Temperature',anim:1,label:'Temperature graph'}):
        h('div',{class:'kfwait'},h('div',{class:'pgbig'},I('snow',80)),h('p',null,R&&R.a?'Predict first. Then the graph shows what happens.':'Think about mass and the type of matter.'));
      ngRC(main,graph);
      const prog=h('div',{class:'ppsteps'},...L.rounds.map((x,k)=>h('span',{class:'ppst'+(k<S.r||(k===S.r&&S.okNow)?' ok':k===S.r?' on':'')},'Round '+(k+1))));
      ngRC(side,prog,...(R?[h('p',{class:'ppq'},R.q),h('div',{class:'ppmc'},...R.opts.map(([v,t])=>h('button',{type:'button',class:'ngc wide'+(S.wrong.includes(v)?' no':'')+(S.okNow&&v===R.ans?' ok':''),disabled:G.done||S.okNow||S.wrong.includes(v),onclick:()=>kfAnswer(v)},t)))]:[]),
        S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null,S.okNow?ngBtn(S.r+1<L.rounds.length?'Next round ▶':'Finish ▶',kfNextRound,'good',{style:'width:100%;margin-top:6px',disabled:G.done}):null);
      if(!S.msg)ngSay('Make your prediction.');return;}
    const d=S.d,ready=L.choose.every(c=>d[c]);
    const hrs=S.res?S.res.hours:null,gl=L.goal,span=Math.max(gl+2,6);
    const curve=hrs!=null?Array.from({length:13},(_,i)=>{const tt=i*span/12;return Math.max(0,1-tt/hrs);}):null;
    ngRC(main,kfCooler(L,d,S.res?(S.res.ok?'ok':'fail'):null),
      curve?h('div',null,h('div',{class:'osl'},`${L.soup?'Heat':'Cold'} left in the cooler · goal: ${gl} hours`),ngChart([{color:S.res.ok?'#1f9d55':'#d64545',vals:curve,name:`lasted ${hrs.toFixed(1)} h`}],{w:380,h:150,xlab:`Time (0 to ${span} hours)`,anim:1,label:'Graph of how long the cooler lasts'})):null);
    const cats=L.choose.map(c=>{const opts=(L.opts&&L.opts[c])||Object.keys(KF_OPT[c].o);
      return h('div',{class:'kfcat'},h('div',{class:'osl'},KF_OPT[c].lab),ngChoices(opts.map(k=>[k,KF_OPT[c].o[k][0],(L.budget?'$'+KF_OPT[c].o[k][2]+' · ':'')+KF_INFO[k]]),d[c],v=>{if(G.done)return;d[c]=v;S.res=null;S.msg=null;ngRender();},{cls:'col',locked:G.done}));});
    const cost=ready&&L.budget?kfCost(L,d):null;
    ngRC(side,h('div',{class:'kfgoal'},`Goal: ${L.soup?'keep the soup hot':'keep it frozen'} for `,h('b',null,L.goal+' hours'),L.budget?h('span',null,' · budget ',h('b',null,'$'+L.budget)):null),...cats,
      cost!=null?h('div',{class:'csbudget'+(cost>L.budget?' over':'')},'Cost ',h('b',null,'$'+cost),' / $'+L.budget):null,
      S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null,
      ngBtn([I('clock'),' Test it'],kfTest,'good',{style:'width:100%;font-size:18px',disabled:!ready||G.done||(cost!=null&&cost>L.budget)}));
    if(!S.msg)ngSay(!ready?'Choose an option in every group.':cost!=null&&cost>L.budget?'Over budget! Choose cheaper options.':'Ready? Press **Test it**.');
  },
  hints(G){const L=G.L;if(L.type==='predict'){const R=L.rounds[G.st.r]||L.rounds[0];return [L.clue,'More mass = more energy needed to change temperature. Water needs more energy to warm up than sand or metal.','Answer: '+R.opts.find(o=>o[0]===R.ans)[1]+'.'];}
    const p=kfDesigns(L).filter(d=>kfPass(L,d)).sort((a,b)=>kfCost(L,a)-kfCost(L,b))[0];
    return [L.clue,'Heat gets in three ways: through the walls (conduction), through openings with moving air (convection), and from sunlight (radiation). Insulators, lids and light colors slow each one.',
      p?'A design that works: '+L.choose.map(c=>KF_OPT[c].o[p[c]][0]).join(' + ')+'.':''];}
});
function kfTest(){
  const L=G.L,S=G.st;if(G.done)return;G.tries++;const hrs=kfHours(L,S.d),ok=hrs>=L.goal;if(ngT())return ngTDone(ok?1:0);S.res={hours:hrs,ok};
  if(ok){S.msg=['ok',`✓ It lasted ${hrs.toFixed(1)} hours. Goal: ${L.goal} hours.`];ngRender();ngSay('Your design worked!','go');G.detail={tests:G.tries};
    ngWin(ngStars(G.tries-1,0,1),['Your design passed on test ',h('b',null,G.tries),'.']);return;}
  G.miss++;const d=S.d,tips=[];
  if(d.wall&&['alu','steel'].includes(d.wall))tips.push('Metal walls conduct heat quickly.');
  if(d.lid==='none')tips.push('With no lid, warm air flows right in.');else if(d.lid==='thin')tips.push('A thin lid does not insulate much.');
  if(L.sun&&d.color&&d.color!=='white')tips.push('A dark color absorbs sunlight.');
  if(d.wall&&['card','wood'].includes(d.wall)&&!tips.length)tips.push('These walls let heat through faster than the best insulator.');
  if(d.ice==='small'&&!tips.length)tips.push('More cold stored inside would last longer.');
  S.msg=['no',`It only lasted ${hrs.toFixed(1)} hours (goal ${L.goal}). ${tips[0]||'Find where the heat is getting in.'}`];
  fx.pop({icon:'snow',text:L.soup?'The soup got cold':'It melted!',kind:'oops'});ngRender();ngSay(S.msg[1],'alert');
}
function kfAnswer(v){const S=G.st,R=G.L.rounds[S.r];if(S.okNow||G.done)return;S.ran=true;
  if(ngT())return ngTAns(v===R.ans,kfNextRound);
  if(v===R.ans){S.okNow=true;S.msg=['ok',R.why];fx.pop({icon:'snow',text:'Correct!',kind:'good'});ngRender();ngSay('Right! '+R.why,'go');}
  else{S.wrong.push(v);G.miss++;G.tries++;S.msg=['no','Not quite. '+(R.a?'Look at the graph. ':'')+R.why];fx.pop({icon:'snow',text:'Not quite',kind:'oops'});ngRender();ngSay(S.msg[1],'alert');}}
function kfNextRound(){const S=G.st;S.r++;S.okNow=false;S.wrong=[];S.msg=null;S.ran=false;
  if(S.r>=G.L.rounds.length){S.r--;S.okNow=true;G.detail={mistakes:G.miss};ngWin(ngStars(G.miss,0,1),['You finished with ',h('b',null,G.miss),` mistake${G.miss===1?'':'s'}.`]);return;}ngRender();}
NGTHUMB.frozen=()=>{
  let t=`<circle cx="276" cy="36" r="22" fill="#ffc72a"/>`+[0,1,2].map(i=>`<path d="M${262-i*16} ${60+i*6}l-16 16" stroke="#ffb000" stroke-width="3.5"/>`).join('')+
    `<rect x="70" y="60" width="180" height="100" rx="12" fill="#f4f6fb" stroke="#5a6475" stroke-width="4"/><rect x="62" y="46" width="196" height="20" rx="7" fill="#f4f6fb" stroke="#5a6475" stroke-width="4"/>`+
    `<text x="160" y="138" text-anchor="middle" font-size="54">🍨</text><rect x="196" y="82" width="30" height="56" rx="5" fill="#8fd0ff" stroke="#4fa3ff" stroke-width="3"/>`+ngStar(30,30,7,'#f6efe0',.8);
  return ngWrap('frozen','#2f8fbf',t);
};
