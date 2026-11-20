import json,pathlib
here=pathlib.Path(__file__).parent
t=(here/'template.html').read_text()
g=json.loads((here/'games.json').read_text())
order={'life':0,'phys':1,'chem':2,'earth':3}

g.sort(key=lambda x:order[x['subj']])
t=t.replace('{{GAMES}}',json.dumps([{k:x[k] for k in ('subj','name','std','desc','svg')} for x in g]))
t=t.replace('{{STUDENTS}}','116').replace('{{PLAYS}}','632').replace('{{SINCE}}','Nov 7')
out=here.parent.parent/'welcome'/'index.html';out.parent.mkdir(exist_ok=True);out.write_text(t)
print('games',len(g),'bytes',len(t))
