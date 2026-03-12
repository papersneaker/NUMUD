#!/bin/bash
# Ephemera — start infrastructure + server

echo "Starting Ephemera..."

# Start Docker containers
sudo docker compose up -d
echo "  Docker containers started"

# Dev mode — run in foreground with hot reload
# For production use: pm2 start dist/server.js --name ephemera
pnpm --filter @ephemera/server dev
