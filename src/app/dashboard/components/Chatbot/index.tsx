'use client'
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DatabaseEdgeType, DatabaseTableNodeType, useDatabaseDiagramContext } from '@/contexts/DatabaseDiagramContext';
import { createCompletion } from '@/lib/ai/create-completion';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { useState } from 'react';
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

  const { setNodes, setEdges, nodes, edges } = useDatabaseDiagramContext()

  const [messages, setMessages] = useState<Array<ChatCompletionMessageParam>>([]);

  function generateShortSchemaText(
    nodes: DatabaseTableNodeType[],
    edges?: DatabaseEdgeType[]
  ): string {
    const tablesText = nodes.map((node) => {
      const fields = node.data.fields.map((f) => {
        const tags = [];
        if (f.isPrimaryKey) tags.push("PK");
        if (f.isForeignKey) tags.push("FK");
        if (f.isUnique) tags.push("UQ");

        const tag = tags.length ? `(${tags.join(",")})` : "";

        return `${f.name}:${f.type}${tag}`;
      }).join(",");

      return `${node.data.tableName}[${fields}](x:${node.position.x}|y:${node.position.y})`;
    }).join(";");

    const relationshipsText = edges?.length
      ? ";R=" + edges.map(e => `${e.source}.${e.sourceHandle}-${e.target}.${e.targetHandle}`).join(",")
      : "";

    return tablesText + relationshipsText;
  }

  async function handleCreateCompletion() {
    const content = getValues('content');

    const shortSchemaText = generateShortSchemaText(nodes, edges);

    const result = await createCompletion({
      content,
      messages,
      shortSchemaText,
      databaseType: 'MYSQL'
    });

    if (result.error) {
      console.log(result)
      return;
    }

    setMessages(result.data?.messages ?? [])

    setNodes((result.data?.result as any).nodes)
    setEdges((result.data?.result as any).edges)

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
