'use server'
import { getServerSession } from '@/lib/auth'
import { SigninAuth } from '@/modules/auth/signin'
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
