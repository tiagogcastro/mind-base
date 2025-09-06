import Chatbot from '@/app/dashboard/components/Chatbot';
import { DatabaseDiagram } from '@/app/dashboard/components/DatabaseDiagram';
import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/')
  }

  return (
    <div className='bg-gray-700 w-full flex flex-col items-center justify-center h-[calc(100vh-72px)]'>
      <DatabaseDiagram />

      <Chatbot />
    </div>
  );
}