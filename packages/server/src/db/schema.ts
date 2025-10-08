// Drizzle schema for Postgres

import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  pass_hash: text('pass_hash').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const worlds = pgTable('worlds', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ruleset_json: jsonb('ruleset_json'),
  created_at: timestamp('created_at').defaultNow(),
});

export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  world_id: integer('world_id').references(() => worlds.id),
  code: text('code').notNull().unique(),
  status: text('status').notNull(), // 'lobby', 'playing', 'finished'
  max_players: integer('max_players').default(4),
  turn_index: integer('turn_index').default(0),
  phase: text('phase').default('lobby'),
  seed: text('seed').notNull(),
  started_at: timestamp('started_at'),
  created_at: timestamp('created_at').defaultNow(),
});

export const room_players = pgTable('room_players', {
  room_id: integer('room_id').references(() => rooms.id).notNull(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  seat: integer('seat').notNull(),
  cash: integer('cash').default(0),
  energy: integer('energy').default(100),
  health: integer('health').default(100),
  happiness: integer('happiness').default(100),
  edu_tier: integer('edu_tier').default(0),
  edu_xp: integer('edu_xp').default(0),
  job_id: integer('job_id'),
  home_city: integer('home_city'),
  current_city: integer('current_city'),
  housing_tier: integer('housing_tier'),
  stats_json: jsonb('stats_json'),
}, (table) => ({
  pk: [table.room_id, table.user_id]
}));

// Other tables as per spec, but minimal for now
export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  pos_x: integer('pos_x').notNull(),
  pos_y: integer('pos_y').notNull(),
  traits_json: jsonb('traits_json'),
  markets_json: jsonb('markets_json'),
});

// Similarly for jobs, routes, etc.
// For now, minimal
