import { NextResponse } from 'next/server';
import { getUsers, saveUser } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    const users = await getUsers();

    const user = users.find(u => u.username === username);
    if (!user) {
      return NextResponse.json({ error: 'User not found in system' }, { status: 404 });
    }

    if (user.role === 'dev') {
       return NextResponse.json({ error: 'Cannot ban a developer' }, { status: 403 });
    }

    user.isBanned = true;
    await saveUser(user);

    return NextResponse.json({ success: true, message: `User ${username} has been globally banned from Nyxus.` });
  } catch (error) {
    return NextResponse.json({ error: 'Internal API Error' }, { status: 500 });
  }
}
