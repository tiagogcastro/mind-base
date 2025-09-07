'use client'

import { useSession } from 'next-auth/react'
import { LoginButton } from './Auth/LoginButton'
import { UserMenu } from './Auth/UserMenu'
import { BoardSelectorWithCreate } from './Board/BoardSelectorWithCreate'
import { MindbaseLogo } from './MindbaseLogo'

export function Header() {
  const { status } = useSession()

  const isAuthenticated = status === 'authenticated';

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between bg-gray-800 border-b border-gray-600 shadow-lg backdrop-blur-sm">
      <MindbaseLogo />

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <BoardSelectorWithCreate />
            <UserMenu />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  )
}
