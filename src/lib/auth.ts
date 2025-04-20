import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession as getNextAuthServerSession } from 'next-auth/next'

export function getServerSession() {
  return getNextAuthServerSession(authOptions)
}