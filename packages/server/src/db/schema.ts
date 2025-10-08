// Drizzle schema for Postgres

import { pgTable, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text().notNull().unique(),
  pass_hash: text().notNull(),
  created_at: timestamp().defaultNow(),
});

export const worlds = pgTable('worlds', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  ruleset_json: jsonb(),
  created_at: timestamp().defaultNow(),
});

export const rooms = pgTable('rooms', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  world_id: integer().references(() => worlds.id),
  code: text().notNull().unique(),
  status: text().notNull(), // 'lobby', 'playing', 'finished'
  max_players: integer().default(4),
  turn_index: integer().default(0),
  phase: text().default('lobby'),
  seed: text().notNull(),
  started_at: timestamp(),
  created_at: timestamp().defaultNow(),
});

export const room_players = pgTable('room_players', {
  room_id: integer().references(() => rooms.id).notNull(),
  user_id: integer().references(() => users.id).notNull(),
  seat: integer().notNull(),
  cash: integer().default(0),
  energy: integer().default(100),
  health: integer().default(100),
  happiness: integer().default(100),
  edu_tier: integer().default(0),
  edu_xp: integer().default(0),
  job_id: integer(),
  home_city: integer(),
  current_city: integer(),
  housing_tier: integer(),
  stats_json: jsonb(),
}, (table) => ({
  pk: [table.room_id, table.user_id]
}));

// Other tables as per spec, but minimal for now
export const cities = pgTable('cities', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  pos_x: integer().notNull(),
  pos_y: integer().notNull(),
  traits_json: jsonb(),
  markets_json: jsonb(),
});

// Similarly for jobs, routes, etc.
// For now, minimal
