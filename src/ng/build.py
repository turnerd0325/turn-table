#!/usr/bin/env python3
"""Build the Life / Earth / Physics games (the "NG" block) into index.html.

Edit the files in src/ng/, then run:   python3 src/ng/build.py
It replaces three marked blocks in index.html (CSS, HTML screens, JS).
The first run adds the markers next to fixed anchors in index.html.
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = pathlib.Path(__file__).resolve().parent
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
]


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
    for name, a, b, anchor, src in BLOCKS:
        body = source(name, src)
        if '</script>' in body and name == 'js':
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
    print('built', INDEX, len(html), 'bytes')


if __name__ == '__main__':
    main()
