import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const db = await readDb();
    
    // Find all distinct users in safety logs
    const offendingUsers = new Set(db.safetyLogs.map(log => log.username));
    
    let bannedCount = 0;
    offendingUsers.forEach(username => {
       const userIndex = db.users.findIndex(u => u.username === username);
       // Skip if not found or if they are a dev
       if (userIndex !== -1 && db.users[userIndex].role !== 'dev') {
           if (!db.users[userIndex].isBanned) {
              db.users[userIndex].isBanned = true;
              bannedCount++;
           }
       }
    });

    await writeDb(db);

    return NextResponse.json({ success: true, message: `Successfully executed global ban on ${bannedCount} violating identities.` });
  } catch (error) {
    return NextResponse.json({ error: 'Internal API Error' }, { status: 500 });
  }
}
