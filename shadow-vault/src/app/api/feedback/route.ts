import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { username, text } = await req.json();

    if (!username || !text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const db = await readDb();

    // ensure feedbacks array exists
    if (!db.feedbacks) db.feedbacks = [];

    db.feedbacks.push({
      timestamp: Date.now(),
      username,
      text
    });

    await writeDb(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
