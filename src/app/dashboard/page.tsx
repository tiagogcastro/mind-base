'use server'
import { getServerSession } from '@/lib/auth';
import Chatbot from '@/modules/dashboard/Chatbot';
import { DatabaseDiagramProvider } from '@/modules/dashboard/contexts/DatabaseDiagramContext';
import { DatabaseDiagram } from '@/modules/dashboard/DatabaseDiagram';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/')
  }

  return (
    <DatabaseDiagramProvider>
      <div className='bg-gray-700 w-full flex flex-col items-center justify-center h-[calc(100vh-72px)]'>
        <DatabaseDiagram />

        <Chatbot />
      </div>
    </DatabaseDiagramProvider>
  );
}