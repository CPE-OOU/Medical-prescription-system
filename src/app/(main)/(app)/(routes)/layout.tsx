import { getCurrentUser } from '@/lib/auth';
import { LayoutSideBar } from '../__components/sidebar';
import { redirect } from 'next/navigation';
import { NavHeader } from '../__components/header';

export default async function MainLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) return redirect('/sign-in');

  return (
    <div className="grid w-full grid-areas-layout grid-cols-layout grid-rows-layout">
      <div className="grid-in-header">
        <NavHeader user={user} />
      </div>
      <div className="grid-in-sidebar h-full">
        <div className="h-screen">
          <LayoutSideBar />
        </div>
      </div>

      <main className="grid-in-main bg-[#f5f5f5]">{children}</main>
    </div>
  );
}
