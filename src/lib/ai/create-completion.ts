'use server'

import { DatabaseEdgeType, DatabaseTableNodeType } from '@/contexts/DatabaseDiagramContext';
import { mindbaseAI } from '@/lib/ai';
import { ApiResponse } from '@/lib/result';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

type CreateCompletionRequest = {
  content: string;
  messages: Array<ChatCompletionMessageParam>;
  shortSchemaText: string;
  databaseType?: 'MYSQL' | 'POSTGRESSQL'
}

type CreateCompletionResponse = {
  result: {
    nodes: DatabaseTableNodeType[],
    edges?: DatabaseEdgeType[]
  } | null;
  messages: Array<ChatCompletionMessageParam>;
}

export async function createCompletion({
  content,
  messages,
  shortSchemaText,
  databaseType = 'MYSQL'
}: CreateCompletionRequest): Promise<ApiResponse<CreateCompletionResponse>> {
  const mindbaseAi = await mindbaseAI();

  const META_PROMPT = `
  Você é um assistente especializado que gera diagramas JSON limpos representando estruturas de banco de dados exclusivamente para ${databaseType} usando "nodes" e "edges".
  
  Nodes:
  Cada node é uma tabela com:
  id (curto),type ("db"),position (x, y)
  data: tableName (string),fields: array de objetos com:
  id (sempre curto),name (string),type (string)
  isPrimaryKey,isForeignKey,isUnique (boolean)

  Edges:
  Cada edge conecta duas tabelas com:
  source,target (IDs dos nodes)
  sourceHandle,targetHandle: "top", "bottom", "left", "right"
  id (sempre curto),type: "default"
  
  Regras e Comportamento
  Retorne apenas um objeto JSON limpo com dois arrays: "nodes" e "edges".
  Não inclua explicações, comentários ou marcas de formatação.
  Use o schema atual para preservar quaisquer tabelas ou relacionamentos previamente definidos.
  Não remova nenhuma tabela criada anteriormente, a menos que o usuário solicite explicitamente.
  Quando o usuário descrever uma nova tabela, adicione-a ao esquema existente.
  Opcionalmente, infira relacionamentos entre as tabelas com base nos nomes dos campos e no contexto do esquema.
  Crie edges somente quando houver uma conexão lógica ou semântica.
  Mantenha um layout visual claro e organizado: cada node deve estar a pelo menos 500 unidades X e Y de distância dos outros e posicionado com base na relevância ou nos relacionamentos.
  Altere o X e Y apenas se houver necessidade, pois o usuário pode ter posicionado o node em algum local específico.
  Defina o nome das tabelas e colunas sempre no inglês para manter um padrão.
  Analise as outras tabelas e relações e altere e/ou adicione algo apenas se for necessário.
  
  Importante
  Trate o esquema como uma estrutura em crescimento que evolui com cada mensagem do usuário.
  Evite recriar tabelas existentes, a menos que elas precisem ser atualizadas.
  Toda solicitação do usuário será para alteração nas tabelas ou nos relacionamentos, então jamais altere a estrutura do node ou edge a pedido do usuário.
  Propriedades técnicos de nodes e edges (como "id" do node) não devem ser alterados com base em pedidos do usuário.
  Modificações solicitadas devem ser aplicadas aos campos das tabelas, não à estrutura técnica dos nodes ou edges.
  Estruture a saída com foco em desempenho e clareza.
  Use o schema atual para ter um histórico das tabelas.
  Sempre devolva o JSON completo para que seja usado em JSON.parse. Antes de retornar, valide se está correto.

    ${shortSchemaText ? `Schema atual: ${shortSchemaText}` : ''}
  `;

  try {
    const messagesToCreate: ChatCompletionMessageParam[] = [
      {
        role: "assistant",
        content: META_PROMPT,
        name: 'mindBase AI'
      },
      {
        role: "user",
        content,
      },
    ];

    const result = await mindbaseAi.ai.chat.completions.create({
      model: mindbaseAi.model,
      response_format: {
        type: 'json_object',
      },
      temperature: 1,
      messages: messagesToCreate,
    });

    const messageResult = (result.choices[0].message.content?.toString()) as string;

    messages = [
      ...messages,
      {
        role: "user",
        content,
      },
      {
        role: 'assistant',
        content: messageResult
      }
    ]

    return {
      data: {
        result: JSON.parse(messageResult),
        messages,
      },
      error: null,
    };
  } catch (error: any) {
    console.error(`Error on AI create completion: ${JSON.stringify(error, null, 2)}`);

    return {
      data: null,
      error: {
        type: "AiCreateCompletionError",
        message: "Error on AI create completion",
        error,
      },
    };
  }
}
