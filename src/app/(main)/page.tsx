import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const user = await getCurrentUser();
  if (!user) return redirect('/sign-in');

  return redirect('/chat');
}
