import { NextAuthOptions } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { eq } from 'drizzle-orm';
import { parsedEnv } from '@/config/env';
import { users } from '@/db/schema';
import { db } from '@/db/init';
import { verifyPassword } from '@/lib/auth';

export const nextAuthOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: parsedEnv.GOOGLE_CLIENT_ID,
      clientSecret: parsedEnv.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { type: 'email', label: 'email' },
        type: { type: 'text', label: 'type' },
        password: { type: 'password', label: 'password' },
      },

      async authorize(credentials) {
        if (!(credentials?.email && credentials.password)) {
          throw new Error(
            'Missing login credential email or password field missing'
          );
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials!.email));

        if (!(await verifyPassword(user, credentials.password))) {
          throw Error('User credential not a match. Check email or password');
        }

        return {
          id: user.id,
          email: user.email,
          verified: !!user.emailVerified,
        };
      },
    }),
  ],

  callbacks: {
    async jwt(params) {
      if (params.user) {
        params.token.user = {
          id: params.user.id,
          email: params.user.email,
        };
      }

      return params.token;
    },

    async session({ session, token }) {
      if (token?.user) {
        // Note that this if condition is needed
        session.user = token.user;
      }
      return session;
    },
  },

  session: { maxAge: 60 * 60 * 24 * 30, strategy: 'jwt' },
  debug: process.env.NODE_ENV === 'development',
  secret: parsedEnv.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-out',
  },
};
