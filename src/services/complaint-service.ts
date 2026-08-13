
'use server';

import type { Problem, ProblemStatus } from '@/lib/types';
import { getDb, rowToComplaint } from '@/lib/db';

export async function getAllComplaints(): Promise<Problem[]> {
  const database = getDb();
  const complaints = database.prepare('SELECT * FROM complaints ORDER BY createdAt DESC').all() as any[];
  const replies = database.prepare('SELECT * FROM replies').all() as any[];
  const history = database.prepare('SELECT complaintId, status, timestamp FROM status_history').all() as any[];

  return complaints.map((row) => {
    const complaintReplies = replies.filter((r) => r.complaintId === row.id);
    const complaintHistory = history
      .filter((h) => h.complaintId === row.id)
      .map((h) => ({ status: h.status, timestamp: h.timestamp }));
    return rowToComplaint(row, complaintReplies, complaintHistory);
  });
}

export async function getComplaintById(id: string): Promise<Problem | undefined> {
  const database = getDb();
  const row = database.prepare('SELECT * FROM complaints WHERE lower(id) = lower(?)').get(id) as any;
  if (!row) return undefined;

  const replies = database.prepare('SELECT * FROM replies WHERE complaintId = ?').all(row.id) as any[];
  const history = database
    .prepare('SELECT status, timestamp FROM status_history WHERE complaintId = ?')
    .all(row.id) as any[];
  return rowToComplaint(row, replies, history);
}

export async function addComplaint(problem: Problem): Promise<Problem[]> {
  const database = getDb();
  const now = new Date().toISOString();

  database.prepare(`
    INSERT INTO complaints (id, title, description, category, priorityPoints, authorName, authorAvatarUrl, authorYear, authorBranch, status, hashtags, createdAt)
    VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?, 'Unsolved', ?, ?)
  `).run(
    problem.id,
    problem.title,
    problem.description,
    problem.category,
    problem.author.name,
    problem.author.avatarUrl ?? null,
    problem.author.year ?? null,
    problem.author.branch ?? null,
    JSON.stringify(problem.hashtags),
    now,
  );
  database.prepare('INSERT INTO status_history (complaintId, status, timestamp) VALUES (?, ?, ?)').run(problem.id, 'Unsolved', now);

  return getAllComplaints();
}

export async function updateProblemPoints(problemId: string, newPoints: number): Promise<Problem[]> {
  const database = getDb();
  database.prepare('UPDATE complaints SET priorityPoints = ? WHERE id = ?').run(newPoints, problemId);
  return getAllComplaints();
}

export async function updateProblemStatus(problemId: string, newStatus: ProblemStatus): Promise<Problem[]> {
  const database = getDb();
  const now = new Date().toISOString();
  database.prepare('UPDATE complaints SET status = ? WHERE id = ?').run(newStatus, problemId);
  database.prepare('INSERT INTO status_history (complaintId, status, timestamp) VALUES (?, ?, ?)').run(problemId, newStatus, now);
  return getAllComplaints();
}
