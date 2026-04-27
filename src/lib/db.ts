import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export type User = {
  username: string;
  password?: string;
  role: 'user' | 'dev';
  isBanned: boolean;
  plan?: 'free' | 'premium';
};

export type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
};

export type PhantomChat = {
  id: string;
  otp: string;
  creator: string;
  createdAt: number;
  expiresAt: number;
  messages: Message[];
  bannedUsers: string[];
};

export type PermanentChat = {
  id: string;
  name: string;
  creator: string;
  messages: Message[];
  bannedUsers: string[];
  members: string[];
};

export type SafetyLog = {
  timestamp: number;
  username: string;
  message: string;
  communityId: string;
};

export type Feedback = {
  timestamp: number;
  username: string;
  text: string;
};

export type SupportQuery = {
  timestamp: number;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
};

export type Database = {
  users: User[];
  phantomChats: PhantomChat[];
  permanentChats: PermanentChat[];
  safetyLogs: SafetyLog[];
  feedbacks: Feedback[];
  supportQueries: SupportQuery[];
};

// Initialize Database Tables
export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY,
      password TEXT,
      role TEXT DEFAULT 'user',
      is_banned BOOLEAN DEFAULT FALSE,
      plan TEXT DEFAULT 'free'
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS phantom_chats (
      id TEXT PRIMARY KEY,
      otp TEXT,
      creator TEXT,
      created_at BIGINT,
      expires_at BIGINT,
      messages JSONB DEFAULT '[]',
      banned_users JSONB DEFAULT '[]'
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS permanent_chats (
      id TEXT PRIMARY KEY,
      name TEXT,
      creator TEXT,
      messages JSONB DEFAULT '[]',
      banned_users JSONB DEFAULT '[]',
      members JSONB DEFAULT '[]'
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS safety_logs (
      id SERIAL PRIMARY KEY,
      timestamp BIGINT,
      username TEXT,
      message TEXT,
      community_id TEXT
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id SERIAL PRIMARY KEY,
      timestamp BIGINT,
      username TEXT,
      text TEXT
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS support_queries (
      id SERIAL PRIMARY KEY,
      timestamp BIGINT,
      email TEXT,
      subject TEXT,
      message TEXT,
      status TEXT DEFAULT 'open'
    )
  `;
}

// Helper to get everything (for compatibility, but better to use specific queries)
export async function readDb(): Promise<Database> {
  await initDb();
  
  const users = await sql`SELECT * FROM users`;
  const phantomChats = await sql`SELECT * FROM phantom_chats`;
  const permanentChats = await sql`SELECT * FROM permanent_chats`;
  const safetyLogs = await sql`SELECT * FROM safety_logs`;
  const feedbacks = await sql`SELECT * FROM feedbacks`;
  const supportQueries = await sql`SELECT * FROM support_queries`;

  return {
    users: users.map(u => ({
      username: u.username,
      password: u.password,
      role: u.role as 'user' | 'dev',
      isBanned: u.is_banned,
      plan: u.plan as 'free' | 'premium'
    })),
    phantomChats: phantomChats.map(c => ({
      id: c.id,
      otp: c.otp,
      creator: c.creator,
      createdAt: Number(c.created_at),
      expiresAt: Number(c.expires_at),
      messages: c.messages,
      bannedUsers: c.banned_users
    })),
    permanentChats: permanentChats.map(c => ({
      id: c.id,
      name: c.name,
      creator: c.creator,
      messages: c.messages,
      bannedUsers: c.banned_users,
      members: c.members
    })),
    safetyLogs: safetyLogs.map(l => ({
      timestamp: Number(l.timestamp),
      username: l.username,
      message: l.message,
      communityId: l.community_id
    })),
    feedbacks: feedbacks.map(f => ({
      timestamp: Number(f.timestamp),
      username: f.username,
      text: f.text
    })),
    supportQueries: supportQueries.map(q => ({
      timestamp: Number(q.timestamp),
      email: q.email,
      subject: q.subject,
      message: q.message,
      status: q.status as 'open' | 'resolved'
    }))
  };
}

// Migration helper to save everything back (not recommended for SQL, but used for compatibility)
export async function writeDb(db: Database): Promise<void> {
  // This is a slow "brute force" sync for migration. 
  // In a real app, we should use specific INSERT/UPDATE queries.
  // For now, I'll implement specific update methods for each type.
}

// Optimized Data Access Methods
export async function getUsers() {
  await initDb();
  const rows = await sql`SELECT * FROM users`;
  return rows.map(u => ({
    username: u.username,
    password: u.password,
    role: u.role as 'user' | 'dev',
    isBanned: u.is_banned,
    plan: u.plan as 'free' | 'premium'
  }));
}

export async function saveUser(user: User) {
  await sql`
    INSERT INTO users (username, password, role, is_banned, plan)
    VALUES (${user.username}, ${user.password}, ${user.role}, ${user.isBanned}, ${user.plan})
    ON CONFLICT (username) DO UPDATE SET
      password = EXCLUDED.password,
      role = EXCLUDED.role,
      is_banned = EXCLUDED.is_banned,
      plan = EXCLUDED.plan
  `;
}

export async function getPhantomChat(id: string): Promise<PhantomChat | null> {
  await initDb();
  const rows = await sql`SELECT * FROM phantom_chats WHERE id = ${id}`;
  if (rows.length === 0) return null;
  const c = rows[0];
  return {
    id: c.id,
    otp: c.otp,
    creator: c.creator,
    createdAt: Number(c.created_at),
    expiresAt: Number(c.expires_at),
    messages: c.messages,
    bannedUsers: c.banned_users
  };
}

export async function savePhantomChat(chat: PhantomChat) {
  await sql`
    INSERT INTO phantom_chats (id, otp, creator, created_at, expires_at, messages, banned_users)
    VALUES (${chat.id}, ${chat.otp}, ${chat.creator}, ${chat.createdAt}, ${chat.expiresAt}, ${JSON.stringify(chat.messages)}, ${JSON.stringify(chat.bannedUsers)})
    ON CONFLICT (id) DO UPDATE SET
      messages = EXCLUDED.messages,
      banned_users = EXCLUDED.banned_users
  `;
}

export async function getPermanentChat(id: string): Promise<PermanentChat | null> {
  await initDb();
  const rows = await sql`SELECT * FROM permanent_chats WHERE id = ${id}`;
  if (rows.length === 0) return null;
  const c = rows[0];
  return {
    id: c.id,
    name: c.name,
    creator: c.creator,
    messages: c.messages,
    bannedUsers: c.banned_users,
    members: c.members
  };
}

export async function savePermanentChat(chat: PermanentChat) {
  await sql`
    INSERT INTO permanent_chats (id, name, creator, messages, banned_users, members)
    VALUES (${chat.id}, ${chat.name}, ${chat.creator}, ${JSON.stringify(chat.messages)}, ${JSON.stringify(chat.bannedUsers)}, ${JSON.stringify(chat.members)})
    ON CONFLICT (id) DO UPDATE SET
      messages = EXCLUDED.messages,
      banned_users = EXCLUDED.banned_users,
      members = EXCLUDED.members
  `;
}

export async function addSafetyLog(log: SafetyLog) {
  await sql`
    INSERT INTO safety_logs (timestamp, username, message, community_id)
    VALUES (${log.timestamp}, ${log.username}, ${log.message}, ${log.communityId})
  `;
}

export async function addFeedback(fb: Feedback) {
  await sql`
    INSERT INTO feedbacks (timestamp, username, text)
    VALUES (${fb.timestamp}, ${fb.username}, ${fb.text})
  `;
}

export async function addSupportQuery(q: SupportQuery) {
  await sql`
    INSERT INTO support_queries (timestamp, email, subject, message, status)
    VALUES (${q.timestamp}, ${q.email}, ${q.subject}, ${q.message}, ${q.status})
  `;
}

export async function banAllViolators() {
  const logs = await sql`SELECT DISTINCT username FROM safety_logs`;
  for (const log of logs) {
    await sql`UPDATE users SET is_banned = TRUE WHERE username = ${log.username}`;
  }
}
