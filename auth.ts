import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

const NESTJS_URL = process.env.NESTJS_URL || 'http://127.0.0.1:3900';

async function backendLogin(username: string, password: string) {
  const url = `${NESTJS_URL}/api/v1/auth/login`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(`[AUTH] POST ${url} → ${res.status}: ${body.slice(0, 200)}`);
    return null;
  }
  return res.json() as Promise<{ accessToken: string; refreshToken: string; userId: string }>;
}

async function backendGetUser(userId: string) {
  const url = `${NESTJS_URL}/api/v1/users/${userId}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`[AUTH] GET ${url} → ${res.status}`);
    return null;
  }
  return res.json();
}

async function backendFindUserByEmail(email: string) {
  const url = `${NESTJS_URL}/api/v1/users/all?search=${encodeURIComponent(email)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const result = await res.json() as { data: any[] };
  return result.data?.find((u: any) => u.email === email) || null;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.identity || !credentials?.password) return null;
        console.log(credentials);
        

        const authResult = await backendLogin(
          credentials.identity as string,
          credentials.password as string,
        );
        if (!authResult) return null;

        const userRecord = await backendGetUser(authResult.userId);
        if (userRecord) {
          return {
            id: userRecord.id,
            name: `${userRecord.first_name || ''} ${userRecord.last_name || ''}`.trim() || userRecord.email,
            email: userRecord.email,
            role: userRecord.role || 'FARMER',
            accessToken: authResult.accessToken,
            refreshToken: authResult.refreshToken,
            isComplete: true,
            provider: 'custom',
          };
        }

        return {
          id: authResult.userId,
          name: credentials.identity as string,
          email: credentials.identity as string,
          role: 'FARMER',
          accessToken: authResult.accessToken,
          refreshToken: authResult.refreshToken,
          isComplete: true,
          provider: 'custom',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      console.log([[token], [user], [account], [trigger], [session]]);
      
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      if (account && user) {
        if (account.provider === 'google' && !(user as any).accessToken) {
          const existing = await backendFindUserByEmail(user.email || '');
          if (existing) {
            return {
              ...token,
              id: existing.id,
              name: `${existing.first_name || ''} ${existing.last_name || ''}`.trim() || existing.email,
              email: existing.email,
              role: existing.role || 'FARMER',
              provider: 'google',
              isComplete: true,
            };
          }
          return {
            ...token,
            id: user.id,
            name: user.name,
            email: user.email,
            role: undefined,
            provider: 'google',
            isComplete: false,
          };
        }

        return {
          ...token,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          role: (user as any).role,
          provider: account.provider,
          isComplete: (user as any).isComplete ?? false,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string || (token as any).id as string;
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).refreshToken = token.refreshToken;
        (session.user as any).provider = token.provider;
        (session.user as any).isComplete = token.isComplete;
        (session as any).error = token.error;
      }
      return session;
    },
  },
});
