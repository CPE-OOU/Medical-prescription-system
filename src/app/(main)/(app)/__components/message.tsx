import { Message } from '@/db/schema';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Star } from 'lucide-react';

interface MessageProps {
  message: Message;
}

export const MessageBox: React.FC<MessageProps> = ({ message }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'px-12 py-1 rounded-sm',
            message.serverContent && 'text-[#8E7610] bg-[#FFF8DA]',
            message.userContent && 'text-[#28B95E] bg-[#E9F9EF]'
          )}
        >
          {message.serverContent ? 'Pharma AI' : 'me'}
        </span>
        <span>{format(message.sentTime, 'h:mma')}</span>
      </div>
      <div className="flex items-center gap-x-2">
        {message.userContent ? (
          <p className="text-2xl leading-[32px] text-[#16171A]">
            {message.userContent}
          </p>
        ) : (
          <div>
            <div>
              <Star className="w-4 h-4 mr-[2xp]" />
              {message.serverContent?.effective}
            </div>
            <div>Symptons: {message.serverContent?.condition}</div>
          </div>
        )}
      </div>
    </div>
  );
};
