#!/usr/bin/env python3
"""Build every game source file into index.html. One command for all of it:

    python3 src/ng/build.py

1. src/ng/      the 12 subject games, subject menu and tests (NG blocks: CSS, HTML, JS)
2. src/ng/art.*  the shared art kit (ART blocks: CSS, JS) used by every game upgrade
3. src/games/   the older games, one file each (G: blocks, built in place)
                <key>.js   -> between /*<<G:key*/ and /*G:key>>*/
                <key>.html -> between <!--<<G:key--> and <!--G:key>>-->
                <key>.css  -> between /*<<GC:key*/ and /*GC:key>>*/

Never hand-edit the marked blocks in index.html; the next build overwrites them.
The first run adds NG/ART markers next to fixed anchors in index.html.
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = pathlib.Path(__file__).resolve().parent
GAMES = ROOT / 'src' / 'games'
INDEX = ROOT / 'index.html'

JS_ORDER = ['shell.js', 'cell.js', 'ripple.js', 'pup.js', 'drift.js',
            'moon.js', 'strata.js', 'pangaea.js', 'weather.js',
            'courier.js', 'frozen.js', 'fields.js', 'waves.js',
            'content.js', 'wire.js', 'test.js']

BLOCKS = [
    # name, start marker, end marker, anchor (marker block goes right before it), source
    ('css', '/*<<NGCSS*/', '/*NGCSS>>*/', '</style>\n</head>', 'ng.css'),
    ('html', '<!--<<NGHTML-->', '<!--NGHTML>>-->', '<!-- ===== CLASS GAMES HUB (teacher) ===== -->', 'ng.html'),
    ('js', '/*<<NGJS*/', '/*NGJS>>*/', '/* ---- hydrate static art placeholders ---- */', None),
    # shared art kit: CSS just before the NG CSS, JS at the very top of the app script
    ('artcss', '/*<<ARTCSS*/', '/*ARTCSS>>*/', '/*<<NGCSS*/', 'art.css'),
    ('artjs', '/*<<ARTJS*/', '/*ARTJS>>*/', '/* ================= ART SYSTEM: custom icons, logo and game thumbnails', 'art.js'),
]


def build_games(html):
    """Put each src/games/<key>.(js|html|css) back between its markers in index.html."""
    marks = {'.js': ('/*<<G:{k}*/', '/*G:{k}>>*/'), '.html': ('<!--<<G:{k}-->', '<!--G:{k}>>-->'),
             '.css': ('/*<<GC:{k}*/', '/*GC:{k}>>*/')}
    n = 0
    for f in sorted(GAMES.glob('*.*')):
        if f.suffix not in marks:
            continue
        a, b = (m.format(k=f.stem) for m in marks[f.suffix])
        if html.count(a) != 1 or html.count(b) != 1:
            sys.exit(f'{f.name}: markers {a} ... {b} not found exactly once in index.html')
        body = f.read_text(encoding='utf-8')
        if f.suffix == '.js' and '</script>' in body:
            sys.exit(f'{f.name} must not contain </script>')
        if not body.endswith('\n'):
            body += '\n'
        i, j = html.index(a) + len(a) + 1, html.index(b)
        html = html[:i] + body + html[j:]
        n += 1
    return html, n


def source(name, src):
    if src:
        return (SRC / src).read_text(encoding='utf-8')
    parts = []
    for f in JS_ORDER:
        p = SRC / f
        if p.exists():
            parts.append(f'/* ---- src/ng/{f} ---- */\n' + p.read_text(encoding='utf-8'))
    return '\n'.join(parts)


def main():
    html = INDEX.read_text(encoding='utf-8')
    html, n = build_games(html)
    for name, a, b, anchor, src in BLOCKS:
        body = source(name, src)
        if '</script>' in body and name in ('js', 'artjs'):
            sys.exit('JS source must not contain </script>')
        block = a + '\n' + body.rstrip() + '\n' + b + '\n'
        if a in html:
            i, j = html.index(a), html.index(b) + len(b)
            if html[j:j + 1] == '\n':
                j += 1
            html = html[:i] + block + html[j:]
        else:
            if html.count(anchor) != 1:
                sys.exit(f'anchor for {name} not found exactly once')
            html = html.replace(anchor, block + anchor)
    INDEX.write_text(html, encoding='utf-8')
    print('built', INDEX, len(html), 'bytes;', n, 'files from src/games')


if __name__ == '__main__':
    main()
