HOW index.html IS BUILT
One command rebuilds every game into index.html:   python3 src/ng/build.py
Never hand-edit a marked block in index.html; the next build overwrites it.

SUBJECT GAMES (Life Science, Earth & Space, Physics) - src/ng/
The 12 subject games, the subject menu, Pre/Post tests and their wiring.
index.html holds a built copy between the NGCSS / NGHTML / NGJS markers.

OLDER GAMES - src/games/ (one set of files per game, built in place)
  trivia  Element Trivia        lab       Compound Lab       atom      Atom Builder
  balance Balance It            diner     Atom Diner         laser     Laser Maze
  blackout Blackout!            evidence  Evidence Lab       coaster   Coaster Architect
  common.js = shared helpers for the star games (drag, recordStars, level picker, win panel)
  <key>.js   -> between /*<<G:key*/ and /*G:key>>*/      in the app script
  <key>.html -> between <!--<<G:key--> and <!--G:key>>-->  (the game's screens)
  <key>.css  -> between /*<<GC:key*/ and /*GC:key>>*/    (only diner.css so far)
  Each block sits exactly where the code always was, so load order never changes.
  Other games' CSS still lives in index.html's main <style>; move it into <key>.css
  (add the GC markers around it) when a session upgrades that game.
  Speed Find, Separation Station and Explore are still inline in index.html.

SHARED ART KIT - src/ng/art.js + src/ng/art.css (built into the ARTJS / ARTCSS blocks)
  Particles, glow/pulse, counters, drag-and-drop (mouse, touch, keyboard), tweens,
  scene backdrops, shadows and an SVG sprite library. The full list is at the top of art.js.
  Live demo: tools/art-demo.html (open it from the site or the local test server).

TEST HARNESS - tools/play.py
  python3 tools/play.py <game> <level> [--test]   -> shots/<game>-L<level>-1366.png and -390.png
  Fake local student, Supabase blocked, seeded random. See the top of the file for options
  and for using it from Python (Harness class) to script whole levels.

3D BELT RUN
sep3d.js is built from sep3d.src.js (three.js). Rebuild:
  cd /home/claude/work/b3d && npx esbuild /home/claude/turn-table/src/sep3d.src.js --bundle --minify --format=esm --outfile=/home/claude/turn-table/sep3d.js
