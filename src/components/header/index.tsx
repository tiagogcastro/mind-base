'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signIn, signOut, useSession } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="w-full px-6 py-5 flex items-center justify-between bg-gray-900">
      <span className="text-xl font-semibold">MeuApp</span>

      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={session.user?.image || ''} />
              <AvatarFallback>{session.user?.name?.[0] ?? 'U'}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-gray-900">
            <DropdownMenuLabel>
              {session.user?.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
            >
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem
            >
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({
                callbackUrl: '/',
              })}
              className='cursor-pointer'
            >
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          className="max-w-max px-4"
          onClick={() => signIn('google')}
        >
          <FcGoogle />
          Entrar com Google
        </Button>
      )}
    </header>
  )
}
