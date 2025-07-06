'use server';
import { mindbaseAI } from '@/lib/ai';
import { convertDbmlToNodesAndEdges } from '@/lib/dbml';
import { ChatCompletionMessageParam } from 'openai/resources';

async function generateDbmlFromPrompt(userPrompt: string) {
  const mindbase = await mindbaseAI();

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
    const generateDbmlFromPromptResult = await generateDbmlFromPrompt(prompt);

    if (generateDbmlFromPromptResult.error) {
      return generateDbmlFromPromptResult;
    }

    const schema = convertDbmlToNodesAndEdges(generateDbmlFromPromptResult.data.dbmlText);

    // TODO
    // salvar DBML ou schema no Redis (opcional)
    // await redis.set(boardId, JSON.stringify(schema));

    return {
      data: {
        dbml: generateDbmlFromPromptResult.data.dbmlText,
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
