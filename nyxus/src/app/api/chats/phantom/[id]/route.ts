import { NextResponse } from 'next/server';
import { getPhantomChat, savePhantomChat, getUsers, addSafetyLog } from '@/lib/db';

const BAD_WORDS = ['badword', 'spam', 'hate', 'nsfw', 'toxic', 'cocaine', 'heroin', 'murder', 'fraud', 'steal', 'hack', 'exploit', 'illegal', 'crime', 'narcotics', 'meth', 'weapon', 'human trafficking', 'drugs', 'drug', 'rape', 'terrorist', 'terror', 'bomb', 'terror attack', 'child porn', 'child abuse'];

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // In Next.js 15, params is a Promise
) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const otp = url.searchParams.get('otp');
    
    const chat = await getPhantomChat(id);
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

    if (Date.now() > chat.expiresAt) {
      return NextResponse.json({ error: 'Chat has expired and been nuked.' }, { status: 410 });
    }

    if (chat.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 403 });
    }

    return NextResponse.json({ chat });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action, sender, text, banUsername } = await req.json();
    
    const chat = await getPhantomChat(id);
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    
    if (Date.now() > chat.expiresAt) {
        return NextResponse.json({ error: 'Chat has expired.' }, { status: 410 });
    }

    if (chat.bannedUsers.includes(sender)) {
        return NextResponse.json({ error: 'You are banned from this chat.' }, { status: 403 });
    }

    if (action === 'send') {
      const users = await getUsers();
      const user = users.find((u: any) => u.username === sender);
      const isPremium = user?.plan === 'premium' || user?.role === 'dev';

      const lowerText = text.toLowerCase();
      const isFlagged = BAD_WORDS.some(word => lowerText.includes(word));

      if (isFlagged && !isPremium) {
        const log = {
          timestamp: Date.now(),
          username: sender,
          message: text,
          communityId: `Phantom-${chat.id.slice(-6)}`
        };
        await addSafetyLog(log);

        console.log('\n--- SAFETY API ALERT (PHANTOM) ---');
        console.log(`[${new Date(log.timestamp).toLocaleString()}]`);
        console.log(`User: ${log.username}`);
        console.log(`Phantom Chat: ${log.communityId}`);
        console.log(`Flagged Message: ${log.message}`);
        console.log('----------------------------------\n');

        return NextResponse.json({ error: 'Message flagged by Safety API.' }, { status: 406 });
      }

      const newMsg = {
        id: `msg-${Date.now()}`,
        sender,
        text,
        timestamp: Date.now()
      };
      chat.messages.push(newMsg);
    } else if (action === 'ban') {
      if (!chat.bannedUsers.includes(banUsername)) {
         chat.bannedUsers.push(banUsername);
      }
    }

    await savePhantomChat(chat);

    return NextResponse.json({ success: true, chat });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
