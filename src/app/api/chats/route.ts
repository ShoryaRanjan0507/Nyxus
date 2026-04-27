import { NextResponse } from 'next/server';
import { readDb, savePhantomChat, savePermanentChat } from '@/lib/db';

// Helper to generate 6 digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function GET(req: Request) {
  try {
    const db = await readDb();
    const url = new URL(req.url);
    const username = url.searchParams.get('username');
    
    if (username) {
        const user = db.users.find(u => u.username === username);
        if (user && user.isBanned) {
             return NextResponse.json({ error: 'You are permanently banned from Nyxus.' }, { status: 403 });
        }
    }

    const now = Date.now();
    // Filter expired chats locally for now, since readDb already fetched them
    const activePhantomChats = db.phantomChats.filter(chat => chat.expiresAt > now);

    return NextResponse.json({
      permanentChats: db.permanentChats,
      phantomChats: activePhantomChats
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { type, name, creator, durationHours, durationMinutes } = await req.json();
    const db = await readDb();

    if (creator) {
        const user = db.users.find(u => u.username === creator);
        if (user && user.isBanned) {
            return NextResponse.json({ error: 'You are permanently banned from Nyxus.' }, { status: 403 });
        }
    }

    if (type === 'phantom') {
      const minutes = parseInt(durationMinutes) || 0;
      const hours = parseInt(durationHours) || 0;
      const totalMs = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);

      if (totalMs <= 0) return NextResponse.json({ error: 'Invalid duration' }, { status: 400 });

      const newId = `ph-${Date.now()}`;
      const newChat = {
        id: newId,
        otp: generateOtp(),
        creator: creator,
        createdAt: Date.now(),
        expiresAt: Date.now() + totalMs,
        messages: [],
        bannedUsers: []
      };

      await savePhantomChat(newChat);
      return NextResponse.json({ chat: newChat });

    } else if (type === 'permanent') {
      if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

      const newId = `perm-${Date.now()}`;
      const newChat = {
        id: newId,
        name,
        creator: creator,
        messages: [],
        bannedUsers: [],
        members: []
      };

      await savePermanentChat(newChat);
      return NextResponse.json({ chat: newChat });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
