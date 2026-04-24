import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    const db = await readDb();

    const userIndex = db.users.findIndex(u => u.username === username);
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found in system' }, { status: 404 });
    }

    if (db.users[userIndex].role === 'dev') {
       return NextResponse.json({ error: 'Cannot ban a developer' }, { status: 403 });
    }

    db.users[userIndex].isBanned = true;
    await writeDb(db);

    return NextResponse.json({ success: true, message: `User ${username} has been globally banned from Shadow Vault.` });
  } catch (error) {
    return NextResponse.json({ error: 'Internal API Error' }, { status: 500 });
  }
}
