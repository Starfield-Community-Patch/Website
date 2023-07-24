import NextAuth, { NextAuthOptions } from 'next-auth';
import OAuthProviders from '@/util/auth/oauth'

const handler = NextAuth(OAuthProviders);
export { handler as GET, handler as POST };