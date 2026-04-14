import { db } from '../db';
import { users, InsertUser, insertUserSchema } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Use Zod-inferred type for repository inputs so routes can pass
// `insertUserSchema.parse(...)` directly without type mismatches.
type CreateUserInput = z.infer<typeof insertUserSchema>;

export class UserRepository {
  async create(userData: CreateUserInput) {
    if (!db) throw new Error('Database not available in demo mode');
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [user] = await db
      .insert(users)
      .values({ ...userData, password: hashedPassword } as InsertUser)
      .returning();
    return user;
  }

  async findByEmail(email: string) {
    if (!db) throw new Error('Database not available in demo mode');
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async findAll() {
    if (!db) throw new Error('Database not available in demo mode');
    return await db.select().from(users);
  }

  async verifyPassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
export const userRepository = new UserRepository();
