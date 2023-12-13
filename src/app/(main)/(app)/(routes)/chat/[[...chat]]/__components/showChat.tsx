import { MessageBox } from '@/app/(main)/(app)/__components/message';
import { Drug } from '@/db/schema';

interface ShowChatProps {
  data: {
    id: string;
    createdAt: Date | null;
    pinned: Date | null;
    title: string | null;
    updateAt: Date | null;
    message: {
      id: string;
      serverContent: Drug | null;
      userContent: string;
      conversationId: string;
      userId: string | null;
      createdAt: Date | null;
      sentTime: Date;
    }[];
  };
}

export const ShowChat: React.FC<ShowChatProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      {data.message.map((message) => (
        <MessageBox key={message.id} message={message as any} />
      ))}
    </div>
  );
};
