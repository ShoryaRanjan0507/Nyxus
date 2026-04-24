import { NextResponse } from 'next/server';
import { banAllViolators } from '@/lib/db';

export async function POST(req: Request) {
  try {
    await banAllViolators();

    return NextResponse.json({ success: true, message: `Successfully executed global ban on all violating identities.` });
  } catch (error) {
    return NextResponse.json({ error: 'Internal API Error' }, { status: 500 });
  }
}
