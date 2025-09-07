import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDisclosure } from '@/hooks/useDisclosure';
import { LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export const UserMenu = () => {
  const { data: session } = useSession()

  const isUserMenuOpen = useDisclosure();
  const user = session?.user;

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DropdownMenu open={isUserMenuOpen.isOpen} onOpenChange={isUserMenuOpen.onToggle}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-700 transition-colors group">
          <Avatar className="h-8 w-8 ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all">
            <AvatarImage
              src={user?.image ?? ''}
              alt={user?.name ?? ''}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold text-sm">
              {getInitials(user?.name ?? 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-gray-50">
              {user?.name}
            </span>
            <span className="text-xs text-gray-200">
              {user?.email}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 bg-gray-700 border-gray-600 shadow-xl"
      >
        <DropdownMenuLabel className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-purple-500/30">
              <AvatarImage
                src={user?.image ?? ''}
                alt={user?.name ?? ''}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
                {getInitials(user?.name ?? 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-gray-50">
                {user?.name}
              </span>
              <span className="text-sm text-gray-200">
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-600" />

        <Link
          href="/profile"
        >
          <DropdownMenuItem className="cursor-pointer focus:bg-gray-600 hover:bg-gray-600 px-4 py-2">
            <User className="mr-3 h-4 w-4 text-blue-500" />
            <span className="text-gray-50">Meu Perfil</span>
          </DropdownMenuItem>
        </Link>

        {/* <DropdownMenuItem className="cursor-pointer focus:bg-gray-600 hover:bg-gray-600 px-4 py-2">
          <Crown className="mr-3 h-4 w-4 text-orange-500" />
          <span className="text-gray-50">Upgrade Pro</span>
        </DropdownMenuItem> */}

        <DropdownMenuSeparator className="bg-gray-600" />

        <DropdownMenuItem
          className="cursor-pointer focus:bg-red-500/10 hover:bg-red-500/10 px-4 py-2"
          onClick={() => {
            signOut({
              callbackUrl: '/',
            })
          }}
        >
          <LogOut className="mr-3 h-4 w-4 text-red-500" />
          <span className="text-red-500">Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};