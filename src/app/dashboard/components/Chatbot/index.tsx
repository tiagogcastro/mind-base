'use client';
import { handleGenerateDbml } from '@/app/actions/generateDbml';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useBoardStore } from '@/store/BoardStore';
import { DatabaseSchema, useNodeAndEdgeStore } from '@/store/DatabaseDiagramStore';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FiArrowUp } from 'react-icons/fi';

type FormValues = {
  content: string;
  boardId: string;
};

export default function Chatbot() {
  const { selectedBoard } = useBoardStore();
  const { setDatabaseSchema } = useNodeAndEdgeStore();

  const { register, handleSubmit, setValue, formState } = useForm<FormValues>({
    defaultValues: {
      content: '',
      boardId: selectedBoard?.id ?? ''
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (selectedBoard?.id) {
      setValue('boardId', selectedBoard.id);
    }
  }, [selectedBoard, setValue]);

  const isLoading = useDisclosure();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      isLoading.onOpen();

      const prompt = data.content;
      const boardId = data.boardId;

      const result = await handleGenerateDbml({ prompt, boardId });

      setDatabaseSchema(result.data?.schema as DatabaseSchema);
    } catch (error: any) {
      console.error('Erro ao enviar o prompt:', error);
    } finally {
      isLoading.onClose();
    }
  };

  return (
    <form
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl rounded-xl p-2 bg-gray-700 border border-gray-600"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-end p-2 gap-2">
        <Textarea
          {...register('content', { required: true, minLength: 1 })}
          placeholder="Digite sua mensagem..."
          className="rounded-lg flex-1 p-2 border-none outline-0 resize-y text-gray-100 placeholder:text-gray-100 max-h-32 min-h-12"
          aria-invalid={!!formState.errors.content}
          disabled={isLoading.isOpen || !!formState.errors.content}
        />
        <Button
          type="submit"
          className="bg-white text-gray-800 p-2 text-lg rounded-full"
          disabled={!formState.isValid || isLoading.isOpen}
          aria-disabled={!formState.isValid}
        >
          <FiArrowUp />
        </Button>
      </div>
    </form>
  );
}
