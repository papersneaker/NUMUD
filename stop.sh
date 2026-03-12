#!/bin/bash
# Ephemera — graceful stop
# Stops the Node server (if running via pm2) and the Docker containers

echo "Stopping Ephemera..."

# If running under pm2
if command -v pm2 &>/dev/null; then
  pm2 stop ephemera 2>/dev/null && echo "  Server stopped (pm2)" || echo "  Server not running under pm2"
fi

# Stop Docker containers (data volumes are preserved)
sudo docker compose stop
echo "  Docker containers stopped"
echo "Done."
