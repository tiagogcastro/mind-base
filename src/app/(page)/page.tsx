import { SigninAuth } from '@/app/(page)/components/auth/signin'
import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div>
      <SigninAuth />
    </div>
  )
}
