import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Pill, Pin, Trash } from 'lucide-react';

import { Conversation } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ConversationItem {
  conversation: Conversation;
}

export const ConversationItem = ({
  conversation: { title, id },
}: ConversationItem) => {
  const [hovered, setHovered] = useState(false);
  const [optionOpened, setOptionOpened] = useState(false);
  const router = useRouter();
  return (
    <div
      className={cn(
        `px-4 py-2 rounded-md  h-10 flex items-center`,
        (hovered || optionOpened) && 'bg-natural-10'
      )}
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
      onClick={() => router.push(`/chat/${id}`)}
    >
      <div className="h-full flex items-center gap-x-2">
        <span className="inline-block p-[6px] rounded-full bg-[#F2F2F2]">
          <Pill className="w-5 h-5" />
        </span>
        <p
          className={cn(
            'truncate body-7 max-w-[134px] w-full text-[#757B82] flex-1 ',
            (hovered || optionOpened) && 'w-[112px]'
          )}
        >
          {title}
        </p>
      </div>
      <div className={cn('hidden', (hovered || optionOpened) && 'block')}>
        <DropdownMenu onOpenChange={setOptionOpened} open={optionOpened}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="rounded-full p-1 w-fit h-fit">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center gap-x-4">
                <Pin className="w-4 h-4" />
                Pin
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-x-4">
                <Pencil className="w-4 h-4" />
                Rename
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-x-4 text-rose-600">
              <Trash className="w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
