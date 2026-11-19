/* ================= LIFE 3: PUP PREDICTOR (MS-LS3-2) =================
   Choose parents, fill in the Punnett square, predict the chance of each trait, THEN breed.
   Real litters vary: the square gives the chance, not a promise. Mistakes are explained. */
const PP_PCT=[[0,'0%'],[25,'25%'],[50,'50%'],[75,'75%'],[100,'100%']];
const ppGeno=(a,b)=>{const s=[a,b].sort((x,y)=>(x===x.toUpperCase()?0:1)-(y===y.toUpperCase()?0:1));return s.join('');};
const ppCells=(g1,g2)=>[[ppGeno(g1[0],g2[0]),ppGeno(g1[0],g2[1])],[ppGeno(g1[1],g2[0]),ppGeno(g1[1],g2[1])]];
const ppPctOf=(g1,g2,test)=>{const c=ppCells(g1,g2).flat();return c.filter(test).length*25;};
/* dogs: name, sex, genotype, known (show genotype) */
const PPD=(n,s,g,k)=>({n,s,g,k:k!==false});
const PPL=(name,story,o)=>Object.assign({name,story,dom:'B',rec:'b',domN:'black',recN:'brown',kind:'dog'},o);
const PP_LEVELS=[
  PPL('Black or Brown?','Ace and Bella are having puppies.',{pair:[PPD('Ace','M','Bb'),PPD('Bella','F','bb')],
    intro:'**B** = black coat (dominant). **b** = brown coat (recessive). A pup is brown only if it gets **b from BOTH** parents (bb).',
    steps:[{t:'square'},{t:'pct',rec:1,q:'What is the chance each pup is brown?',ans:50,why:'2 of the 4 boxes are bb, so the chance is 2 out of 4 = 50%.'},{t:'breed'}],
    fact:'Each parent passes on ONE of its two alleles to each pup, by chance. The Punnett square shows every combination that can happen.',
    clue:'Write Ace’s two alleles along one side and Bella’s along the other. Each box gets one letter from its row and one from its column.'}),
  PPL('Hidden Brown','Two black dogs, Rex and Luna, are having puppies.',{pair:[PPD('Rex','M','Bb'),PPD('Luna','F','Bb')],
    steps:[{t:'square'},{t:'pct',rec:1,q:'What is the chance each pup is brown?',ans:25,why:'Only 1 of the 4 boxes is bb, so the chance is 1 out of 4 = 25%.'},{t:'breed'},
      {t:'mc',q:'Both parents are black. How can a pup be brown?',opts:[['carry','Both parents carry a hidden b allele, and the pup got b from each.'],['mut','The pup changed color because it was born in a dark den.'],['mix','The colors blended together.']],ans:'carry',why:'A black Bb dog carries a hidden brown allele. If a pup gets b from both parents, it is bb and brown.'}],
    fact:'A recessive allele can hide for generations. Two parents who do not show a trait can still pass it to their offspring.',
    clue:'Both parents are Bb. That means each one has a hidden b to pass on.'}),
  PPL('All Black?','Max is BB and Coco is bb.',{pair:[PPD('Max','M','BB'),PPD('Coco','F','bb')],
    steps:[{t:'square'},{t:'pct',q:'What is the chance each pup is black?',ans:100,why:'Every box is Bb. B is dominant, so every pup is black.'},
      {t:'pct',q:'What is the chance a pup carries a hidden brown allele (Bb)?',ans:100,why:'Every box is Bb. Every pup is black but carries a hidden b.'},{t:'breed'}],
    fact:'A dominant allele shows its trait even when only one copy is there. Bb dogs look black but carry brown.',
    clue:'Max can only pass on B. Coco can only pass on b. What does every pup get?'}),
  PPL('Brown Puppy Wanted','The Smith family wants a brown puppy.',{choose:{goal:'Pick a male and a female with the BEST chance of brown pups.',
      dogs:[PPD('Max','M','BB'),PPD('Duke','M','Bb'),PPD('Rusty','M','bb'),PPD('Luna','F','Bb'),PPD('Coco','F','bb')],best:[['Rusty','Coco']],test:g=>g[0]==='b'},
    steps:[{t:'parents'},{t:'square'},{t:'pct',rec:1,q:'What is the chance each pup is brown?',ans:100,why:'Both parents are bb, so every box is bb. Every pup is brown.'},{t:'breed'}],
    fact:'Two parents that show a recessive trait (bb) can only pass on the recessive allele, so all their offspring show it too.',
    clue:'A brown pup needs b from BOTH parents. Which parents can only give b?'}),
  PPL('Show Dogs','A show needs a litter with NO brown pups at all.',{choose:{goal:'Pick a male and a female so NO pup can be brown.',
      dogs:[PPD('Max','M','BB'),PPD('Duke','M','Bb'),PPD('Luna','F','Bb'),PPD('Coco','F','bb')],best:[['Max','Luna'],['Max','Coco']],test:g=>g[0]==='b'},
    steps:[{t:'parents'},{t:'square'},{t:'pct',rec:1,q:'What is the chance each pup is brown?',ans:0,why:'Max always passes on B, so every pup has at least one B and is black.'},{t:'breed'}],
    fact:'If one parent is BB, every offspring gets a dominant B, so none can show the recessive trait.',
    clue:'If one parent can ONLY give B, no pup can be bb.'}),
  PPL('Only One Brown','The kennel has only one brown dog.',{choose:{goal:'Pick a male and a female with the BEST chance of brown pups.',
      dogs:[PPD('Max','M','BB'),PPD('Duke','M','Bb'),PPD('Luna','F','BB'),PPD('Coco','F','bb')],best:[['Duke','Coco']],test:g=>g[0]==='b'},
    steps:[{t:'parents'},{t:'square'},{t:'pct',rec:1,q:'What is the chance each pup is brown?',ans:50,why:'Duke (Bb) × Coco (bb) gives 2 bb boxes out of 4 = 50%.'},{t:'breed'}],
    fact:'A parent that carries a hidden recessive allele (Bb) can pass it on half the time.',
    clue:'Coco is the only brown dog. Which male carries a hidden b?'}),
  PPL('Puppy Detective','Black dogs Ace and Luna had a litter with two brown pups.',{pair:[PPD('Ace','M','Bb',false),PPD('Luna','F','Bb',false)],
    steps:[{t:'genos',q:'Both parents are black, but two pups are brown. What are the parents’ genotypes?',ans:'Bb',why:'A brown pup is bb, so it got b from EACH parent. Black parents with a b must be Bb.'},
      {t:'square'},{t:'pct',q:'If they have another litter, what is the chance each pup is brown?',ans:25,rec:1,why:'Bb × Bb gives 1 bb box out of 4 = 25%.'}],
    fact:'Scientists can figure out hidden genotypes by looking at the offspring. This is how breeders and geneticists work out family patterns.',
    clue:'What genotype does a brown pup have? Where did each of its alleles come from?'}),
  PPL('Test Cross','Max is black. Nobody knows if he is BB or Bb.',{choose:{goal:'To find out Max’s genotype, which female should he be bred with?',
      dogs:[PPD('Max','M','Bb',false),PPD('Coco','F','bb'),PPD('Luna','F','BB'),PPD('Daisy','F','Bb')],fixed:'Max',best:[['Max','Coco']],
      why:'Breed him with a bb dog. If Max is Bb, some pups will be brown. If he is BB, none will be. A BB or Bb female would hide the answer.'},
    litter:['Bb','bb','Bb','Bb','bb','Bb','Bb','bb'],
    steps:[{t:'parents'},{t:'breed'},{t:'genos',who:'Max',q:'Some pups came out brown. What is Max’s genotype?',ans:'Bb',why:'Each brown pup is bb, so it got a b from Max. Max must be Bb.'}],
    fact:'Breeding an unknown with a recessive (bb) partner is called a test cross. The offspring reveal the hidden allele.',
    clue:'Which female would let a hidden b from Max SHOW in the pups?'}),
  PPL('Clones or Seeds?','A red-flowered strawberry plant (Rr) can reproduce two ways.',{dom:'R',rec:'r',domN:'red',recN:'white',kind:'plant',pair:[PPD('Plant A','',''+'Rr'),PPD('Plant B','','Rr')],
    intro:'**Runners** are stems that grow new plants with no partner (asexual). **Seeds** come from two parents (sexual). R = red flowers (dominant), r = white.',
    steps:[{t:'mc',q:'A runner grows a new plant from Plant A alone. What is the chance it is Rr, exactly like Plant A?',opts:[['100','100%: it is a copy of the one parent'],['50','50%: like a Punnett square'],['25','25%']],ans:'100',why:'Asexual reproduction makes offspring with the SAME genetic information as the one parent.'},
      {t:'square'},{t:'pct',q:'Seeds come from Plant A × Plant B (Rr × Rr). What is the chance a seedling is Rr like its parents?',ans:50,why:'2 of the 4 boxes are Rr, so 50%. The others are RR or rr: different from the parents.'},
      {t:'mc',q:'Which way of reproducing makes more VARIETY in the offspring?',opts:[['sex','Seeds (sexual): genes from two parents mix'],['asex','Runners (asexual): copies of one parent'],['same','Both make the same amount of variety']],ans:'sex',why:'Sexual reproduction mixes alleles from two parents, so the offspring vary. Asexual offspring are identical copies.'}],
    fact:'Asexual reproduction makes identical offspring. Sexual reproduction mixes genes from two parents and makes variation.',
    clue:'A runner has only ONE parent. Seeds have TWO.'})
];
const PP_PACKS={0:'Pack 1: The Punnett square',3:'Pack 2: Choose the parents',6:'Pack 3: Detective work'};
function ppDog(geno,L,o){
  o=o||{};const dom=geno&&geno.indexOf(L.dom)>=0,col=geno?(dom?(L.kind==='plant'?'#e2483f':'#2b2b2b'):(L.kind==='plant'?'#f6f2ea':'#9a5b2a')):'#c3cadb',s=o.s||64;
  if(L.kind==='plant')return svgEl(`<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true"><path d="M32 60V36" stroke="#3f8a3a" stroke-width="4"/><path d="M32 46q-14-2-16-12 12 0 16 12zM32 50q14-2 16-12-12 0-16 12z" fill="#57b04f"/>${[0,72,144,216,288].map(a=>`<ellipse cx="${32+Math.cos(a*Math.PI/180)*10}" cy="${22+Math.sin(a*Math.PI/180)*10}" rx="8" ry="8" fill="${col}" stroke="#c8b9a0" stroke-width="1.5"/>`).join('')}<circle cx="32" cy="22" r="5" fill="#f4b13a"/></svg>`);
  const ear=dom?'#1a1a1a':'#7a451c';
  return svgEl(`<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true"><ellipse cx="14" cy="28" rx="9" ry="16" fill="${geno?ear:'#aab3c5'}" transform="rotate(18 14 28)"/><ellipse cx="50" cy="28" rx="9" ry="16" fill="${geno?ear:'#aab3c5'}" transform="rotate(-18 50 28)"/><circle cx="32" cy="32" r="22" fill="${col}"/><ellipse cx="32" cy="42" rx="12" ry="9" fill="${geno?(dom?'#444':'#c08552'):'#d9dee8'}"/><circle cx="24" cy="28" r="3.6" fill="#fff"/><circle cx="40" cy="28" r="3.6" fill="#fff"/><circle cx="24" cy="28" r="1.8" fill="#111"/><circle cx="40" cy="28" r="1.8" fill="#111"/><ellipse cx="32" cy="38" rx="4.5" ry="3" fill="#111"/>${geno?'':'<text x="32" y="38" text-anchor="middle" font-size="18" font-weight="900" fill="#5b6b86">?</text>'}</svg>`);
}
const ppPheno=(g,L)=>g.indexOf(L.dom)>=0?L.domN:L.recN;
function ppParents(G){const L=G.L,S=G.st;if(L.pair)return L.pair;if(!S.pick)return null;return [L.choose.dogs.find(d=>d.n===S.pick.M),L.choose.dogs.find(d=>d.n===S.pick.F)];}
function ppCard(d,L,known,extra){return h('div',{class:'ppdog'+(extra&&extra.cls?' '+extra.cls:'')},ppDog(d.g,L,{s:58}),h('b',null,d.n),h('small',null,(d.s==='M'?'♂ ':d.s==='F'?'♀ ':'')+ppPheno(d.g,L)),h('span',{class:'ppg'},known?d.g:'?'));}
ngDef({key:'pup',name:'Pup Predictor',ic:'paw',std:'MS-LS3-2',subj:'life',
  short:'Use Punnett squares to predict traits, then breed.',menuDesc:'Pick the parents, fill in the Punnett square and predict the chances before the puppies arrive.',
  intro:'Traits pass from parents to offspring through genes. Use Punnett squares to predict the chance of each trait, choose the best parents, and solve family mysteries. Every litter is real chance, so predict the odds, not the exact pups. No mistakes earns 3 stars.',
  how:['**Read the goal** and choose parents when asked.','**Fill in the Punnett square.** Tap a box to change it.','**Predict the chance**, then breed and compare the litter with your prediction.'],
  levels:PP_LEVELS,packs:PP_PACKS,cap3:true,
  mini:L=>{const w=h('span',{class:'ppmini'});w.append(ppDog(L.kind==='plant'?'Rr':'Bb',L,{s:30}),ppDog(L.kind==='plant'?'rr':'bb',L,{s:30}));return w;},
  start(G){G.st={step:0,pick:L0(G.L),sq:[['',''],['','']],sqBad:null,pct:null,mc:null,geno:null,litter:null,msg:null,stepOK:false};},
  hud(G){return {label:'Mistakes',val:G.miss,target:'3 ★ = no mistakes'};},
  render(G,main,side){
    const L=G.L,S=G.st,P=ppParents(G),step=L.steps[S.step],kn=d=>d.k||S.revealed;
    const kids=[];
    if(L.choose&&!S.pick.M||L.choose&&step&&step.t==='parents'){
      kids.push(h('div',{class:'osl'},'Kennel: tap one ♂ and one ♀'),h('div',{class:'ppkennel'},...L.choose.dogs.map(d=>{const on=S.pick[d.s]===d.n,fixed=L.choose.fixed===d.n;
        const c=ppCard(d,L,kn(d),{cls:on?'on':''});return h('button',{type:'button',class:'ppkbtn'+(on?' on':''),disabled:G.done||(fixed&&on)||step.t!=='parents','aria-pressed':on?'true':'false',onclick:()=>{S.pick[d.s]=on&&!fixed?null:d.n;S.msg=null;ngRender();}},c);})));
    }
    if(P&&P[0]&&P[1]){
      kids.push(h('div',{class:'pppair'},ppCard(P[0],L,kn(P[0])),h('span',{class:'ppx'},'×'),ppCard(P[1],L,kn(P[1]))));
      const showSq=L.steps.some(s=>s.t==='square')&&L.steps.findIndex(s=>s.t==='square')<=S.step;
      if(showSq){const g1=P[0].g,g2=P[1].g,sqStep=step&&step.t==='square',corr=ppCells(g1,g2);
        const cell=(r,c)=>{const v=S.sq[r][c],bad=S.sqBad&&S.sqBad[r][c];
          return h('button',{type:'button',class:'ppcell'+(v?' set':'')+(bad?' bad':'')+(!sqStep&&v?' done':''),disabled:!sqStep||G.done,'aria-label':`Box row ${r+1} column ${c+1}: ${v||'empty'}`,
            onclick:()=>{const cyc=['',L.dom+L.dom,L.dom+L.rec,L.rec+L.rec];S.sq[r][c]=cyc[(cyc.indexOf(v)+1)%4]||cyc[1];S.sqBad=null;S.msg=null;ngRender();}},v||'?');};
        const alle=(a)=>h('div',{class:'ppal'},a);
        kids.push(h('div',{class:'ppsq'},h('div',{class:'ppcorner'},P[0].n+' ↓ / '+P[1].n+' →'),alle(kn(P[1])?g2[0]:'?'),alle(kn(P[1])?g2[1]:'?'),
          alle(kn(P[0])?g1[0]:'?'),cell(0,0),cell(0,1),alle(kn(P[0])?g1[1]:'?'),cell(1,0),cell(1,1)));
        }
    }
    if(S.litter){const n=S.litter.length,rec=S.litter.filter(g=>g.indexOf(L.dom)<0).length;
      kids.push(h('div',{class:'osl'},'The litter'),h('div',{class:'pplitter'},...S.litter.map(g=>h('div',{class:'pppup'},ppDog(g,L,{s:44}),h('small',null,g)))),
        h('div',{class:'ppsum'},`${rec} of ${n} are ${L.recN} (${Math.round(rec/n*100)}%). ${S.chance!=null?`The square predicted ${S.chance}%. `:''}Real litters vary: every ${L.kind==='plant'?'seed':'pup'} is a new chance, like a coin flip.`));}
    ngRC(main,...kids);
    /* side: the current step */
    const prog=h('div',{class:'ppsteps'},...L.steps.map((s,k)=>h('span',{class:'ppst'+(k<S.step?' ok':k===S.step?' on':'')},({parents:'Parents',square:'Square',pct:'Predict',breed:'Breed',genos:'Genotype',mc:'Explain'})[s.t])));
    const box=[];
    if(!step){box.push(h('div',{class:'ppdone'},'✓ All steps done!'));}
    else if(step.t==='parents'){box.push(h('p',{class:'ppq'},L.choose.goal),ngBtn('These two!',ppCheckParents,'good',{disabled:!S.pick.M||!S.pick.F||G.done,style:'width:100%'}));}
    else if(step.t==='square'){box.push(h('p',{class:'ppq'},'Fill in all 4 boxes. Each box gets one allele from its row parent and one from its column parent. Tap a box to change it.'),ngBtn('Check my square',ppCheckSquare,'good',{disabled:S.sq.flat().some(v=>!v)||G.done,style:'width:100%'}));}
    else if(step.t==='pct'){box.push(h('p',{class:'ppq'},step.q),ngChoices(PP_PCT,S.pct,v=>{S.pct=v;S.msg=null;ngRender();},{label:step.q,locked:G.done}),ngBtn('Lock in my prediction',ppCheckPct,'good',{disabled:S.pct==null||G.done,style:'width:100%;margin-top:6px'}));}
    else if(step.t==='genos'){box.push(h('p',{class:'ppq'},step.q),ngChoices([[L.dom+L.dom,L.dom+L.dom],[L.dom+L.rec,L.dom+L.rec],[L.rec+L.rec,L.rec+L.rec]],S.geno,v=>{S.geno=v;S.msg=null;ngRender();},{locked:G.done}),ngBtn('Check',ppCheckGeno,'good',{disabled:!S.geno||G.done,style:'width:100%;margin-top:6px'}));}
    else if(step.t==='mc'){box.push(h('p',{class:'ppq'},step.q),h('div',{class:'ppmc'},...step.opts.map(([v,t])=>h('button',{type:'button',class:'ngc wide'+(S.mc===v?' on':''),disabled:G.done,onclick:()=>{S.mc=v;S.msg=null;ngRender();}},t))),ngBtn('Check',ppCheckMc,'good',{disabled:!S.mc||G.done,style:'width:100%;margin-top:6px'}));}
    else if(step.t==='breed'){box.push(h('p',{class:'ppq'},`Your prediction is locked in. Time to see the ${L.kind==='plant'?'seedlings':'puppies'}!`),ngBtn([I('paw'),L.kind==='plant'?' Plant the seeds':' Breed!'],ppBreed,'good',{style:'width:100%;font-size:18px',disabled:G.done}));}
    ngRC(side,prog,...box,S.msg?h('div',{class:'ppmsg '+S.msg[0]},S.msg[1]):null);
    if(step&&!S.msg)ngSay(({parents:'Choose the parents. Think about which alleles each one can pass on.',square:'Fill in the Punnett square: one letter from each parent in every box.',pct:'Count the boxes to find the chance.',breed:'Now see what really happens.',genos:'Use the offspring as evidence.',mc:'Explain what you saw.'})[step.t]);
  },
  hints(G){const L=G.L,P=ppParents(G);
    return [L.clue,'Capital letter = dominant allele: it shows if there is at least one. Lowercase = recessive: it only shows with two (bb). Each box in the square is 1 chance out of 4 = 25%.',
      P&&P[0]&&P[1]?`${P[0].n} is ${P[0].g} and ${P[1].n} is ${P[1].g}. The square is: ${ppCells(P[0].g,P[1].g).flat().join(', ')}.`+(L.choose?` Best parents: ${L.choose.best.map(b=>b.join(' + ')).join(' or ')}.`:''):L.choose?`Best parents: ${L.choose.best.map(b=>b.join(' + ')).join(' or ')}.`:''];},
  onHint(G){if(G.hint===3&&G.L.choose&&G.L.choose.fixed){}}
});
function L0(L){return L.choose?{M:L.choose.fixed||null,F:null}:{};}
function ppNext(msgOK){const S=G.st;S.msg=msgOK?['ok',msgOK]:null;S.step++;S.pct=null;S.mc=null;S.geno=null;S.sqBad=null;
  if(S.step>=G.L.steps.length){ngRender();const m=G.miss;G.detail={mistakes:m};ngSay(m?'Done! Check the steps where you slipped.':'Perfect genetics!','go');
    ngWin(ngStars(m,0,2),['You finished with ',h('b',null,m),` mistake${m===1?'':'s'}.`]);return;}
  ngRender();}
