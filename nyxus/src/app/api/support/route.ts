import { NextResponse } from 'next/server';
import { addSupportQuery } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await addSupportQuery({
      timestamp: Date.now(),
      email,
      subject,
      message,
      status: 'open'
    });

    return NextResponse.json({ success: true, message: 'Query received by Nyxus Command.' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal system error' }, { status: 500 });
  }
}
