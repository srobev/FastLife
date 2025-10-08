import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jwt-simple';
import { db } from '../../db/connection';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';

export async function authRoutes(app: FastifyInstance) {
  const jwtSecret = process.env.JWT_ACCESS_SECRET!;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;

  app.post('/auth/register', async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };
    if (!email || !password) return reply.code(400).send({ error: 'Email and password required' });

    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length) return reply.code(400).send({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(users).values({ email, pass_hash: hash }).returning({ id: users.id });

    const token = jwt.encode({ userId: user.id }, jwtSecret);
    const refreshToken = jwt.encode({ userId: user.id }, jwtRefreshSecret);

    reply.send({ token, refreshToken });
  });

  app.post('/auth/login', async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user.length || !(await bcrypt.compare(password, user[0].pass_hash))) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const token = jwt.encode({ userId: user[0].id }, jwtSecret);
    const refreshToken = jwt.encode({ userId: user[0].id }, jwtRefreshSecret);

    reply.send({ token, refreshToken });
  });

  app.post('/auth/refresh', async (request, reply) => {
    const { refreshToken } = request.body as { refreshToken: string };
    if (!refreshToken) return reply.code(400).send({ error: 'Refresh token required' });

    try {
      const { userId } = jwt.decode(refreshToken, jwtRefreshSecret);
      const token = jwt.encode({ userId }, jwtSecret);
      reply.send({ token });
    } catch {
      reply.code(401).send({ error: 'Invalid refresh token' });
    }
  });
}
