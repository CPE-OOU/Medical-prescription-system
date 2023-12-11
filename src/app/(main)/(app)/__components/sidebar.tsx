'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreVertical,
  Pencil,
  Pill,
  Pin,
  Plus,
  Settings,
  Trash,
} from 'lucide-react';
import Image from 'next/image';
import { useLayoutStore } from '../__state/layout';
import { ChatItem } from './chat-item';

export const LayoutSideBar = () => {
  const sidebarCollapse = useLayoutStore(
    ({ sidebarCollapse }) => sidebarCollapse
  );

  if (sidebarCollapse) {
    return (
      <div className="pl-4 pr-6 space-y-6 w-full pt-[18px]">
        <div className="relative w-9 h-9 ml-[6px] ">
          <Image src="/icons/logo.svg" fill alt="logo" />
        </div>
        <Button
          className="white bg-primary px-3 py-2 w-full items-center text-white btn-1"
          size="icon"
        >
          <Plus className="w-6 h-6 mr-[10px]" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between pl-4 pr-6 h-full pb-10">
      <div className="space-y-6 max-w-[240px] w-full pt-[18px] ">
        <div className="relative w-9 h-9 ml-[6px] ">
          <Image src="/icons/logo.svg" fill alt="logo" />
        </div>
        <Button className="white bg-primary px-3 py-2 w-full items-center text-white btn-1">
          <Plus className="w-6 h-6 mr-[10px]" />
          New Chat
        </Button>

        <div>
          <p className="body-7 mb-3">Recents</p>
          <div className="space-y-3">
            <ChatItem />
          </div>
        </div>
      </div>
      <div>
        <h5 className="text-[#757B82] flex items-center gap-x-[10px] font-normal">
          <Settings className="w-[18px] h-[18px] " />
          Settings
        </h5>
      </div>
    </div>
  );
};
