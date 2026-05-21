import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

export const proxy = auth(async function proxy(req: NextRequest) {})

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\.png$).*)'],
};
