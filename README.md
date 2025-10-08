# FastLife Online

A multiplayer, turn-based life-sim game inspired by *Jones in the Fast Lane*, playable in the browser for desktop and mobile.

## Getting Started

### Prerequisites
- Docker and Docker Compose installed on your machine.
- Node.js 18+ for local development (optional).

### Quick Start with Docker (Recommended for Testing)

1. **Clone the repo:**
   ```bash
   git clone <repo-url> fastlife
   cd fastlife
   git checkout main  # Ensure on main branch
   ```

2. **Launch Services:**
   ```bash
   docker compose up --build
   ```

3. **Wait for Startup:** Services will build and start (server on :3000, client on :5173, Postgres and Redis included).

4. **Check Health:**
   - `curl http://localhost:3000/health` → `{status: "ok"}`
   - Visita `http://localhost:5173` to see the FastLife client app.

5. **Test Socket.IO Echo:**
   - Connect a WebSocket client to `ws://localhost:3000/socket.io/?transport=websocket`.
   - Send `{"echo": "test"}` → Receive `{"echo": "test"}` back.

### Local Development (Without Docker)
1. Install dependencies: `npm install`
2. Start Postgres and Redis locally (or use docker-compose only for them).
3. Build shared types: `npm run build --workspace=packages/shared`
4. Run server: `npm run dev --workspace=packages/server`
5. Run client: `npm run dev --workspace=packages/client`
6. Health check as above.

## Monorepo Structure
- `packages/server/`: Fastify HTTP/Socket.IO backend; Drizzle DB; simulation engine.
- `packages/client/`: React + PixiJS frontend; Zustand state; responsive design.
- `packages/shared/`: TypeScript types, JSON schemas (AJV validated), constants.

## API Endpoints
- `GET /health` - Service health.
- `GET /version` - Git SHA.
- `POST /auth/register` - User registration.
- `POST /auth/login` - User login.
- `POST /auth/refresh` - Token refresh.
- `POST /rooms` - Create room.
- `GET /rooms/:code` - Get room details.

## Deployment
- **Development:** Use `docker-compose.yml` (included).
- **Production:** Deploy to GCP GKE (see `infra/k8s/`), use Cloud SQL Postgres and Memorystore Redis for scale.

## Contributing
- Run `npm run lint && npm run build && npm run test` in CI.
- Commit conventional: `feat: add auth`, `fix: resolve WS disconnect`.
- Pull requests require CI green.

For game design/docs, see `docs/gdd.md`.
