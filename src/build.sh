#!/bin/sh
# Rebuild sep3d.js (needs: cd /home/claude/work/b3d && npm i three esbuild)
NODE_PATH=/home/claude/work/b3d/node_modules /home/claude/work/b3d/node_modules/.bin/esbuild "$(dirname "$0")/sep3d.src.js" --bundle --minify --format=esm --outfile="$(dirname "$0")/../sep3d.js"
