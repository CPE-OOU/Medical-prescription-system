import { conversations, messages } from '@/db/schema';
import { SearchCard } from '../../../__components/search';
import { desc, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { ShowChat } from './__components/showChat';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db/init';

export const dynamic = 'force-dynamic';
export default async function MainPage({
  params,
}: {
  params: { chat: string[] };
}) {
  const user = await getCurrentUser();
  if (!user) return redirect('/sign-in');
  const [chatId] = params?.chat ?? [];
  let data;
  let message;
  if (chatId) {
    data = await db.query.conversations.findFirst({
      where: eq(conversations.id, chatId),
      with: {
        message: {
          where: eq(conversations.id, messages.conversationId),
          orderBy: desc(messages.sentTime),
        },
      },
    });
    if (data) {
      message = await db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, data.id));
    }

    if (!data) {
      return redirect('/chat');
    }
  }

  return (
    <div className="w-full h-full flex flex-col px-[60px] pb-[60px]">
      <div className="flex-1 pt-8">
        {data && message && (
          <ShowChat data={{ ...data, message: message as any }} />
        )}
      </div>
      <SearchCard
        user={user as any}
        conversationId={data?.id}
        hideCover={data?.message.length === 0}
      />
    </div>
  );
}
