#!/usr/bin/env python3
"""Open a Turn-Table game at a level and screenshot it.

    python3 tools/play.py <game> <level> [--test] [--out DIR] [--eval JS] [--wait MS] [--seed N]

Examples
    python3 tools/play.py laser 1               # Laser Maze, level 1
    python3 tools/play.py drift 5 --out shots   # Island Drift, level 5
    python3 tools/play.py atom 1 --test         # Atom Builder Pre-Test
    python3 tools/play.py menu 0                # the subject menu

Saves <out>/<game>-L<level>[-test]-1366.png and -390.png, and prints any page errors.
Exit code is 1 if the page threw an error.

How it works
  * Serves the repo from an in-process HTTP server (background http.server processes
    get killed in the build environment, so the server lives inside this script).
  * Logs in a fake local student ("Student 1") with every game switched on, by writing
    the profile to localStorage before the page loads. No real account is touched.
  * Blocks every call to the Supabase backend, so nothing is saved to the cloud.
    The app treats this like a dropped Wi-Fi connection.
  * Replaces Math.random with a seeded generator, so the same command gives the
    same questions and the same picture every time (--seed changes it).
  * Opens the page with ?ngtest, which exposes window.__ng(code): it runs code inside
    the app's own scope. Use --eval to click, place pieces or check answers before
    the screenshot, e.g.  --eval "lzPlace('4,2','M','/')".

Use it from Python for longer scripted runs:
    from play import Harness
    with Harness() as hx:
        page = hx.open('laser', 1)          # 1366x768 by default
        page.evaluate("__ng(\"lzPlace('4,2','M','/')\")")
        hx.shot(page, 'after-place.png')
        print(hx.errors)
"""
import argparse, functools, http.server, json, pathlib, sys, threading

ROOT = pathlib.Path(__file__).resolve().parents[1]

NG_KEYS = ['cell', 'ripple', 'pup', 'drift', 'moon', 'strata', 'pangaea', 'weather',
           'courier', 'frozen', 'fields', 'waves']

# game key -> JS that opens it at level n (n is 1-based, as students see it)
START = {
    'menu': lambda n: 'goMenu()',
    'speed': lambda n: f"startSpeed({n or 1},'')",
    'trivia': lambda n: 'startTrivia()',
    'explore': lambda n: 'startExplore()',
    'lab': lambda n: 'startLab()',
    'atom': lambda n: f"startAtom('{n or 1}')",
    'balance': lambda n: 'startBalance()',
    'diner': lambda n: f'startDiner({n or 1})',
    'sep': lambda n: f'startSep({max(0, n - 1)})',
    'laser': lambda n: f'lzStart({max(0, n - 1)})',
    'blackout': lambda n: f'boStart({max(0, n - 1)})',
    'evidence': lambda n: f'evStart({max(0, n - 1)})',
    'coaster': lambda n: f'caStart({max(0, n - 1)})',
}
for _k in NG_KEYS:
    START[_k] = (lambda k: lambda n: f"ngStart('{k}',{max(0, n - 1)})")(_k)

# level-picker screens (level 0)
SETUP = {
    'speed': "show('s-speed-setup')", 'atom': "renderAtomSetup();show('s-atom-setup')",
    'diner': "renderDinerSetup();show('s-diner-setup')", 'sep': "renderSepSetup();show('s-sep-setup')",
    'laser': "renderLaserSetup();show('s-laser-setup')", 'blackout': "renderBlackoutSetup();show('s-blackout-setup')",
    'evidence': "renderEvidenceSetup();show('s-evidence-setup')", 'coaster': "renderCoasterSetup();show('s-coaster-setup')",
}
for _k in NG_KEYS:
    SETUP[_k] = f"ngSetup('{_k}')"

TESTABLE = {'speed', 'trivia', 'lab', 'atom', 'balance', 'blackout', 'laser', 'coaster', 'evidence', 'sep', 'diner', *NG_KEYS}

VIEWPORTS = {'1366': (1366, 768), '390': (390, 844)}

FAKE_ID = 'student1'


def init_script(seed, reduced):
    """Runs before any page script: fake student, seeded random."""
    prof = {
        'name': 'Student 1', 'cls': 'TEST01', 'pin': None, 'created': 0,
        'speed': {}, 'trivia': {'best': 0, 'plays': 0}, 'lab': {'best': 0, 'plays': 0},
        'atom': {}, 'balance': {'best': 0, 'plays': 0}, 'diner': {}, 'sep': {}, 'laser': {},
        'blackout': {}, 'evidence': {}, 'coaster': {}, 'missed': {}, 'cloud': None,
        'cinfo': {'games_off': [], 'name': 'Test class', 'teacher': 'Test teacher'},
    }
    return f"""
(()=>{{
  try{{
    localStorage.setItem('pte_profiles_v1', JSON.stringify({{{json.dumps(FAKE_ID)}: {json.dumps(prof)}}}));
    sessionStorage.setItem('pte_me', {json.dumps(FAKE_ID)});
  }}catch(e){{}}
  let s = {int(seed)} >>> 0 || 1;
  Math.random = function(){{ s = (s + 0x6D2B79F5) >>> 0; let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }};
  window.__TT_HARNESS = true;
  {'window.__TT_REDUCED = true;' if reduced else ''}
}})();
"""


