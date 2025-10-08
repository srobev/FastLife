import fastify from 'fastify';
import { Server } from 'socket.io';
import { RedisAdapter } from 'socket.io-redis';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { authRoutes } from './http/routes/auth';
import jwt from 'jwt-simple';

config(); // load .env

const PORT = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3000;

const app = fastify();

// Health endpoint
app.get('/health', async () => {
  return { status: 'ok' };
});

// Version endpoint - git sha
app.get('/version', async () => {
  try {
    const sha = fs.readFileSync(path.join(__dirname, '..', '..', 'version.txt'), 'utf8').trim();
    return { version: sha };
  } catch {
    return { version: 'dev' };
  }
});

await authRoutes(app);

const server = app.server;

const io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN },
});

// Basic socket echo for testing
io.on('connection', (socket) => {
  console.log('socket connected');
  socket.on('echo', (data: any) => {
    socket.emit('echo', data);
  });
});

app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
