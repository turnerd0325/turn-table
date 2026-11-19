/* ================= EARTH 4: WEATHER DESK (MS-ESS2-5, ESS2-6) =================
   You are the forecaster. Read fronts, air masses, highs and lows on the map, make a forecast
   for each city, THEN play tomorrow and see how you did. Pack 3 covers land, lakes and oceans. */
const WD_CITY={buf:['Buffalo',92,168],roc:['Rochester',160,128],syr:['Syracuse',232,138],alb:['Albany',330,160],nyc:['New York City',350,262],tor:['Toronto',118,62],bos:['Boston',430,118]};
const WD_F={temp:[['warm','Warmer','🌡↑'],['same','About the same',''],['cold','Colder','🌡↓']],sky:[['wet','Rain or storms',''],['dry','Dry','']],
  humid:[['humid','More humid (muggy)',''],['dryair','Drier air','']],snow:[['snow','Heavy snow',''],['none','Little or none','']]};
const WD_FL={temp:'Temperature',sky:'Rain?',humid:'Air',snow:'Snow?'};
const WR={city:(o)=>Object.assign({t:'city'},o),mc:(q,opts,ans,why,pic)=>({t:'mc',q,opts,ans,why,pic})};
const WDL=(name,story,rounds,o)=>Object.assign({name,story,rounds},o);
const WD_HOT=[['wh','Warm and humid'],['wd','Warm and dry'],['ch','Cold and humid'],['cd','Cold and dry']];
const WD_LEVELS=[
  WDL('Cold Front','A cold front is moving east across New York State.',[WR.city({map:{fronts:[{k:'cold',p:[[150,10],[128,150],[112,300]],dx:150}],masses:[['Cold, dry air',50,80,'#7fb0ff'],['Warm, humid air',300,70,'#ff9c7a']]},fields:['temp','sky'],
      cities:[['buf',{temp:'same',sky:'dry'},'The front already passed Buffalo. It stays in the cold, dry air behind the front.'],
        ['roc',{temp:'cold',sky:'wet'},'The cold front passes Rochester tomorrow: a burst of rain or storms, then colder air.'],
        ['syr',{temp:'cold',sky:'wet'},'The front reaches Syracuse tomorrow too: storms as it passes, then colder air.'],
        ['alb',{temp:'same',sky:'dry'},'The front will not reach Albany until the day after. Albany stays in the warm air for now.']]})],
    {intro:'A **cold front** (blue triangles) is the edge of a cold air mass pushing into warmer air. The triangles point the way it is moving. It will move about this far by tomorrow.',
     fact:'Cold air is dense and wedges under warm air, pushing it up fast. That quick lifting makes towering clouds, heavy rain or thunderstorms, and then a cool, dry change.',
     clue:'Which cities will the front pass by tomorrow? Which are already behind it, and which are too far ahead?'}),
  WDL('Warm Front','A warm front is moving slowly north.',[WR.city({map:{fronts:[{k:'warm',p:[[0,232],[230,218],[460,204]],dy:-76}],masses:[['Cool air',150,60,'#7fb0ff'],['Warm, humid air',200,280,'#ff9c7a']]},fields:['temp','sky'],
      cities:[['nyc',{temp:'same',sky:'dry'},'New York City is already south of the front, in the warm air. Not much changes.'],
        ['alb',{temp:'warm',sky:'wet'},'The warm front passes Albany: steady rain first, then warmer, more humid air.'],
        ['syr',{temp:'same',sky:'wet'},'The front stops just short of Syracuse, but warm air slides up over the cool air far ahead of the front, so steady rain spreads over Syracuse.']]})],
    {intro:'A **warm front** (red half-circles) is warm air sliding up and over cooler air. It moves north here.',
     fact:'Warm fronts move slowly. Warm air rises gently over cold air, so a wide area of clouds and steady rain often comes well before the front arrives.',
     clue:'Rain from a warm front spreads out AHEAD of it, not just at the front line.'}),
  WDL('Storm System','A low-pressure storm is crossing the state.',[WR.city({map:{lows:[[150,120,'L']],fronts:[{k:'warm',p:[[150,120],[300,175],[440,205]],dx:120},{k:'cold',p:[[150,120],[128,210],[110,300]],dx:120}],masses:[['Warm, humid air',270,272,'#ff9c7a'],['Cold air',40,250,'#7fb0ff']]},fields:['temp','sky'],
      cities:[['buf',{temp:'same',sky:'dry'},'Buffalo is behind the cold front, in cold, dry air. It stays that way.'],
        ['alb',{temp:'warm',sky:'wet'},'The warm front passes Albany: rain, then warmer air.'],
        ['nyc',{temp:'same',sky:'dry'},'New York City is in the warm air between the two fronts, and the cold front does not reach it yet.']]})],
    {intro:'A **low (L)** is a storm center. A warm front and a cold front spin out from it. The whole system moves east about this far by tomorrow.',
     fact:'Most big storms in New York are low-pressure systems with a warm front and a cold front. Forecasters watch where the fronts will be to predict each town’s weather.',
     clue:'Handle one front at a time. Which front crosses each city tomorrow, if any?'}),
  WDL('Air Mass Factory','Air takes on the temperature and moisture of the place where it sits.',[
      WR.mc('Air that sits over the warm Gulf of Mexico for days becomes...',WD_HOT,'wh','Warm water heats the air and adds lots of water vapor, so the air becomes warm and humid.','gulf'),
      WR.mc('Air that sits over snowy northern Canada in winter becomes...',WD_HOT,'cd','Cold land chills the air, and there is little water to add moisture, so it becomes cold and dry.','canada'),
      WR.mc('Air that sits over the hot deserts of the Southwest becomes...',WD_HOT,'wd','Hot, dry land makes hot, dry air.','desert'),
      WR.mc('Air that sits over the cold North Atlantic Ocean becomes...',WD_HOT,'ch','Cold water cools the air, and the ocean adds moisture, so it becomes cool and humid.','atlantic')],
    {fact:'An air mass is a huge body of air with about the same temperature and humidity throughout. It gets those properties from where it forms.',
     clue:'Over water = humid. Over land = dry. Near the equator = warm. Near the pole = cold.'}),
  WDL('Air Mass Arrives','Two different air masses are on the move.',[
      WR.city({map:{masses:[['Cold, dry air from Canada',150,60,'#7fb0ff',1,40,60]],arrows:[[150,40,200,110]]},fields:['temp','humid'],
        cities:[['buf',{temp:'cold',humid:'dryair'},'The cold, dry Canadian air pours into Buffalo.'],
          ['roc',{temp:'cold',humid:'dryair'},'Rochester also gets the cold, dry air.'],
          ['nyc',{temp:'same',humid:'humid'},'The cold air does not reach New York City by tomorrow, and the ocean keeps the air there humid.']]}),
      WR.city({map:{masses:[['Warm, humid air from the Gulf',360,290,'#ff9c7a',1,0,-70]],arrows:[[360,300,350,220]]},fields:['temp','humid'],
        cities:[['nyc',{temp:'warm',humid:'humid'},'Warm, muggy Gulf air surges into New York City.'],
          ['alb',{temp:'warm',humid:'humid'},'The warm, humid air reaches Albany too.'],
          ['buf',{temp:'same',humid:'dryair'},'The warm air does not reach Buffalo. It stays in the drier air.']]})],
    {fact:'When a new air mass moves in, the weather changes to match it: Canadian air brings cold, crisp days, and Gulf air brings hot, muggy days.',
     clue:'A city only changes if the air mass actually reaches it.'}),
  WDL('Highs and Lows','A high and a low are on the weather map.',[
      WR.city({map:{highs:[[120,150,'H']],lows:[[400,210,'L']],clouds:[[400,210]]},fields:['sky'],
        cities:[['buf',{sky:'dry'},'Buffalo is under the high. Sinking air means clear, dry weather.'],
          ['roc',{sky:'dry'},'Rochester is also under the high: dry and sunny.'],
          ['nyc',{sky:'wet'},'New York City is near the low. Rising air makes clouds and rain.'],
          ['bos',{sky:'wet'},'Boston is near the low too: cloudy and rainy.']]}),
      WR.mc('Why do lows usually bring clouds and rain?',[['rise','Air rises, cools, and water vapor condenses into clouds.'],['sink','Air sinks and gets warmer.'],['wind','There is no wind in a low.']],'rise','In a low, air flows in and rises. Rising air cools, and the water vapor in it condenses into clouds and rain.')],
    {fact:'High pressure (H) usually means fair, dry weather. Low pressure (L) usually means clouds, rain or snow.',
     clue:'H = air sinking = clear. L = air rising = clouds.'}),
  WDL('Beach Breeze','A hot summer day at a beach on Long Island.',[
      WR.mc('On a hot, sunny afternoon, which way does the wind blow at the beach?',[['sea','From the ocean toward the land (a sea breeze)'],['land','From the land toward the ocean'],['none','There is no wind on sunny days']],'sea','Land heats up faster than water, so warm air over the land rises, and cooler air from the ocean flows in to replace it.','day'),
      WR.mc('Why does the land heat up faster than the ocean?',[['water','Water needs much more energy to warm up than land does.'],['dark','The ocean is darker, so it reflects heat.'],['sun','The Sun only shines on land.']],'water','Water can absorb lots of energy with only a small temperature change. Sand and rock warm up much more quickly.','day'),
      WR.mc('At night, which way does the wind blow?',[['land','From the land toward the ocean (a land breeze)'],['sea','From the ocean toward the land'],['up','Straight up into the sky']],'land','At night the land cools faster than the water. Now the air over the warmer ocean rises, and air flows from the land out to sea.','night')],
    {fact:'Sea breezes are a small version of what happens all over Earth: uneven heating of land and water makes air move.',
     clue:'Air rises where it is warmest. Cooler air flows in to take its place.'}),
  WDL('Lake-Effect Snow','A freezing wind from the northwest blows across the Great Lakes in December.',[
      WR.city({map:{wind:[[40,40],[110,100],[150,40],[210,100]],lakeSnow:1},fields:['snow'],
        cities:[['buf',{snow:'snow'},'Buffalo is downwind of Lake Erie. The cold wind picks up heat and moisture from the lake and dumps it as snow.'],
          ['syr',{snow:'snow'},'Syracuse is downwind (southeast) of Lake Ontario, so it gets lake-effect snow too.'],
          ['tor',{snow:'none'},'Toronto is on the upwind side. The air has not crossed the lake yet, so it is still dry.'],
          ['alb',{snow:'none'},'Albany is far from the lakes. By the time the air gets there, most of the snow has fallen.']]}),
      WR.mc('Why does lake-effect snow happen?',[['warm','Cold air crosses warmer lake water, picks up heat and moisture, then rises and snows.'],['ice','The lake freezes and the ice blows onto land.'],['cold','The lake makes the air colder, and cold air always snows.']],'warm','The lake water is warmer than the air. It adds heat and water vapor to the air, which rises, cools and drops heavy snow downwind.')],
    {fact:'Parts of New York, like the Tug Hill area east of Lake Ontario, get over 300 inches of snow in a winter because of lake-effect snow.',
     clue:'Snow falls DOWNWIND of the lake, after the air has crossed the water.'}),
  WDL('Ocean Heaters','Oceans move heat around the planet.',[
      WR.mc('London, England is about as far north as Labrador, Canada. Why are London’s winters so much milder?',[['gulf','A warm ocean current (the Gulf Stream) brings heat from the tropics.'],['sun','London gets more sunlight.'],['city','Big cities make their own heat.']],'gulf','The Gulf Stream carries warm water from near the equator across the Atlantic, warming the air in western Europe.','gulf'),
      WR.mc('Which city has a SMALLER difference between summer and winter temperatures?',[['coast','A city on the ocean coast'],['inland','A city far inland'],['same','They are always the same']],'coast','Water warms up and cools down slowly, so the ocean keeps nearby coastal cities milder all year.','coast'),
      WR.mc('How do ocean currents affect climate around the world?',[['carry','They carry warm water toward the poles and cold water toward the equator.'],['stop','They stop heat from moving.'],['salt','They only move salt around.']],'carry','Currents act like a global conveyor belt, moving heat from warm places to cold places and shaping each region’s climate.','gulf')],
    {fact:'The Gulf Stream moves more water than all the rivers in the world combined.',
     clue:'Water holds heat for a long time, and moving water carries that heat with it.'})
];
const WD_PACKS={0:'Pack 1: Fronts',3:'Pack 2: Air masses and pressure',6:'Pack 3: Land, lakes and oceans'};
function wdFrontSvg(f,off){
  const pts=f.p.map(([x,y])=>[x+(off?f.dx||0:0),y+(off?f.dy||0:0)]),col=f.k==='cold'?'#2f6bff':'#d64545';
  let t=`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="5" stroke-linejoin="round"/>`;
  const mv=[f.dx||0,f.dy||0],ml=Math.hypot(mv[0],mv[1])||1,ux=mv[0]/ml,uy=mv[1]/ml;
  for(let i=0;i<pts.length-1;i++){const [x0,y0]=pts[i],[x1,y1]=pts[i+1],len=Math.hypot(x1-x0,y1-y0),n=Math.max(1,Math.floor(len/38));
    for(let k=0;k<n;k++){const u=(k+.5)/n,x=x0+(x1-x0)*u,y=y0+(y1-y0)*u,tx=(x1-x0)/len,ty=(y1-y0)/len;
      if(f.k==='cold')t+=`<path d="M${x-tx*8} ${y-ty*8}L${x+ux*13} ${y+uy*13}L${x+tx*8} ${y+ty*8}Z" fill="${col}"/>`;
      else{const a=Math.atan2(ty,tx)*180/Math.PI,sw=(tx*uy-ty*ux)>0?0:1;t+=`<path d="M${x-tx*8} ${y-ty*8}A8 8 0 0 ${sw} ${x+tx*8} ${y+ty*8}Z" fill="${col}"/>`;void a;}}}
  return t;
}
function wdMap(R,S){
  const W=460,H=300,M=R.map||{},played=S.played;let t='';
  t+=`<rect width="${W}" height="${H}" fill="#e3edd2"/><path d="M380 300L380 250Q420 230 460 200V300Z" fill="#9cc8ec"/><path d="M300 300Q330 285 360 300Z" fill="#9cc8ec"/>`+
    `<path d="M20 230Q70 185 120 190Q130 205 70 240Q40 252 20 250Z" fill="#9cc8ec"/><path d="M110 95Q170 70 250 86Q262 100 240 108Q170 112 115 110Z" fill="#9cc8ec"/>`+
    `<text x="62" y="228" font-size="10" fill="#2a5a8a" font-weight="700">Lake Erie</text><text x="150" y="102" font-size="10" fill="#2a5a8a" font-weight="700">Lake Ontario</text><text x="408" y="268" font-size="10" fill="#2a5a8a" font-weight="700">Atlantic</text>`;
  (M.masses||[]).forEach(([lab,x,y,c,moves,mx,my])=>{const ox=played&&moves?mx:0,oy=played&&moves?my:0;t+=`<g class="wdmove"><ellipse cx="${x+ox}" cy="${y+oy}" rx="90" ry="40" fill="${c}" opacity=".28"/><text x="${x+ox}" y="${y+oy+4}" text-anchor="middle" font-size="12" font-weight="800" fill="#1b2433">${ngEsc(lab)}</text></g>`;});
  (M.arrows||[]).forEach(([x0,y0,x1,y1])=>{t+=`<path d="M${x0} ${y0}L${x1} ${y1}" stroke="#5b6b86" stroke-width="4" stroke-dasharray="6 5" marker-end="url(#wda)"/>`;});
  if(M.lakeSnow&&played)t+=`<path d="M70 200Q110 170 130 200T190 190" stroke="#fff" stroke-width="22" fill="none" opacity=".85"/><path d="M200 108Q240 120 262 150" stroke="#fff" stroke-width="22" fill="none" opacity=".85"/>`;
  (M.wind||[]).forEach(([x,y])=>{t+=`<path d="M${x} ${y}l40 40" stroke="#2f6bff" stroke-width="4" marker-end="url(#wda)"/>`;});
  (M.fronts||[]).forEach(f=>{if(played)t+=`<g opacity=".25">${wdFrontSvg(f,false)}</g>`;t+=wdFrontSvg(f,played);
    if(!played&&(f.dx||f.dy)){const [x,y]=f.p[1];t+=`<path d="M${x+10} ${y+20}l${(f.dx||0)*.35} ${(f.dy||0)*.35}" stroke="#5b6b86" stroke-width="3" stroke-dasharray="4 4" marker-end="url(#wda)"/>`;}});
  (M.highs||[]).forEach(([x,y])=>{t+=`<text x="${x}" y="${y}" text-anchor="middle" font-size="40" font-weight="900" fill="#2f6bff">H</text>`;});
  (M.lows||[]).forEach(([x,y])=>{const o=(M.fronts&&M.fronts[0]&&played)?M.fronts[0].dx||0:0;t+=`<text x="${x+o}" y="${y+14}" text-anchor="middle" font-size="40" font-weight="900" fill="#d64545">L</text>`;});
  (M.clouds||[]).forEach(([x,y])=>{t+=`<g opacity=".8"><ellipse cx="${x-30}" cy="${y-30}" rx="30" ry="16" fill="#fff"/><ellipse cx="${x}" cy="${y-38}" rx="34" ry="20" fill="#fff"/><ellipse cx="${x+30}" cy="${y-28}" rx="26" ry="14" fill="#fff"/></g>`;});
  (R.cities||[]).forEach(([id,ans],k)=>{const [nm,x,y]=WD_CITY[id],r=S.res&&S.res[k];
    t+=`<circle cx="${x}" cy="${y}" r="6" fill="#1b2433"/><text x="${x}" y="${y-11}" text-anchor="middle" font-size="12" font-weight="900" fill="#1b2433" stroke="#fff" stroke-width="3" paint-order="stroke">${ngEsc(nm)}</text>`;
    if(played){const ic=ans.snow==='snow'?'❄':ans.sky==='wet'?'🌧':ans.temp==='warm'?'🌡':ans.temp==='cold'?'🧊':'☀';t+=`<text x="${x+16}" y="${y+18}" font-size="18">${ic}</text>`;
      if(r!=null)t+=`<circle cx="${x-14}" cy="${y+14}" r="9" fill="${r?'#1f9d55':'#d64545'}"/><text x="${x-14}" y="${y+18}" text-anchor="middle" font-size="11" font-weight="900" fill="#fff">${r?'✓':'✗'}</text>`;}});
  return ngSvg(W,H,`<defs><marker id="wda" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5 0 10z" fill="#2f6bff"/></marker></defs>`+t,'ngsvg wdsvg','Weather map of New York State');
}
function wdPic(k){
  const W=460,H=260;let t='';
  if(k==='day'||k==='night'){const day=k==='day';
    t=`<rect width="${W}" height="${H}" fill="${day?'#bfe3ff':'#1d2a55'}"/><rect y="170" width="230" height="90" fill="#e6cf95"/><rect x="230" y="178" width="230" height="82" fill="#3a8ad0"/>`+
      (day?`<circle cx="60" cy="50" r="28" fill="#ffd34d"/>`:`<circle cx="60" cy="50" r="22" fill="#f6efc8"/>`)+
      `<text x="115" y="215" text-anchor="middle" font-size="14" font-weight="900" fill="#5a4020">LAND</text><text x="345" y="225" text-anchor="middle" font-size="14" font-weight="900" fill="#fff">OCEAN</text>`+
      `<text x="115" y="160" text-anchor="middle" font-size="13" font-weight="800" fill="${day?'#d64545':'#9cc8ff'}">${day?'Warms up fast':'Cools down fast'}</text><text x="345" y="166" text-anchor="middle" font-size="13" font-weight="800" fill="${day?'#2a5a8a':'#ffb07a'}">${day?'Stays cooler':'Stays warmer'}</text>`;
    return ngSvg(W,H,t,'ngsvg','Land and ocean '+(day?'by day':'at night'));}
  const reg={gulf:[220,210,'#ff9c7a','Gulf of Mexico'],canada:[230,50,'#7fb0ff','Northern Canada'],desert:[110,160,'#f3c15a','Desert Southwest'],atlantic:[400,80,'#7ad0d0','North Atlantic'],coast:[400,150,'#7ad0d0','Ocean coast']};
  t=`<rect width="${W}" height="${H}" fill="#9cc8ec"/><path d="M30 40Q120 10 260 20Q350 30 380 90Q370 150 330 190Q280 215 230 205Q180 230 120 200Q60 170 40 120Z" fill="#e3edd2"/>`;
  if(k==='gulf'){t+=`<path d="M230 230Q330 190 380 140Q420 100 440 60" stroke="#e2483f" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/><text x="400" y="150" font-size="12" font-weight="900" fill="#a01a1a">Gulf Stream</text>`;}
  const r=reg[k];if(r)t+=`<ellipse cx="${r[0]}" cy="${r[1]}" rx="70" ry="34" fill="${r[2]}" opacity=".7"/><text x="${r[0]}" y="${r[1]+5}" text-anchor="middle" font-size="13" font-weight="900" fill="#1b2433">${r[3]}</text>`;
  return ngSvg(W,H,t,'ngsvg','Map of North America');
}
ngDef({key:'weather',name:'Weather Desk',ic:'rain',std:'MS-ESS2-5 · ESS2-6',subj:'earth',cap3:true,
  short:'Read weather maps and forecast each city.',menuDesc:'You are the forecaster. Read fronts, air masses, highs and lows, then predict tomorrow’s weather for each city.',
  intro:'You are the forecaster! Read the weather map, then predict tomorrow for each city. Then play tomorrow and see how your forecast did. Later levels show how land, lakes and oceans shape weather and climate.',
  how:['**Read the map:** fronts, air masses, highs (H) and lows (L).','**Forecast** each city. Every city needs every answer.','Press **Play tomorrow**. Each city shows ✓ or ✗ with the reason.'],
  levels:WD_LEVELS,packs:WD_PACKS,cap3:true,
  mini:L=>{const R=L.rounds[0];return svgEl(`<svg viewBox="0 0 44 30" width="48" height="32" aria-hidden="true"><rect width="44" height="30" rx="4" fill="#e3edd2"/>${R.t==='city'&&R.map.fronts?R.map.fronts.map(f=>`<polyline points="${f.p.map(([x,y])=>`${x/460*44},${y/300*30}`).join(' ')}" fill="none" stroke="${f.k==='cold'?'#2f6bff':'#d64545'}" stroke-width="2.4"/>`).join(''):'<text x="22" y="21" text-anchor="middle" font-size="15">🌦</text>'}</svg>`);},
  start(G){G.st={r:0,ans:{},played:false,res:null,pick:null,wrong:[],okNow:false,msg:null};},
  hud(G){return {label:'Mistakes',val:G.miss,target:'3 ★ = no mistakes'};},
  render(G,main,side){
    const L=G.L,S=G.st,R=L.rounds[S.r];
    const prog=L.rounds.length>1?h('div',{class:'ppsteps'},...L.rounds.map((x,k)=>h('span',{class:'ppst'+(k<S.r||(k===S.r&&(S.okNow||S.played))?' ok':k===S.r?' on':'')},'Round '+(k+1)))):null;
    if(!R){ngRC(main,);ngRC(side,prog);return;}
    if(R.t==='city'){
      ngRC(main,wdMap(R,S),h('div',{class:'wdkey'},h('span',null,h('i',{class:'wdk cold'}),'Cold front'),h('span',null,h('i',{class:'wdk warm'}),'Warm front'),h('span',null,h('b',{style:'color:#2f6bff'},'H'),' High pressure'),h('span',null,h('b',{style:'color:#d64545'},'L'),' Low pressure')));
      const rows=R.cities.map(([id,ans,why],k)=>{const nm=WD_CITY[id][0],a=S.ans[k]||{},res=S.res&&S.res[k];
        return h('div',{class:'wdcity'+(res!=null?(res?' ok':' no'):'')},h('b',null,nm),
          ...R.fields.map(f=>h('div',{class:'wdf'},h('small',null,WD_FL[f]),ngChoices(WD_F[f].map(o=>[o[0],o[1]]),a[f],v=>{if(S.played)return;(S.ans[k]=S.ans[k]||{})[f]=v;ngRender();},{locked:S.played||G.done,label:nm+' '+WD_FL[f],mark:S.played?{[ans[f]]:'ok',...(a[f]!==ans[f]?{[a[f]]:'no'}:{})}:null}))),
          S.played?h('div',{class:'rpwhy'},res?'✓ ':'✗ ',why):null);});
      const all=R.cities.every((c,k)=>R.fields.every(f=>S.ans[k]&&S.ans[k][f]));
      ngRC(side,...[prog,h('div',{class:'osl'},h('span',{class:'stepchip'},'1'),'Your forecast for tomorrow'),...rows,
        S.played?(S.r+1<L.rounds.length||!G.done?ngBtn(S.r+1<L.rounds.length?'Next round ▶':'Finish ▶',wdNext,'good',{style:'width:100%;margin-top:6px',disabled:G.done}):null)
          :ngBtn([I('play'),' Play tomorrow'],wdPlay,'good',{style:'width:100%;font-size:18px',disabled:!all||G.done})].filter(Boolean));
      if(!S.played)ngSay(all?'Forecast done? Press **Play tomorrow**!':'Read the map, then forecast every city.');
      return;
    }
    ngRC(main,R.pic?wdPic(R.pic):wdMap({map:{}},S));
    ngRC(side,...[prog,h('p',{class:'ppq'},R.q),h('div',{class:'ppmc'},...R.opts.map(([v,t])=>h('button',{type:'button',class:'ngc wide'+(S.wrong.includes(v)?' no':'')+(S.okNow&&v===R.ans?' ok':''),disabled:G.done||S.okNow||S.wrong.includes(v),onclick:()=>wdAnswer(v)},t))),
      S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null,S.okNow?ngBtn(S.r+1<L.rounds.length?'Next round ▶':'Finish ▶',wdNext,'good',{style:'width:100%;margin-top:6px',disabled:G.done}):null].filter(Boolean));
    if(!S.msg)ngSay('Think about how heat and water move.');
  },
  hints(G){const L=G.L,R=L.rounds[G.st.r]||L.rounds[0];
    return [L.clue,'Cold front passing: storms, then colder. Warm front passing: steady rain, then warmer. No front reaching a city: about the same. High = dry; low = rainy. Snow falls downwind of the lakes.',
      R.t==='city'?'Answers: '+R.cities.map(([id,ans])=>`${WD_CITY[id][0]}: ${R.fields.map(f=>WD_F[f].find(o=>o[0]===ans[f])[1].toLowerCase()).join(', ')}`).join('; ')+'.':'Answer: '+R.opts.find(o=>o[0]===R.ans)[1]];}
});
function wdPlay(){
  const L=G.L,S=G.st,R=L.rounds[S.r];if(S.played||G.done)return;S.played=true;S.res=[];let wrong=0;
  R.cities.forEach(([id,ans],k)=>{const a=S.ans[k]||{},ok=R.fields.every(f=>a[f]===ans[f]);S.res.push(ok);R.fields.forEach(f=>{if(a[f]!==ans[f])wrong++;});});
  if(ngT())return ngTAns(1-wrong/(R.cities.length*R.fields.length),wdNext);
  G.miss+=wrong;G.tries++;ngRender();
  ngSay(wrong?`${wrong} part${wrong>1?'s':''} of your forecast missed. Read each ✗ city to see why.`:'Perfect forecast! Every city was right.',wrong?'alert':'go');
  if(wrong)fx.pop({icon:'rain',text:'Forecast missed',kind:'oops'});else fx.pop({icon:'rain',text:'Perfect forecast!',kind:'great'});
}
function wdAnswer(v){const S=G.st,R=G.L.rounds[S.r];if(S.okNow||G.done)return;
  if(ngT())return ngTAns(v===R.ans,wdNext);
  if(v===R.ans){S.okNow=true;S.msg=['ok',R.why];fx.pop({icon:'rain',text:'Correct!',kind:'good'});ngRender();ngSay('Right! '+R.why,'go');}
  else{S.wrong.push(v);G.miss++;G.tries++;S.msg=['no','Not quite. '+R.why];fx.pop({icon:'rain',text:'Not quite',kind:'oops'});ngRender();ngSay(S.msg[1],'alert');}}