class _Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


class Harness:
    """In-process server + Chromium with the fake student. Use as a context manager."""

    def __init__(self, seed=1, reduced=False, headless=True):
        self.seed, self.reduced, self.headless = seed, reduced, headless
        self.errors = []

    def __enter__(self):
        from playwright.sync_api import sync_playwright
        handler = functools.partial(_Quiet, directory=str(ROOT))
        self.httpd = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
        threading.Thread(target=self.httpd.serve_forever, daemon=True).start()
        self.base = f'http://127.0.0.1:{self.httpd.server_address[1]}/play/'
        self.pw = sync_playwright().start()
        self.browser = self.pw.chromium.launch(headless=self.headless, args=['--disable-gpu-sandbox'])
        return self

    def __exit__(self, *a):
        try:
            self.browser.close()
            self.pw.stop()
        finally:
            self.httpd.shutdown()

    def page(self, viewport='1366', path='?ngtest'):
        w, h = VIEWPORTS.get(str(viewport), viewport if isinstance(viewport, tuple) else (1366, 768))
        ctx = self.browser.new_context(viewport={'width': w, 'height': h},
                                       reduced_motion='reduce' if self.reduced else 'no-preference')
        ctx.add_init_script(init_script(self.seed, self.reduced))
        # no cloud: every backend call fails like a dropped connection
        ctx.route('**/*supabase.co/**', lambda r: r.abort())
        pg = ctx.new_page()
        pg.on('pageerror', lambda e: self.errors.append(f'pageerror: {e}'))
        pg.on('console', lambda m: m.type == 'error' and 'Failed to load resource' not in m.text
              and 'ERR_FAILED' not in m.text and self.errors.append(f'console: {m.text}'))
        pg.goto(self.base + path)
        pg.wait_for_function('typeof window.__ng==="function"', timeout=15000)
        pg.wait_for_timeout(400)
        return pg

    def run(self, pg, js):
        """Run JS inside the app's scope (awaits promises)."""
        return pg.evaluate('async c=>{const r=window.__ng(c);return await r;}', js)

    def open(self, game, level=1, test=False, viewport='1366', wait=1200):
        if game not in START:
            raise SystemExit(f'unknown game "{game}". Known: {", ".join(sorted(START))}')
        pg = self.page(viewport)
        if test:
            if game not in TESTABLE:
                raise SystemExit(f'"{game}" has no Pre-Test mode. Testable: {", ".join(sorted(TESTABLE))}')
            self.run(pg, f"tstStart('{game}','pre',goMenu)")
        elif level == 0 and game in SETUP:
            self.run(pg, SETUP[game])
        else:
            self.run(pg, START[game](level))
        pg.wait_for_timeout(wait)
        return pg

    def shot(self, pg, path, full_page=False):
        path = pathlib.Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        pg.screenshot(path=str(path), full_page=full_page)
        return path

    @staticmethod
    def overflow(pg):
        """(page scrolls vertically, page scrolls sideways)"""
        return pg.evaluate('[document.documentElement.scrollHeight>innerHeight+2,'
                           'document.documentElement.scrollWidth>innerWidth+1]')


def main():
    ap = argparse.ArgumentParser(description='Open a Turn-Table game at a level and screenshot it.')
    ap.add_argument('game', help='game key: ' + ', '.join(sorted(START)))
    ap.add_argument('level', type=int, nargs='?', default=1, help='level as students see it (1 = first). 0 = level picker')
    ap.add_argument('--test', action='store_true', help='open the Pre-Test instead of Review')
    ap.add_argument('--out', default='shots', help='folder for screenshots (default: shots/)')
    ap.add_argument('--eval', action='append', default=[], help='JS to run in the app scope before the screenshot (repeatable)')
    ap.add_argument('--wait', type=int, default=1200, help='ms to wait after opening (default 1200)')
    ap.add_argument('--seed', type=int, default=1, help='random seed (default 1)')
    ap.add_argument('--reduced', action='store_true', help='turn on reduced motion')
    ap.add_argument('--only', choices=list(VIEWPORTS), help='only one screen size')
    ap.add_argument('--name', help='file name prefix (default <game>-L<level>[-test])')
    a = ap.parse_args()

    name = a.name or f"{a.game}-L{a.level}{'-test' if a.test else ''}"
    out = pathlib.Path(a.out)
    with Harness(seed=a.seed, reduced=a.reduced) as hx:
        for vp in ([a.only] if a.only else list(VIEWPORTS)):
            pg = hx.open(a.game, a.level, a.test, vp, a.wait)
            for js in a.eval:
                r = hx.run(pg, js)
                if r is not None:
                    print('eval ->', json.dumps(r)[:400])
                pg.wait_for_timeout(500)
            scroll_y, scroll_x = hx.overflow(pg)
            p = hx.shot(pg, out / f'{name}-{vp}.png')
            note = []
            if scroll_y:
                note.append('page scrolls vertically')
            if scroll_x:
                note.append('page scrolls sideways')
            print(p, ('(' + ', '.join(note) + ')') if note else '')
            pg.context.close()
        for e in dict.fromkeys(hx.errors):
            print('ERROR', e)
        sys.exit(1 if any(e.startswith('pageerror') for e in hx.errors) else 0)


if __name__ == '__main__':
    main()
