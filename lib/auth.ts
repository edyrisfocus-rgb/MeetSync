import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from './db';
import UserModel from '@/models/user';
import TenantModel from '@/models/tenant';
import LogModel from '@/models/log';

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      checks: ['state'],
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
        await connectDB();
        const email = user.email?.toLowerCase();
        if (!email) return false;

        const domain = email.split('@')[1] || 'personal';
        const slug = domain.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'personal';
        const organizationName = domain === 'gmail.com' ? user.name || email : domain.split('.')[0].replace(/\b\w/g, (c) => c.toUpperCase());
        const tenant = await TenantModel.findOneAndUpdate(
          { slug },
          { $setOnInsert: { name: organizationName, slug, domain } },
          { new: true, upsert: true }
        );

        let dbUser = await UserModel.findOne({ email });
        if (!dbUser) {
          const userCount = await UserModel.countDocuments({ tenantId: tenant._id.toString() });
          dbUser = await UserModel.create({
            name: user.name || email,
            email,
            image: user.image || undefined,
            role: userCount === 0 ? 'admin' : 'member',
            tenantId: tenant._id.toString(),
            organizationName: tenant.name,
            status: 'active',
            lastLogin: new Date(),
          });
        } else {
          dbUser.name = user.name || dbUser.name;
          dbUser.image = user.image || dbUser.image;
          dbUser.tenantId = dbUser.tenantId || tenant._id.toString();
          dbUser.organizationName = dbUser.organizationName || tenant.name;
          dbUser.lastLogin = new Date();
          await dbUser.save();
        }

        if (dbUser.status !== 'active') return false;

        await LogModel.create({
          userId: dbUser._id.toString(),
          userName: dbUser.name,
          userEmail: dbUser.email,
          tenantId: dbUser.tenantId,
          action: 'login',
          resource: 'authentication',
          details: 'Google login',
          status: 'success',
        });

        user.role = dbUser.role;
        user.tenantId = dbUser.tenantId;
        user.organizationName = dbUser.organizationName || tenant.name;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.organizationName = user.organizationName;
      }

      if (!token.tenantId && token.email) {
        await connectDB();
        const dbUser = await UserModel.findOne({ email: token.email.toLowerCase() }).lean();
        if (dbUser) {
          token.role = dbUser.role;
          token.tenantId = dbUser.tenantId;
          token.organizationName = dbUser.organizationName;
        }
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
