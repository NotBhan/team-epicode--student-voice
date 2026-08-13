
'use server';

import type { UserProfile, UserRole } from '@/lib/types';
import { getDb, rowToUser } from '@/lib/db';

export async function getAllUsers(): Promise<UserProfile[]> {
  const database = getDb();
  const rows = database.prepare('SELECT * FROM users').all() as any[];
  return rows.map(rowToUser);
}

export async function getUserByUid(uid: string): Promise<UserProfile | undefined> {
  const database = getDb();
  const row = database.prepare('SELECT * FROM users WHERE uid = ?').get(uid) as any;
  return row ? rowToUser(row) : undefined;
}

export async function updateUserPriorityPoints(userId: string, newPoints: number): Promise<UserProfile[]> {
  const database = getDb();
  database.prepare('UPDATE users SET priorityPoints = ? WHERE uid = ?').run(newPoints, userId);
  return getAllUsers();
}

export async function addUser(input: {
  email?: string | null;
  userId?: string | null;
  password: string;
  role: UserRole;
  fullName?: string | null;
  post?: string | null;
  priorityPoints?: number | null;
}): Promise<UserProfile> {
  const database = getDb();
  const uid = `user-${Date.now()}`;
  const createdAt = new Date().toISOString();

  database.prepare(`
    INSERT INTO users (uid, email, userId, password, role, fullName, post, priorityPoints, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    uid,
    input.email ?? null,
    input.userId ?? null,
    input.password,
    input.role,
    input.fullName ?? null,
    input.post ?? null,
    input.priorityPoints ?? null,
    createdAt,
  );

  const row = database.prepare('SELECT * FROM users WHERE uid = ?').get(uid) as any;
  return rowToUser(row);
}