function wdNext(){const S=G.st;S.r++;S.ans={};S.played=false;S.res=null;S.wrong=[];S.okNow=false;S.msg=null;
  if(S.r>=G.L.rounds.length){S.r=G.L.rounds.length-1;S.played=true;G.detail={mistakes:G.miss};const m=G.miss;
    ngWin(ngStars(m,0,2),['You finished with ',h('b',null,m),` forecast miss${m===1?'':'es'}.`]);return;}ngRender();}
NGTHUMB.weather=()=>{
  let t=`<rect x="0" y="0" width="320" height="180" fill="#3a7bc8"/><path d="M40 20Q20 90 40 180" stroke="#2f6bff" stroke-width="0"/>`;
  t+=`<ellipse cx="96" cy="60" rx="46" ry="24" fill="#f6efe0"/><ellipse cx="130" cy="50" rx="38" ry="26" fill="#f6efe0"/><ellipse cx="160" cy="64" rx="34" ry="20" fill="#f6efe0"/>`+
    [70,100,130,160].map(x=>`<path d="M${x} 92l-8 18" stroke="#bfe0ff" stroke-width="4" stroke-linecap="round"/>`).join('')+
    `<polyline points="230,10 212,90 200,180" fill="none" stroke="#2f6bff" stroke-width="7"/>`+[[226,30],[218,62],[208,110],[202,150]].map(([x,y])=>`<path d="M${x-7} ${y}l20 4-18 10z" fill="#2f6bff"/>`).join('')+
    `<text x="270" y="140" text-anchor="middle" font-family="system-ui,Arial" font-weight="900" font-size="54" fill="#e2483f">L</text><circle cx="276" cy="44" r="24" fill="#ffd34d"/>`+ngStar(30,160,6,'#f6efe0',.8);
  return ngWrap('weather','#3a7bc8',t);
};
