'use client';
import { QueryProvider } from './query';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ModalProvider } from './modal-provider';
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
