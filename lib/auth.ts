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
          let dbUser = await UserModel.findOne({ email: user.email });
          if (!dbUser) {
            dbUser = await UserModel.create({
              name: user.name,
              email: user.email,
              image: user.image,
              role: 'member',
              tenantId: 'default',
              status: 'active',
            });
          }
          (user as any).role = dbUser.role;
          (user as any).tenantId = dbUser.tenantId;
          (user as any).organizationName = dbUser.organizationName || 'MeetSync';
        } catch (err) {
          console.error('DB signIn error:', err);
          // Allow login even if DB is unreachable
          (user as any).role = 'member';
          (user as any).tenantId = 'default';
          (user as any).organizationName = 'MeetSync';
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.tenantId = (user as any).tenantId;
        token.organizationName = (user as any).organizationName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).tenantId = token.tenantId;
        (session.user as any).organizationName = token.organizationName;
        (session.user as any).id = token.sub;
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
