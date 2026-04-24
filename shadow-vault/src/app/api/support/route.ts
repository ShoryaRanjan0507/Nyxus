import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await readDb();

    if (!db.supportQueries) db.supportQueries = [];

    db.supportQueries.push({
      timestamp: Date.now(),
      email,
      subject,
      message,
      status: 'open'
    });

    await writeDb(db);

    return NextResponse.json({ success: true, message: 'Query received by Shadow Command.' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal system error' }, { status: 500 });
  }
}
