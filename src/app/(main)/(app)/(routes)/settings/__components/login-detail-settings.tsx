'use client';

import { ClientUser } from '@/lib/auth';
import { UpdateEmail } from './update-email';
import { UpdatePasword } from './update-password';
import { Button } from '@/components/ui/button';
import { BadgeInfo } from 'lucide-react';

interface LoginDetailsSettings {
  user: ClientUser;
}
export const LoginDetailsSettings: React.FC<LoginDetailsSettings> = ({
  user,
}) => {
  return (
    <div className="w-full">
      <div className="shadow-separator py-6">
        <div className="space-y-1">
          <h6 className="text-neutral-100 font-semibold font-epilogue text-lg ">
            Basic Information
          </h6>
          <p className="text-neutral-60 font-epilogue font-normal  text-base">
            This is login information that you can update anytime.
          </p>
        </div>
      </div>
      <UpdateEmail user={user} />
      <UpdatePasword user={user} />
      <div className="pt-6 pb-12">
        <Button
          variant="link"
          className="ml-auto flex items-center gap-x-2 hover:no-underline hover:text-rose-600 text-rose-500 font-semibold text-base"
        >
          Close Account <BadgeInfo className="-translate-y-1" />
        </Button>
      </div>
    </div>
  );
};
