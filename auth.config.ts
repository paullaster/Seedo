import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log("[AUTH]", auth);
      const isLoggedIn = !!auth?.user;
      const isComplete = (auth?.user as any)?.isComplete;
      const isOnDashboard = nextUrl.pathname.startsWith('/farmer') ||
        nextUrl.pathname.startsWith('/agent') ||
        nextUrl.pathname.startsWith('/admin');
      const isOnRegister = nextUrl.pathname === '/auth/register';

      if (isOnDashboard) {
        if (!isLoggedIn) return false;
        if (!isComplete) return Response.redirect(new URL('/auth/register', nextUrl));
        return true;
      }

      if (isLoggedIn && nextUrl.pathname.startsWith('/auth')) {
        if (isOnRegister && !isComplete) return true;
        return Response.redirect(new URL('/farmer', nextUrl));
      }

      return true;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
