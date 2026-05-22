import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const user = session.user as any;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        userRole={user.role}
        userName={user.name || 'User'}
        userEmail={user.email || ''}
        userImage={user.image}
        orgName={user.organizationName || 'MeetSync'}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
