import { NextResponse } from 'next/server';
import { getUsers, saveUser } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const users = await getUsers();
    if (users.find(u => u.username === username)) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const isDev = username.toLowerCase() === 'admin';
    const newUser = {
      username,
      password, // Plain text for prototype only
      role: (isDev ? 'dev' : 'user') as 'dev' | 'user',
      isBanned: false
    };

    await saveUser(newUser);

    return NextResponse.json({ message: 'User created' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