function ppMiss(t){G.miss++;G.tries++;G.st.msg=['no',t];fx.pop({icon:'paw',text:'Not quite',kind:'oops'});ngRender();ngSay(t,'alert');}
function ppCheckParents(){
  const L=G.L,S=G.st,C=L.choose,ok=C.best.some(([m,f])=>S.pick.M===m&&S.pick.F===f);
  if(ok){ppNext(C.why||'Great choice! Those parents give the best chance.');return;}
  const M=C.dogs.find(d=>d.n===S.pick.M),F=C.dogs.find(d=>d.n===S.pick.F);
  const p=ppPctOf(M.g,F.g,C.test);
  ppMiss(C.why?C.why:`${M.n} (${M.g}) × ${F.n} (${F.g}) gives a ${p}% chance. Another pair does better. Think about which alleles each parent can pass on.`);
}
function ppCheckSquare(){
  const S=G.st,P=ppParents(G),c=ppCells(P[0].g,P[1].g);
  const bad=S.sq.map((r,i)=>r.map((v,j)=>ppGeno(v[0],v[1])!==c[i][j]));
  if(bad.flat().some(Boolean)){S.sqBad=bad;ppMiss('Some boxes are wrong (red). Each box = the row parent’s allele + the column parent’s allele.');return;}
  S.sqDone=1;ppNext('Square checked! Now count the boxes.');
}
function ppCheckPct(){const S=G.st,st=G.L.steps[S.step];if(S.pct===st.ans){if(st.rec)S.chance=st.ans;ppNext('Right! '+st.why);}else ppMiss('Not quite. Count how many of the 4 boxes give that trait. Each box is a 25% chance.');}
function ppCheckMc(){const S=G.st,st=G.L.steps[S.step];if(S.mc===st.ans)ppNext('Right! '+st.why);else ppMiss('Not quite. '+st.why);}
function ppCheckGeno(){const S=G.st,st=G.L.steps[S.step];if(S.geno===st.ans){S.revealed=true;ppNext('Right! '+st.why);}else ppMiss('Not quite. '+st.why);}
function ppBreed(){
  const L=G.L,S=G.st,P=ppParents(G);
  if(L.litter)S.litter=L.litter.slice();
  else{const opts=ppCells(P[0].g,P[1].g).flat();S.litter=Array.from({length:8},()=>opts[Math.floor(Math.random()*4)]);}
  fx.pop({icon:'paw',text:L.kind==='plant'?'Seedlings!':'Puppies!',kind:'great'});ppNext(null);
}
NGTHUMB.pup=()=>{
  let t=`<rect x="186" y="34" width="112" height="112" rx="10" fill="#f6efe0"/><path d="M242 34v112M186 90h112" stroke="#101536" stroke-width="3" opacity=".5"/>`;
  [['BB',214,68],['Bb',270,68],['Bb',214,124],['bb',270,124]].forEach(([g,x,y])=>{t+=`<text x="${x}" y="${y}" text-anchor="middle" font-family="system-ui,Arial" font-weight="900" font-size="22" fill="${g==='bb'?'#9a5b2a':'#101536'}">${g}</text>`;});
  const dog=(x,y,c,e,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-18" cy="-4" rx="9" ry="16" fill="${e}" transform="rotate(18 -18 -4)"/><ellipse cx="18" cy="-4" rx="9" ry="16" fill="${e}" transform="rotate(-18 18 -4)"/><circle r="22" fill="${c}"/><circle cx="-8" cy="-4" r="3.6" fill="#fff"/><circle cx="8" cy="-4" r="3.6" fill="#fff"/><ellipse cy="8" rx="5" ry="3.4" fill="#111"/></g>`;
  t+=dog(70,62,'#2b2b2b','#111',1.15)+dog(118,128,'#9a5b2a','#6a3a12',1.15)+dog(60,140,'#9a5b2a','#6a3a12',.7)+ngStar(300,22,8)+ngStar(150,30,6,'#f6efe0',.7);
  return ngWrap('pup','#8a4a1c',t);
};
