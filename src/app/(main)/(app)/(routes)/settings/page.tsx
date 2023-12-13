import { SettingActions } from './__components/setting-actions';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SeekerTabHeader } from './__components/seeker-tab-header';

export const dynamic = 'force-dynamic';
export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return redirect('/sign-in');

  return (
    <div className="w-full h-full">
      <SeekerTabHeader title="Settings" />
      <div className="px-8">
        <SettingActions user={user} />
      </div>
    </div>
  );
}
