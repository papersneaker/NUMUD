# Ephemera MUD Engine

Web-based Vampire: The Masquerade MUD. Node.js + TypeScript + Socket.io + PostgreSQL + Redis.

## Structure

```
ephemera/
├── apps/
│   ├── server/          Node.js + Socket.io + Drizzle ORM
│   └── client/          React + TypeScript terminal UI
├── packages/
│   └── shared/          Socket.io event types, command types, branded IDs
├── docker-compose.yml   PostgreSQL + Redis for local dev
└── turbo.json
```

## Three-Layer Architecture

```
network/    Socket.io handlers — thin translation only, no game logic
game/       Pure game logic — zero imports from network or db
db/         Drizzle repositories + Redis client — injected into game services
```

**Cardinal rule**: `game/` has zero imports from `network/` or `db/`.

## Persistence Split

| State | Storage | Strategy |
|---|---|---|
| Movement, room occupancy, combat rounds | Redis | Write-behind (30s flush) |
| Sessions, cooldowns | Redis | TTL keys |
| Boons, Status grants, Blood Hunt, Siring | PostgreSQL | Write-through (immediate) |
| Characters, inventory, world structure | PostgreSQL | Source of truth on restart |

**Rule**: if another player could witness it happening, it writes through immediately.

## Quick Start

```bash
# 1. Start PostgreSQL + Redis
docker compose up -d

# 2. Install dependencies
pnpm install

# 3. Copy and configure env
cp apps/server/.env.example apps/server/.env

# 4. Run migrations (once Drizzle migrations are generated)
# pnpm --filter @ephemera/server db:migrate

# 5. Dev mode (server + client in parallel)
pnpm dev
```

## Redis Key Patterns

| Key | Type | Purpose |
|---|---|---|
| `session:{token}` | String + TTL | JWT session, 24h expiry |
| `player:{id}:state` | Hash | Hot player state |
| `player:{id}:location` | String | Current room ID |
| `room:{id}:players` | Set | Character IDs in room |
| `dirty:players` | Set | Characters pending Postgres flush |
| `cooldown:{id}:{ability}` | String + TTL | Ability cooldown shadow key |

## Tech Stack

- **Runtime**: Node.js 22 + TypeScript 5
- **Transport**: Socket.io 4 (websocket only)
- **ORM**: Drizzle ORM + PostgreSQL 16
- **Cache**: Redis 7 (AOF persistence)
- **Client**: React 18 + Zustand + Vite
- **Monorepo**: Turborepo + pnpm workspaces
- **Dev**: tsx watch | **Prod**: esbuild bundle + node
