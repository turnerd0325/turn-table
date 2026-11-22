import json,pathlib
here=pathlib.Path(__file__).parent
t=(here/'template.html').read_text()
g=json.loads((here/'games.json').read_text())
order={'life':0,'phys':1,'chem':2,'earth':3}

g.sort(key=lambda x:order[x['subj']])
t=t.replace('{{GAMES}}',json.dumps([{k:x[k] for k in ('subj','name','std','desc','svg')} for x in g]))
import sys;sys.path.insert(0,str(here));import seo;t=seo.apply(t,g)
t=t.replace('{{BASE}}','welcome/')
t=t.replace('{{STUDENTS}}','116').replace('{{PLAYS}}','632').replace('{{SINCE}}','Nov 7')
out=here.parent.parent/'index.html';out.write_text(t)
stub=here.parent.parent/'welcome'/'index.html'
stub.write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Turn-Table</title><meta name="robots" content="noindex"><link rel="canonical" href="https://turntable.thesciencehooklab.com/"><meta http-equiv="refresh" content="0;url=/"><script>location.replace("/"+location.search+location.hash)</script></head><body><a href="/">Turn-Table</a></body></html>\n')
print('games',len(g),'bytes',len(t))
