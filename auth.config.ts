import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }: { auth: any; request: { nextUrl: URL } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as any)?.role;
      const isComplete = (auth?.user as any)?.isComplete;
      
      const isOnFarmer = nextUrl.pathname.startsWith('/farmer');
      const isOnAgent = nextUrl.pathname.startsWith('/agent');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnAuth = nextUrl.pathname.startsWith('/auth');

      if (isOnFarmer || isOnAgent || isOnAdmin) {
        if (!isLoggedIn) return false;
        if (!userRole) return false;

        if (!isComplete && !isOnAuth) {
          return Response.redirect(new URL('/auth/register', nextUrl));
        }

        if (isOnFarmer && userRole !== 'FARMER') {
          const target = userRole === 'ADMIN' ? '/admin' : '/agent';
          return Response.redirect(new URL(target, nextUrl));
        }
        if (isOnAgent && userRole !== 'AGENT') {
          const target = userRole === 'ADMIN' ? '/admin' : '/farmer';
          return Response.redirect(new URL(target, nextUrl));
        }
        if (isOnAdmin && userRole !== 'ADMIN') {
          const target = userRole === 'AGENT' ? '/agent' : '/farmer';
          return Response.redirect(new URL(target, nextUrl));
        }

        return true;
      } else if (isLoggedIn && isOnAuth) {
        if (!isComplete && nextUrl.pathname === '/auth/register') return true;

        if (userRole && isComplete) {
          const dashboardPath = userRole === 'ADMIN' ? '/admin' : 
                                userRole === 'AGENT' ? '/agent' : '/farmer';
          return Response.redirect(new URL(dashboardPath, nextUrl));
        }
      }
      
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
