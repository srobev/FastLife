#!/usr/bin/env bash
# Cloud Agent install phase: prepare durable, source-derived state.
# Runs after the repository is checked out. Must be idempotent.
set -euo pipefail

cd "$(dirname "$0")/.."

# --- System services: PostgreSQL + Redis -----------------------------------
export DEBIAN_FRONTEND=noninteractive
if ! command -v pg_ctlcluster >/dev/null 2>&1 || ! command -v redis-server >/dev/null 2>&1; then
  sudo apt-get update -qq
  sudo apt-get install -y --no-install-recommends \
    postgresql postgresql-contrib redis-server
fi

# --- Node dependencies ------------------------------------------------------
# Use the lockfile for reproducible installs (matches CI `npm ci`).
npm ci

# --- Build workspaces (shared types, server, client) ------------------------
npm run build

# --- Local dev environment file --------------------------------------------
# In Docker these vars are injected by docker-compose; for native local dev the
# server reads them from packages/server/.env (loaded via `dotenv/config`).
if [ ! -f packages/server/.env ]; then
  cp packages/server/.env.sample packages/server/.env
fi

echo "install.sh complete."
