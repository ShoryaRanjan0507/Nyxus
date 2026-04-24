import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await readDb();
    return NextResponse.json({ 
      logs: db.safetyLogs, 
      feedbacks: db.feedbacks || [],
      supportQueries: db.supportQueries || []
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal API Error' }, { status: 500 });
  }
}
