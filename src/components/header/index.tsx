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
import { Board, useBoardStore } from "@/store/BoardStore"
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'

export function Header() {
  const { data: session, status } = useSession()
  const { boards, selectedBoard, selectBoard } = useBoardStore()
  const router = useRouter()

  const handleBoardSelect = (board: Board) => {
    selectBoard(board)
    router.push(`/dashboard/${board.id}`)
  }

  return (
    <header className="w-full px-6 py-5 flex items-center justify-between bg-gray-800">
      <span className="text-xl font-bold text-gray-100 tracking-wider">
        mindBase
      </span>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              {selectedBoard ? selectedBoard.name : "Selecione um board"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-gray-700 border-gray-600 text-gray-100">
            {boards.map((board) => (
              <DropdownMenuItem
                key={board.id}
                onClick={() => handleBoardSelect(board)}
                className={selectedBoard?.id === board.id ? "bg-gray-600" : ""}
              >
                {board.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={session.user?.image || ''} />
                <AvatarFallback>{session.user?.name?.[0] ?? 'U'}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-gray-700 border-gray-600 text-gray-100">
              <DropdownMenuLabel>
                {session.user?.name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
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
            className="max-w-max px-4 text-gray-100"
            disabled={status === 'loading'}
            onClick={() => signIn('google')}
          >
            <FcGoogle />
            Entrar com Google
          </Button>
        )}
      </div>
    </header>
  )
}
