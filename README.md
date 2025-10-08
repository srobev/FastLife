# FastLife Online

A multiplayer, turn-based life-sim game inspired by *Jones in the Fast Lane*, playable in the browser for desktop and mobile.

## Getting Started

1. Clone the repo.
2. Run `npm install`.
3. Run `docker compose up` to start services.

Health check: GET /health should return {status: "ok"}.

## Monorepo Structure

- `packages/server/`: Backend with Fastify, Socket.IO, simulation.
- `packages/client/`: Frontend with React, Vite, PixiJS.
- `packages/shared/`: Shared types, schemas, constants.

For more details, see `docs/`.
