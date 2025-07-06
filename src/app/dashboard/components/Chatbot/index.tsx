'use client'
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDatabaseDiagramContext } from '@/contexts/DatabaseDiagramContext';
import { handleUserPrompt } from '@/lib/ai/create-completion';
import { useForm } from 'react-hook-form';
import { FiArrowUp } from 'react-icons/fi';

export default function Chatbot() {
  const {
    register,
    getValues,
    handleSubmit,
    reset,
  } = useForm<{
    content: string;
  }>();

  const { setNodes, setEdges } = useDatabaseDiagramContext()

  async function handleCreateCompletion() {
    const content = getValues('content');

    const result = await handleUserPrompt({
      boardId: 'board-1-id-usuario',
      prompt: content,
    });

    if (result.error) {
      console.error('Erro ao gerar DBML:', result.error);
      return;
    }

    setNodes(result.data.schema.nodes as any)
    setEdges(result.data.schema.edges)

    reset();
  }

  return (
    <form
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl rounded-xl p-2 bg-gray-700 border border-gray-600"
      onSubmit={handleSubmit(handleCreateCompletion)}
    >
      <div className="flex items-end p-2 gap-2">
        <Textarea
          {...register('content')}
          placeholder="Digite sua mensagem..."
          className="rounded-lg flex-1 p-2 border-none outline-0 resize-y text-gray-100 placeholder:text-gray-100 max-h-32 min-h-12"
        />
        <Button
          type="submit"
          className="bg-white text-gray-800 p-2 text-lg rounded-full"
        >
          <FiArrowUp />
        </Button>
      </div>
    </form>
  )
}
