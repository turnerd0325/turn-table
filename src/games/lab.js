/* ================= GAME 3: COMPOUND LAB ================= */
let LB=null,lbCells={};
function startLab(){
  stopAll();const by=t=>COMPOUNDS.filter(c=>c.t===t),test=tstOn('lab');
  LB={queue:test?TEST_SET.lab():[...sample(by(1),4),...sample(by(2),4),...sample(by(3),2)],i:0,score:0,results:[],test};
  show('s-lab');$('s-lab').classList.toggle('testing',test);$('lbQuit').textContent=test?'Leave test':'Quit';
  if(test)TST.finish=()=>{const right=LB.results.filter(r=>r.ok).length;tstFinish(right/LB.queue.length*100,{right,n:LB.queue.length});};
  const t=buildTable($('lbTable'),{names:true,colors:true,onPick:lbAdd});lbCells=t.map;legend($('lbLegend'),true);
  lbRound();
}
function lbTotal(c){return Object.values(c).reduce((a,b)=>a+b,0);}
function lbRound(){
  const c=LB.queue[LB.i];Object.assign(LB,{c,counts:{},hints:0,wrong:0,done:false});
  $('lbQ').textContent=LB.i+1;$('lbScore').textContent=LB.score;
  $('lbName').textContent=c.name;$('lbClue').textContent=c.clue;
  $('lbHintBox').hidden=true;$('lbMsg').textContent='';$('lbMsg').className='msg';$('lbNext').hidden=true;
  $('lbCombine').disabled=false;$('lbHint').disabled=false;$('lbClear').disabled=false;
  lbRender();
}
function lbRender(){
  const c=LB.counts;
  $('lbBeaker').replaceChildren(molSVG(c,false));
  $('lbFormula').textContent=fmtFormula(c)||'—';
  $('lbTray').replaceChildren(...Object.keys(c).filter(k=>c[k]>0).map(k=>
    h('div',{class:'atomchip'},`${k} × ${c[k]}`,
      h('button',{'aria-label':'remove one '+k,onclick:()=>lbChange(k,-1)},'−'),
      h('button',{'aria-label':'add one '+k,onclick:()=>lbChange(k,1)},'+'))));
  $('lbWorth').textContent=LB.done?0:Math.max(1,3-LB.hints-LB.wrong);
}
function lbChange(sym,d){
  if(LB.done)return;
  if(d>0&&lbTotal(LB.counts)>=20){$('lbMsg').className='msg bad';$('lbMsg').textContent='That is a lot of atoms! Try fewer.';return;}
  LB.counts[sym]=Math.max(0,(LB.counts[sym]||0)+d);
  if(!LB.counts[sym])delete LB.counts[sym];
  $('lbMsg').textContent='';lbRender();
}
function lbAdd(n){lbChange(EL[n-1].sym,1);}
$('lbClear').onclick=()=>{if(LB.done)return;LB.counts={};$('lbMsg').textContent='';lbRender();};
$('lbHint').onclick=()=>{
  if(LB.done||LB.hints>=2)return;LB.hints++;const f=LB.c.f,box=$('lbHintBox');box.hidden=false;
  box.textContent=LB.hints===1?'You need: '+Object.keys(f).map(s=>BYSYM[s].name).join(', ')+'.':'The formula is '+fmtFormula(f)+'. The small number tells how many atoms of that element!';
  if(LB.hints>=2)$('lbHint').disabled=true;lbRender();
};
$('lbCombine').onclick=()=>{
  if(LB.done)return;const t=LB.c.f,a=LB.counts,msg=$('lbMsg');
  if(!lbTotal(a)){msg.className='msg bad';msg.textContent='Click elements on the table to add atoms first.';return;}
  const tk=Object.keys(t),ak=Object.keys(a);
  const missing=tk.some(k=>!a[k]),extra=ak.some(k=>!t[k]),same=!missing&&!extra&&tk.every(k=>a[k]===t[k]);
  if(LB.test){LB.results.push({c:LB.c,ok:same});LB.done=true;tstSaved();LB.i++;
    setTimeout(()=>{if(!LB||!LB.test)return;if(LB.i>=LB.queue.length)return TST&&TST.finish();lbRound();},300);return;}
  if(same)return lbSuccess();
  LB.wrong++;msg.className='msg bad';fx.pop({icon:'burst',text:'Almost!',kind:'oops'});
  msg.textContent=missing?"Not yet — you're missing a type of element.":extra?"Not yet — one of your elements doesn't belong.":"Right elements! Now check how many atoms of each.";
  if(LB.wrong>=3&&LB.hints<2){LB.hints=2;$('lbHint').disabled=true;const b=$('lbHintBox');b.hidden=false;b.textContent='The formula is '+fmtFormula(t)+'.';msg.textContent+=' (Formula revealed.)';}
  lbRender();
};
function lbSuccess(){
  LB.done=true;const pts=Math.max(1,3-LB.hints-LB.wrong);LB.score+=pts;LB.results.push({c:LB.c,pts});
  $('lbScore').textContent=LB.score;const svg=molSVG(LB.counts,true);svg.classList.add('pop');$('lbBeaker').replaceChildren(svg);
  $('lbFormula').textContent=fmtFormula(LB.c.f);
  const m=$('lbMsg');m.className='msg good';m.textContent=`${LB.c.name} = ${fmtFormula(LB.c.f)}  +${pts} pt${pts===1?'':'s'}!`;
  fx.pop({icon:'flask',text:'Success! +'+pts,kind:'great',size:'big'});fx.confetti(pts===3?80:45);
  $('lbCombine').disabled=true;$('lbHint').disabled=true;$('lbClear').disabled=true;
  $('lbNext').textContent=LB.i+1>=LB.queue.length?'See my results ▶':'Next ▶';$('lbNext').hidden=false;$('lbNext').focus({preventScroll:true});
  $('lbWorth').textContent=0;
}
$('lbNext').onclick=()=>{LB.i++;if(LB.i>=LB.queue.length)return lbEnd();lbRound();};
$('lbQuit').onclick=()=>LB&&LB.test?tstQuit():goMenu();
function lbEnd(){
  const P=prof(),rec=P.lab,prev=rec.best;rec.plays++;const isBest=LB.score>prev;if(isBest)rec.best=LB.score;saveAll();cloudSubmit('lab','',LB.score,{n:LB.queue.length});
  const max=LB.queue.length*3;
  showEnd({emoji:'flask',title:LB.score>=max*.8?'Master Chemist!':LB.score>=max*.5?'Great Lab Work!':'Keep Experimenting!',big:`${LB.score}/${max}`,sub:'Compound Lab score',
    body:[isBest?h('div',{class:'newbest'},I('sparkle'),'NEW HIGH SCORE!'):null,h('p',null,'High score: ',h('b',null,rec.best)),
      h('div',{class:'tchips'},LB.results.map(r=>h('span',{class:'tchip'},`${r.c.name} ${fmtFormula(r.c.f)}`)))],
    again:startLab,party:isBest?'New high score!':(LB.score>=max*.7?'Great lab work!':null)});
}
function molSVG(counts){
  const ns='http://www.w3.org/2000/svg',W=300,H=230,cx=150,cy=115;
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const mk=(t,at)=>{const e=document.createElementNS(ns,t);for(const k in at)e.setAttribute(k,at[k]);return e;};
  const keys=Object.keys(counts).filter(k=>counts[k]>0),atoms=[];
  keys.forEach(k=>{for(let i=0;i<counts[k];i++)atoms.push(k);});
  if(!atoms.length){const t=mk('text',{x:cx,y:cy,'text-anchor':'middle','font-size':16,fill:'#7a8aa6','font-family':'system-ui'});t.textContent='Click elements to add atoms';svg.append(t);return svg;}
  let centre=null;if(atoms.length>2)centre=keys.find(k=>counts[k]===1&&k!=='H')||null;
  const others=atoms.slice();if(centre)others.splice(others.indexOf(centre),1);
  const n=others.length,pts=[];
  const R=centre?(n<=4?58:n<=8?72:84):(n<2?0:n<=2?32:n<=5?54:72);
  for(let i=0;i<n;i++){
    let ang;
    if(centre&&n===2)ang=(centre==='C'?[180,0]:[145,35])[i]*Math.PI/180;
    else if(!centre&&n===2)ang=(i?0:180)*Math.PI/180;
    else ang=(-90+i*360/n)*Math.PI/180;
    pts.push({s:others[i],x:cx+R*Math.cos(ang),y:cy+R*Math.sin(ang)});
  }
  const line=(a,b)=>svg.append(mk('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:'#b7c0d2','stroke-width':6,'stroke-linecap':'round'}));
  if(centre)pts.forEach(p=>line({x:cx,y:cy},p));
  else if(n>=2)for(let i=0;i<n-(n===2?1:0);i++)line(pts[i],pts[(i+1)%n]);
  const atom=(s,x,y)=>{
    const col=ATOMC[s]||['#c9d3e6','#222'],r=s==='H'?15:['C','N','O'].includes(s)?20:23;
    svg.append(mk('circle',{cx:x,cy:y+3,r,fill:'#101536','fill-opacity':.12}));
    svg.append(mk('circle',{cx:x,cy:y,r,fill:col[0],stroke:'rgba(16,21,54,.38)','stroke-width':1.6}));
    svg.append(mk('path',{d:`M${x-r*.62} ${y-r*.2}a${r*.7} ${r*.7} 0 0 1 ${r*.5} ${-r*.5}`,fill:'none',stroke:'#fff','stroke-opacity':.55,'stroke-width':2.6,'stroke-linecap':'round'}));
    const t=mk('text',{x,y:y+5,'text-anchor':'middle','font-size':r>16?20:16,'font-weight':800,fill:col[1],'font-family':'system-ui'});t.setAttribute('y',y+(r>16?7:6));t.textContent=s;svg.append(t);
  };
  if(centre)atom(centre,cx,cy);pts.forEach(p=>atom(p.s,p.x,p.y));
  if(atoms.length<=2)svg.setAttribute('viewBox',`${cx-72} ${cy-56} 144 112`);else if(atoms.length<=3)svg.setAttribute('viewBox',`${cx-100} ${cy-77} 200 154`);else if(atoms.length<=6)svg.setAttribute('viewBox',`${cx-125} ${cy-96} 250 192`);
  return svg;
}

