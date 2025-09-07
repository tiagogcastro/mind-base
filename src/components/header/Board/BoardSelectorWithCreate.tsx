'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDisclosure } from '@/hooks/useDisclosure';
import { cn } from '@/lib/utils';
import { useBoardStore } from '@/store/BoardStore';
import { ChevronDown, FolderOpen, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CreateBoardForm } from './CreateBoardForm';

interface BoardSelectorWithCreateProps {
}

export const BoardSelectorWithCreate = ({ }: BoardSelectorWithCreateProps) => {
  const router = useRouter()

  const { boards, selectedBoard, selectBoardById } = useBoardStore();

  const isDropdownOpen = useDisclosure();
  const isCreateModalOpen = useDisclosure();

  const handleBoardSelect = (boardId: string) => {
    selectBoardById(boardId);

    isCreateModalOpen.onClose();
    isDropdownOpen.onClose();

    router.push(`/dashboard/${boardId}`)
  };

  const handleOpenCreateModal = () => {
    isCreateModalOpen.onOpen();
    isDropdownOpen.onClose();
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen.isOpen} onOpenChange={isDropdownOpen.onToggle}>
        <DropdownMenuTrigger asChild>
          <Button
            className="w-64 justify-between bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-50 px-4"
          >
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-purple-500" />
              <span className="truncate">
                {selectedBoard ? selectedBoard.name : "Selecione um board"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-200" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-64 bg-gray-700 border-gray-600 shadow-lg"
        >
          {boards.map((board) => (
            <DropdownMenuItem
              key={board.id}
              onClick={() => handleBoardSelect(board.id)}
              className={cn(
                `cursor-pointer py-2 focus:bg-gray-600 hover:bg-gray-600`,
                {
                  'bg-gray-600': selectedBoard?.id === board.id
                }
              )}
            >
              <div className="flex flex-col items-start w-full">
                <span className="font-medium text-gray-50">{board.name}</span>
                {board?.description && (
                  <span className="text-xs text-gray-200 truncate max-w-full">
                    {board.description}
                  </span>
                )}
              </div>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator className="bg-gray-600" />

          <DropdownMenuItem
            onClick={handleOpenCreateModal}
            className="cursor-pointer focus:bg-gray-600 hover:bg-gray-600"
          >
            <div className="flex items-center gap-2 w-full">
              <Plus className="h-4 w-4 text-purple-500" />
              <span className="font-medium text-gray-50">Criar novo board</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isCreateModalOpen.isOpen && (
        <Dialog open={isCreateModalOpen.isOpen} onOpenChange={isCreateModalOpen.onToggle}>
          <DialogContent className="sm:max-w-md bg-gray-800 border-gray-600">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-50">
                Criar Novo Board
              </DialogTitle>
            </DialogHeader>

            <CreateBoardForm
              handleBoardSelect={handleBoardSelect}
              isCreateModalOpen={isCreateModalOpen}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};