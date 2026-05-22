import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from './db';
import UserModel from '@/models/user';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    // Dev-only credentials provider for easy role switching
    CredentialsProvider({
      id: 'dev-credentials',
      name: 'Dev Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (process.env.NODE_ENV !== 'development') return null;
        const roles = ['super_admin', 'admin', 'staff', 'member', 'viewer'];
        const role = credentials?.role as string;
        if (!roles.includes(role)) return null;
        return {
          id: `dev-${role}`,
          name: `Dev ${role.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`,
          email: credentials?.email as string || `dev-${role}@meetsync.local`,
          role,
          tenantId: 'dev-tenant',
          organizationName: 'MeetSync Demo Org',
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          const email = user.email || '';
          let dbUser = await UserModel.findOne({ email });
          if (!dbUser) {
            dbUser = await UserModel.create({
              name: user.name || email,
              email,
              image: user.image || undefined,
              role: 'member',
              tenantId: 'default',
              status: 'active',
            });
          }
          user.role = dbUser.role;
          user.tenantId = dbUser.tenantId;
          user.organizationName = dbUser.organizationName || 'MeetSync';
        } catch (err) {
          console.error('DB signIn error:', err);
          user.role = 'member';
          user.tenantId = 'default';
          user.organizationName = 'MeetSync';
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.organizationName = user.organizationName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = typeof token.role === 'string' ? token.role : undefined;
        session.user.tenantId = typeof token.tenantId === 'string' ? token.tenantId : undefined;
        session.user.organizationName = typeof token.organizationName === 'string' ? token.organizationName : undefined;
        session.user.id = token.sub || '';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
});
