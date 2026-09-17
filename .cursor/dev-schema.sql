-- Dev-only schema bootstrap for local Cloud Agent environments.
-- Mirrors packages/server/src/db/schema.ts until a migration runner is added.
-- Safe to run repeatedly (IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  email text NOT NULL UNIQUE,
  pass_hash text NOT NULL,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS worlds (
  id serial PRIMARY KEY,
  name text NOT NULL,
  ruleset_json jsonb,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rooms (
  id serial PRIMARY KEY,
  world_id integer REFERENCES worlds(id),
  code text NOT NULL UNIQUE,
  status text NOT NULL,
  max_players integer DEFAULT 4,
  turn_index integer DEFAULT 0,
  phase text DEFAULT 'lobby',
  seed text NOT NULL,
  started_at timestamp,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS room_players (
  room_id integer NOT NULL REFERENCES rooms(id),
  user_id integer NOT NULL REFERENCES users(id),
  seat integer NOT NULL,
  cash integer DEFAULT 0,
  energy integer DEFAULT 100,
  health integer DEFAULT 100,
  happiness integer DEFAULT 100,
  edu_tier integer DEFAULT 0,
  edu_xp integer DEFAULT 0,
  job_id integer,
  home_city integer,
  current_city integer,
  housing_tier integer,
  stats_json jsonb,
  PRIMARY KEY (room_id, user_id)
);

CREATE TABLE IF NOT EXISTS cities (
  id serial PRIMARY KEY,
  name text NOT NULL,
  pos_x integer NOT NULL,
  pos_y integer NOT NULL,
  traits_json jsonb,
  markets_json jsonb
);
