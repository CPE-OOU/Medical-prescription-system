import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();

  if (user) {
    return redirect('/');
  }

  return (
    <div className="w-full h-screen bg-[#F5F5F5] grid place-content-center">
      <div className="w-[632px] bg-white rounded-[10px]">{children}</div>
    </div>
  );
};

export default AuthLayout;
