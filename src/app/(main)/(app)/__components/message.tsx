'use client';

import { Message } from '@/db/schema';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MessageProps {
  message: Message;
}

export const MessageBox: React.FC<MessageProps> = ({ message }) => {
  const router = useRouter();
  return (
    <div
      className="bg-white px-8 py-6 rounded-sm"
      onClick={() => {
        if (message.serverContent) {
          router.push(`/about/${message.title}`);
        }
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'px-12 py-1 rounded-sm flex items-center',
            message.serverContent && 'text-[#8E7610] bg-[#FFF8DA]',
            message.userContent && 'text-[#28B95E] bg-[#E9F9EF]'
          )}
        >
          {message.serverContent ? 'Pharma AI' : 'me'}
        </span>
        <span>{format(message.sentTime, 'h:mma')}</span>
      </div>
      <div className="flex items-center gap-x-2 mt-4">
        {message.userContent ? (
          <p className="text-2xl leading-[32px] text-[#16171A]">
            {message.userContent}
          </p>
        ) : (
          <div className="space-y-6">
            <h4 className="font-semibold text-3xl">
              {message.serverContent?.name}
            </h4>
            <div>
              <p className="text-base">{message.serverContent?.decription}</p>
              <div>Symptons: {message.serverContent?.condition}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
