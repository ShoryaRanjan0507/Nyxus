import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data.json');

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
  members: string[]; // usernames that have joined
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

const defaultDb: Database = {
  users: [],
  phantomChats: [],
  permanentChats: [],
  safetyLogs: [],
  feedbacks: [],
  supportQueries: []
};

// Initialize DB if not exists
export async function initDb() {
  try {
    await fs.access(dbPath);
  } catch (error) {
    await fs.writeFile(dbPath, JSON.stringify(defaultDb, null, 2), 'utf-8');
  }
}

export async function readDb(): Promise<Database> {
  await initDb();
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

export async function writeDb(db: Database): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}
