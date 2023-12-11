'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { ClientUser } from '@/lib/auth';
import { createSlug, getImageSlug } from '@/lib/utils';
import { Bell } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface NavHeaderProps {
  user: ClientUser;
}

export const NavHeader = ({ user }: NavHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-5 py-2 h-full">
      <Icon src="/icons/menu.svg" className="w-6 h-6" />

      <div className="inline-flex items-center gap-x-[52px]">
        <span className="relative">
          <Bell className="w-6 h-6 text-[#757B82] -rotate-12" />
          <span
            className="flex items-center justify-center w-[10px] 
        h-[10px] text-[8px] bg-[#FA6A5E] text-[#757B82]
        absolute right-0 top-0 rounded-sm
        "
          >
            2
          </span>
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/avatars/01.png"
                  alt={user.profile.fullName!}
                />
                <AvatarFallback>
                  {getImageSlug(user.profile.fullName!)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.profile.fullName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-rose-600"
              onClick={() => {
                signOut({ callbackUrl: '/sign-in', redirect: true });
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
