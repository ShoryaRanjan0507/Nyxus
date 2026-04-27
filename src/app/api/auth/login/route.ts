import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const users = await getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.isBanned) {
      return NextResponse.json({ error: 'You are permanently banned from Nyxus.' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Logged in', user: { username: user.username, role: user.role } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
