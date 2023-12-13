'use client';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { NotificationToaster } from './toast';

interface ProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

export const Provider: React.FC<ProviderProps> = ({ children, session }) => {
  return (
    <>
      <SessionProvider session={session}>
        <NotificationToaster />
        {children}
      </SessionProvider>
    </>
  );
};
