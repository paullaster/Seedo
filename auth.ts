import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { apiService } from '@/app/lib/api-service';

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
        if (!credentials?.identity || !credentials?.code) return null;
        
        // Custom OTP flow: Identity + OTP Code
        const isValid = await apiService.verifyOTP(credentials.identity as string, credentials.code as string);
        
        if (isValid) {
          // In a real app, this calls the backend to get tokens and user
          const response = await apiService.login(credentials.identity as string, undefined, 'custom');
          return {
            ...response.user,
            ...response.tokens,
          } as any;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          expiresAt: (user as any).expiresAt,
          role: (user as any).role,
          provider: account.provider,
          isComplete: (user as any).isComplete ?? false,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      // If the access token has expired, try to update it
      try {
        console.log("Refreshing access token...");
        const response = await apiService.refreshToken(token.refreshToken as string);
        return {
          ...token,
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken ?? token.refreshToken,
          expiresAt: response.tokens.expiresAt,
        };
      } catch (error) {
        console.error("Error refreshing access token", error);
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).provider = token.provider;
        (session.user as any).isComplete = token.isComplete;
        (session as any).error = token.error;
      }
      return session;
    },
  },
});
