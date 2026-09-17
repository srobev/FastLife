#!/usr/bin/env bash
# Cloud Agent start phase: reconcile runtime services on every boot.
# Must be idempotent and tolerate restarts.
set -euo pipefail

cd "$(dirname "$0")/.."

# --- PostgreSQL -------------------------------------------------------------
PGVER="$(ls /etc/postgresql 2>/dev/null | sort -n | tail -1)"
if [ -n "${PGVER}" ]; then
  sudo pg_ctlcluster "${PGVER}" main start 2>/dev/null || true
fi

# Wait for Postgres to accept connections.
for _ in $(seq 1 30); do
  if sudo -u postgres pg_isready -q 2>/dev/null; then break; fi
  sleep 1
done

# --- Redis ------------------------------------------------------------------
if ! redis-cli ping >/dev/null 2>&1; then
  sudo redis-server --daemonize yes
fi

# --- Database role + database ----------------------------------------------
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='fastlife'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE ROLE fastlife LOGIN PASSWORD 'password';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='fastlife'" | grep -q 1 || \
  sudo -u postgres createdb -O fastlife fastlife

# --- Dev schema bootstrap ---------------------------------------------------
# The repo ships a Drizzle schema (packages/server/src/db/schema.ts) but no
# migration runner yet, so create the tables the API needs for local dev.
if [ -f .cursor/dev-schema.sql ]; then
  PGPASSWORD=password psql -h localhost -U fastlife -d fastlife \
    -v ON_ERROR_STOP=1 -f .cursor/dev-schema.sql >/dev/null
fi

echo "start.sh complete: Postgres + Redis up, database ready."
