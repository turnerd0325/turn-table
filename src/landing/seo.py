"""Search and AI-crawler extras for the landing page. Called from build.py."""
import json,re,html
SITE='https://turntable.thesciencehooklab.com'
SUBJ={'life':'Life science','phys':'Physics','chem':'Chemistry','earth':'Earth and space science'}
def games_list(g):
    li=''.join(f'<li><b>{html.escape(x["name"])}</b> ({SUBJ[x["subj"]]}, {html.escape(x["std"])}): {html.escape(x["desc"])}</li>' for x in g)
    return f'<ul class="seo-games">{li}</ul>'
def ld_json(t,g):
    faq=[]
    for q,a in re.findall(r'<details><summary>(.*?)</summary><p>(.*?)</p></details>',t,re.S):
        a=html.unescape(re.sub(r'<[^>]+>','',a));faq.append({"@type":"Question","name":html.unescape(q),"acceptedAnswer":{"@type":"Answer","text":a}})
    stds=sorted({s.strip() if s.strip().startswith(('MS-','HS-')) else 'MS-'+s.strip() for x in g for s in x['std'].split('·')})
    pub={"@type":"Organization","@id":"https://thesciencehooklab.com/#org","name":"The Science Hook Lab","url":"https://thesciencehooklab.com"}
    app={"@type":"WebApplication","@id":SITE+"/#app","name":"Turn-Table","url":SITE+"/",
      "applicationCategory":"EducationalApplication","operatingSystem":"Web browser, ChromeOS",
      "description":"Standards-aligned science games for middle school (grades 6 to 8). The science is the game: students find elements, build atoms, run separation machines, build cells, drive the Moon through its phases and more. Teachers get class codes, per-class game switches, Pre-Test and Post-Test growth reports, a live 4-choice quiz and a game-show quiz board builder.",
      "audience":{"@type":"EducationalAudience","educationalRole":"teacher"},"educationalLevel":"Grades 6-8 (middle school)",
      "teaches":stds,"featureList":[x["name"]+": "+x["desc"] for x in g]+["Live Quiz: 4-choice trivia students answer on their Chromebooks","Quiz Board Maker: game-show review board built from NY science standards"],
      "author":{"@type":"Person","name":"Dennis Turner","jobTitle":"Middle school science teacher"},"publisher":{"@id":pub["@id"]},
      "image":SITE+"/welcome/img/og.jpg","inLanguage":"en-US"}
    graph=[pub,app]+([{"@type":"FAQPage","mainEntity":faq}] if faq else [])
    return '<script type="application/ld+json">'+json.dumps({"@context":"https://schema.org","@graph":graph},ensure_ascii=False).replace('</','<\\/')+'</script>'
def apply(t,g):
    return t.replace('{{SEO_GAMES}}',games_list(g)).replace('{{LD_JSON}}',ld_json(t,g))
