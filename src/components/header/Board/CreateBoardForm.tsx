'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDisclosure, UseDisclosureReturn } from '@/hooks/useDisclosure';
import { useBoardStore } from '@/store/BoardStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const boardSchema = z.object({
  newBoard: z.object({
    description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').optional(),
    name: z
      .string()
      .min(3, 'Nome deve ter pelo menos 3 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres'),
  }),
  userId: z.string().min(1, 'Usuário é obrigatório'),
});

type BoardFormData = z.infer<typeof boardSchema>;

interface BoardFormProps {
  isCreateModalOpen: UseDisclosureReturn;
  handleBoardSelect: (boardId: string) => void
}

export const CreateBoardForm = ({
  isCreateModalOpen,
  handleBoardSelect,
}: BoardFormProps) => {
  const { data: session } = useSession();

  const { addBoard } = useBoardStore();

  const isCreateBoardLoading = useDisclosure();

  const form = useForm<BoardFormData>({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      newBoard: {
        name: '',
        description: '',
      },
      userId: session?.user?.email ?? '',
    },
  });

  const handleCreateBoard = async (data: BoardFormData) => {
    try {
      const newBoard = await addBoard(data);

      form.reset();

      handleBoardSelect(newBoard.id);

      toast('Board criado com sucesso!', {
        description: `O board "${newBoard.name}" foi criado e selecionado.`,
      });
    } catch (error) {
      toast('Erro ao criar board', {
        description: 'Ocorreu um erro inesperado. Tente novamente.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateBoard)} className="space-y-6">
        <FormField
          control={form.control}
          name="newBoard.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-50">Nome do Board</FormLabel>
              <FormControl>
                <Input
                  placeholder="Digite o nome do board..."
                  className="bg-gray-900 border-gray-600 text-gray-50 focus:ring-purple-500 focus:border-purple-500"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newBoard.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-50">Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o propósito do board..."
                  className="bg-gray-900 border-gray-600 text-gray-50 focus:ring-purple-500 focus:border-purple-500 resize-none h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={isCreateModalOpen.onClose}
            disabled={isCreateBoardLoading.isOpen}
            className="px-4 border-gray-100 text-gray-100 hover:bg-gray-600"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isCreateBoardLoading.isOpen}
            className="bg-gradient-to-r px-4 from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
          >
            {isCreateBoardLoading.isOpen && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar Board
          </Button>
        </div>
      </form>
    </Form>
  );
};