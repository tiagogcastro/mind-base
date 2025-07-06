'use server';
import { mindbaseAI } from '@/lib/ai';
import { convertDbmlToNodesAndEdges } from '@/lib/dbml';
import { redis } from '@/lib/redis';
import { ChatCompletionMessageParam } from 'openai/resources';

async function getDbml(boardId: string): Promise<string | null> {
  if (!redis.isOpen) {
    await redis.connect();
  }

  return await redis.get(`board:${boardId}:dbml`);
}

async function setDbml(boardId: string, dbml: string): Promise<void> {
  if (!redis.isOpen) {
    await redis.connect();
  }

  await redis.set(`board:${boardId}:dbml`, dbml);
}

async function generateDbmlFromPrompt(userPrompt: string, boardId?: string) {
  const mindbase = await mindbaseAI();

  const currentSchema = await getDbml(boardId ?? '');

  const systemPrompt = `
Você é um assistente que gera apenas código DBML para representar estruturas de banco de dados.

Regras:
- Retorne somente o código DBML válido. Sem explicações.
- Use nomes de tabelas e colunas em inglês.
- Inclua relacionamentos entre tabelas usando [ref: > other_table.column].
- Garanta que cada relacionamento seja bidirecional e correto no DBML.
- DBML precisa estar 100% correto para ser usado com a lib @dbml/core.
- Suporte apenas tipos básicos como int, varchar, text, boolean, datetime.
- Ousuário solicitou uma tabela de usuários e posts, então deve entender e gerar relacionamentos entre elas.
- Se o usuário não especificar relacionamentos, crie relacionamentos comuns entre tabelas.
- Se o usuário não especificar tipos de dados, use os tipos mais comuns (int, varchar, text, boolean, datetime).
- Se o usuário não especificar chaves primárias ou estrangeiras, use as convenções comuns:
  - A primeira coluna é a chave primária (id).

Exemplos mínimos:
Table users {
  id int [pk, increment]
  name varchar
}
Table posts {
  id int [pk, increment]
  user_id int [ref: > users.id]
  title varchar
}
  ${currentSchema && `Schema atual: ${currentSchema}`}
  `.trim();

  try {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const completion = await mindbase.ai.chat.completions.create({
      model: mindbase.model,
      messages,
      response_format: {
        type: 'text'
      },
      temperature: 0.7,
    });

    console.log(completion.usage)

    const dbmlText = completion.choices[0].message.content?.trim() || '';

    return {
      data: {
        dbmlText
      },
      error: null,
    };
  } catch (error) {
    console.error('Erro ao gerar DBML:', error);
    return {
      data: null,
      error: {
        type: 'GenerateDbmlError',
        message: 'Erro ao gerar DBML a partir do prompt',
      }
    }
  }
}

export async function handleUserPrompt({ prompt, boardId }: { prompt: string, boardId: string }) {
  try {
    const generateDbmlFromPromptResult = await generateDbmlFromPrompt(prompt, boardId);

    if (generateDbmlFromPromptResult.error) {
      return generateDbmlFromPromptResult;
    }

    const dbmlResult = generateDbmlFromPromptResult.data.dbmlText;

    const schema = convertDbmlToNodesAndEdges(dbmlResult);

    await setDbml(boardId, dbmlResult);

    return {
      data: {
        schema,
      },
      error: null,
    };
  } catch (err) {
    console.error('Erro ao gerar DBML:', err);

    return {
      data: null,
      error: {
        type: 'HandleUserPromptError',
        message: 'Erro ao processar o prompt do usuário',
      }
    };
  }
}
