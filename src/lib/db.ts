
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import type { Complaint, ProblemStatus, Reply, StatusChange, UserProfile } from '@/lib/types';

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'studentvoice.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  fs.mkdirSync(dataDir, { recursive: true });
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  migrate(db);
  return db;
}

function migrate(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      uid TEXT PRIMARY KEY,
      email TEXT,
      userId TEXT,
      password TEXT,
      role TEXT NOT NULL,
      fullName TEXT,
      post TEXT,
      priorityPoints INTEGER,
      createdAt TEXT NOT NULL,
      UNIQUE (email),
      UNIQUE (userId)
    );

    CREATE TABLE IF NOT EXISTS complaints (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT '',
      priorityPoints INTEGER NOT NULL DEFAULT 0,
      authorName TEXT NOT NULL,
      authorAvatarUrl TEXT,
      authorYear TEXT,
      authorBranch TEXT,
      status TEXT NOT NULL,
      hashtags TEXT NOT NULL DEFAULT '[]',
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS replies (
      id TEXT PRIMARY KEY,
      complaintId TEXT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
      authorName TEXT NOT NULL,
      isOP INTEGER NOT NULL DEFAULT 0,
      post TEXT,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      upvotes INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS status_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      complaintId TEXT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
      status TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
  `);

  seed(database);
}

function seed(database: Database.Database): void {
  const count = database.prepare('SELECT COUNT(*) AS c FROM complaints').get() as { c: number };
  if (count.c > 0) return;

  const insertComplaint = database.prepare(`
    INSERT INTO complaints (id, title, description, category, priorityPoints, authorName, authorAvatarUrl, authorYear, authorBranch, status, hashtags, createdAt)
    VALUES (@id, @title, @description, @category, @priorityPoints, @authorName, @authorAvatarUrl, @authorYear, @authorBranch, @status, @hashtags, @createdAt)
  `);
  const insertReply = database.prepare(`
    INSERT INTO replies (id, complaintId, authorName, isOP, post, content, createdAt, upvotes)
    VALUES (@id, @complaintId, @authorName, @isOP, @post, @content, @createdAt, @upvotes)
  `);
  const insertHistory = database.prepare(`
    INSERT INTO status_history (complaintId, status, timestamp)
    VALUES (@complaintId, @status, @timestamp)
  `);

  const seedAll = database.transaction(() => {
    const problems: Complaint[] = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'data', 'problems.json'), 'utf-8')
    );
    for (const p of problems) {
      insertComplaint.run({
        id: p.id,
        title: p.title,
        description: p.description,
        category: p.category ?? '',
        priorityPoints: p.priorityPoints,
        authorName: p.author.name,
        authorAvatarUrl: p.author.avatarUrl ?? null,
        authorYear: p.author.year ?? null,
        authorBranch: p.author.branch ?? null,
        status: p.status,
        hashtags: JSON.stringify(p.hashtags),
        createdAt: p.createdAt,
      });
      for (const r of p.replies ?? []) {
        insertReply.run({
          id: r.id,
          complaintId: p.id,
          authorName: r.author.name,
          isOP: r.author.isOP ? 1 : 0,
          post: r.author.post ?? null,
          content: r.content,
          createdAt: r.createdAt,
          upvotes: r.upvotes,
        });
      }
      for (const h of p.statusHistory ?? []) {
        insertHistory.run({ complaintId: p.id, status: h.status, timestamp: h.timestamp });
      }
    }

    const users: UserProfile[] = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'data', 'users.json'), 'utf-8')
    );
    const insertUser = database.prepare(`
      INSERT OR IGNORE INTO users (uid, email, userId, password, role, fullName, post, priorityPoints, createdAt)
      VALUES (@uid, @email, @userId, @password, @role, @fullName, @post, @priorityPoints, @createdAt)
    `);
    for (const u of users) {
      insertUser.run({
        uid: u.uid,
        email: u.email,
        userId: u.userId ?? null,
        password: u.password ?? null,
        role: u.role,
        fullName: u.fullName ?? null,
        post: u.post ?? null,
        priorityPoints: u.priorityPoints ?? null,
        createdAt: typeof u.createdAt === 'string' ? u.createdAt : u.createdAt.toISOString(),
      });
    }
  });

  seedAll();
}

type ComplaintRow = {
  id: string;
  title: string;
  description: string;
  category: string;
  priorityPoints: number;
  authorName: string;
  authorAvatarUrl: string | null;
  authorYear: string | null;
  authorBranch: string | null;
  status: ProblemStatus;
  hashtags: string;
  createdAt: string;
};

type ReplyRow = {
  id: string;
  authorName: string;
  isOP: number;
  post: string | null;
  content: string;
  createdAt: string;
  upvotes: number;
};

export function rowToComplaint(row: ComplaintRow, replies: ReplyRow[], history: StatusChange[]): Complaint {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    priorityPoints: row.priorityPoints,
    author: {
      name: row.authorName,
      avatarUrl: row.authorAvatarUrl ?? undefined,
      year: row.authorYear ?? undefined,
      branch: row.authorBranch ?? undefined,
    },
    status: row.status,
    hashtags: JSON.parse(row.hashtags),
    createdAt: row.createdAt,
    replies: replies.map((r) => ({
      id: r.id,
      author: {
        name: r.authorName,
        isOP: r.isOP === 1,
        post: r.post ?? undefined,
      },
      content: r.content,
      createdAt: r.createdAt,
      upvotes: r.upvotes,
    })),
    statusHistory: history,
  };
}

export function rowToUser(row: {
  uid: string;
  email: string | null;
  userId: string | null;
  password: string | null;
  role: 'student' | 'admin';
  fullName: string | null;
  post: string | null;
  priorityPoints: number | null;
  createdAt: string;
}): UserProfile {
  return {
    uid: row.uid,
    email: row.email,
    userId: row.userId ?? undefined,
    role: row.role,
    createdAt: new Date(row.createdAt),
    password: row.password ?? undefined,
    fullName: row.fullName ?? undefined,
    post: row.post ?? undefined,
    priorityPoints: row.priorityPoints ?? undefined,
  };
}
