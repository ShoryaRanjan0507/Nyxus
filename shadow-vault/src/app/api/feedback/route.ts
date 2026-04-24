import { NextResponse } from 'next/server';
import { addFeedback } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { username, text } = await req.json();

    if (!username || !text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await addFeedback({
      timestamp: Date.now(),
      username,
      text
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
