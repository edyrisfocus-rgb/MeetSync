import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import UserModel from '@/models/user';
import { redirect } from 'next/navigation';
import UsersClient from './UsersClient';

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user?.tenantId) redirect('/login');

  await connectDB();
  const users = await UserModel.find({ tenantId: session.user.tenantId }).sort({ createdAt: -1 }).lean();

  return (
    <UsersClient
      users={users.map(user => ({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        tenantId: user.tenantId,
        organizationName: user.organizationName,
        status: user.status,
        lastLogin: user.lastLogin?.toISOString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }))}
    />
  );
}
