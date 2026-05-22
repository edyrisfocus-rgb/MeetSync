import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import LogModel from '@/models/log';
import { redirect } from 'next/navigation';
import LogsClient from './LogsClient';

export default async function LogsPage() {
  const session = await auth();
  if (!session?.user?.tenantId) redirect('/login');

  await connectDB();
  const logs = await LogModel.find({ tenantId: session.user.tenantId }).sort({ createdAt: -1 }).limit(100).lean();

  return (
    <LogsClient
      logs={logs.map(log => ({
        _id: log._id.toString(),
        userId: log.userId,
        userName: log.userName,
        userEmail: log.userEmail,
        tenantId: log.tenantId,
        action: log.action,
        resource: log.resource,
        resourceId: log.resourceId,
        details: log.details,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        status: log.status,
        createdAt: log.createdAt.toISOString(),
      }))}
    />
  );
}
