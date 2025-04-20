import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/')
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard page!</p>
    </div>
  );
}