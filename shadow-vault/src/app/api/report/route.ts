import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { reporter, reportedId, reason } = await req.json();

    if (!reporter || !reportedId || !reason) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const db = await readDb();

    // Push to safetyLogs so it shows up in Dev Dashboard
    const log = {
      timestamp: Date.now(),
      username: reportedId,
      message: `[USER REPORTED]: ${reason}`,
      communityId: `Reported by ${reporter}`
    };

    db.safetyLogs.push(log);
    await writeDb(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
