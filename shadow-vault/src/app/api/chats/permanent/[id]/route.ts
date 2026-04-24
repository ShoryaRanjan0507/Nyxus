import { NextResponse } from 'next/server';
import { getPermanentChat, savePermanentChat, addSafetyLog } from '@/lib/db';
import { neon } from '@neondatabase/serverless';

const BAD_WORDS = ['badword', 'spam', 'hate', 'nsfw', 'toxic', 'cocaine', 'heroin', 'murder', 'fraud', 'steal', 'hack', 'exploit', 'illegal', 'crime', 'narcotics', 'meth', 'weapon', 'human trafficking', 'drugs', 'drug', 'rape', 'terrorist', 'terror', 'bomb', 'terror attack', 'child porn', 'child abuse'];

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chat = await getPermanentChat(id);
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

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

    const chat = await getPermanentChat(id);
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

    if (chat.bannedUsers.includes(sender)) {
      return NextResponse.json({ error: 'You are permanently banned from this vault.' }, { status: 403 });
    }

    if (action === 'send') {
      const lowerText = text.toLowerCase();
      const isFlagged = BAD_WORDS.some(word => lowerText.includes(word));

      if (isFlagged) {
        const log = {
          timestamp: Date.now(),
          username: sender,
          message: text,
          communityId: chat.name
        };
        await addSafetyLog(log);

        console.log('\n--- SAFETY API ALERT ---');
        console.log(`[${new Date(log.timestamp).toLocaleString()}]`);
        console.log(`User: ${log.username}`);
        console.log(`Community: ${log.communityId}`);
        console.log(`Flagged Message: ${log.message}`);
        console.log('------------------------\n');

        return NextResponse.json({ error: 'Message flagged by Safety API.' }, { status: 406 });
      }

      const newMsg = {
        id: `msg-${Date.now()}`,
        sender,
        text,
        timestamp: Date.now()
      };
      chat.messages.push(newMsg);
      await savePermanentChat(chat);

    } else if (action === 'ban') {
      if (chat.creator !== sender) {
        return NextResponse.json({ error: 'Only the maker can ban users.' }, { status: 403 });
      }
      if (!chat.bannedUsers.includes(banUsername)) {
        chat.bannedUsers.push(banUsername);
        await savePermanentChat(chat);
      }
    } else if (action === 'leave') {
      const sql = neon(process.env.DATABASE_URL!);
      await sql`DELETE FROM permanent_chats WHERE id = ${id}`;
      return NextResponse.json({ success: true, deleted: true });
    }

    return NextResponse.json({ success: true, chat });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
