#!/usr/bin/env bash
set -euo pipefail

# Determine repository root (directory of this script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting Space Invaders server..."
npm start
