import { conversations, messages } from '@/db/schema';
import { SearchCard } from '../../../__components/search';
import { desc, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export default async function MainPage({
  params,
}: {
  params: { chat: string[] };
}) {
  const [chatId] = params?.chat ?? [];
  let data;
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

    if (!data) {
      return redirect('/chat');
    }
  }

  return (
    <div className="w-full h-full flex flex-col px-[60px] pb-[60px]">
      <div className="flex-1"></div>
      <SearchCard hideCover={data?.message.length === 0} />
    </div>
  );
}
