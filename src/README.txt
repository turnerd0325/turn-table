sep3d.js is built from sep3d.src.js (three.js). Rebuild:
  cd /home/claude/work/b3d && npx esbuild /home/claude/turn-table/src/sep3d.src.js --bundle --minify --format=esm --outfile=/home/claude/turn-table/sep3d.js

SUBJECT GAMES (Life Science, Earth & Space, Physics) - src/ng/
The 12 subject games, the subject menu and their wiring live in src/ng/.
index.html holds a built copy between the NGCSS / NGHTML / NGJS markers.
Edit the files in src/ng/, then run:   python3 src/ng/build.py
Do not edit the marked blocks in index.html by hand; the build overwrites them.
