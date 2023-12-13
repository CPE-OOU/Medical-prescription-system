'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useLayoutEffect, useState } from 'react';
import { LoginDetailsSettings } from './login-detail-settings';
import { ClientUser } from '@/lib/auth';
import { MyProfileSettings } from './my-profile-settings';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

const tabs = ['my-profile', 'login-details'] as const;
type Tabs = (typeof tabs)[number];

interface SettingActionProps {
  user: ClientUser;
}

export const SettingActions: React.FC<SettingActionProps> = ({ user }) => {
  const params = Object.fromEntries(useSearchParams()) as { tab?: Tabs };

  const [currentTab, setCurrentTab] = useState<Tabs>(
    params.tab ?? 'my-profile'
  );
  const pathname = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    if (tabs.includes(currentTab)) {
      const nextParams = new URLSearchParams(params);
      nextParams.set('tab', currentTab);
      router.push(`${pathname}?${nextParams}`);
    }
  }, [currentTab]);

  useLayoutEffect(() => {
    if (params.tab && tabs.includes(params.tab)) {
      setCurrentTab(params.tab);
    }
  }, [params.tab]);

  return (
    <div className="w-full  pt-8">
      <Tabs
        onValueChange={(value) => {
          if (tabs.includes(value as Tabs)) {
            setCurrentTab(value as Tabs);
          }
        }}
        defaultValue={currentTab}
        className="p-0"
      >
        <TabsList className="flex bg-transparent shadow-separator p-0 w-full justify-start gap-x-10 capitalize rounded-none">
          <TabsTrigger
            value="my-profile"
            className="ml-0 p-0 flex flex-col gap-y-2  !bg-transparent !shadow-none"
          >
            <span>My Profile</span>
            <span
              className={cn(
                'h-1 bg-primary-brand inline-block w-full translate-y-1 rounded-tl-sm rounded-tr-sm opacity-0',
                currentTab === 'my-profile' && 'opacity-100'
              )}
            ></span>
          </TabsTrigger>
          <TabsTrigger
            value="login-details"
            className="ml-0 p-0 flex flex-col gap-y-2 !bg-transparent !shadown-none"
          >
            <span>Login Details</span>
            <span
              className={cn(
                'h-1 bg-primary-brand inline-block w-full translate-y-1 rounded-tl-sm rounded-tr-sm opacity-0',
                currentTab === 'login-details' && 'opacity-100'
              )}
            ></span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-profile">
          <MyProfileSettings user={user} />
        </TabsContent>
        <TabsContent value="login-details">
          <LoginDetailsSettings user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
