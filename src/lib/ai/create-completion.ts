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
  const currentSchema = await getDbml(boardId ?? '') || '';

  const systemPrompt = `
Você é um assistente especializado que gera apenas código DBML válido, completo e consistente. Seu trabalho é criar ou modificar um esquema DBML com base no prompt do usuário, garantindo a integridade e a ausência de erros.

## Objetivo da IA
1.  **Entender a intenção do usuário**: Analise o pedido do usuário, incluindo solicitações genéricas (ex: "gerenciamento de colaboradores").
2.  **Manter o Schema Existente**: Sempre use o esquema atual fornecido como base.
3.  **Gerar DBML Consistente**: Aplique apenas as alterações necessárias, preservando o resto.
    - Crie tabelas/colunas/relacionamentos solicitados ou inferidos.
    - Atualize ou delete **apenas se o usuário for explícito**.
4.  **Garantir a Integridade Total**:
    - **Nenhuma perda de dados**: Não remova tabelas, colunas ou relacionamentos existentes sem um pedido explícito.
    - **Relacionamentos válidos**: Todos os relacionamentos devem apontar para tabelas e colunas que existem no esquema final.
    - **Sem duplicação ou nomes nulos**: Não gere nomes de tabelas ou colunas que sejam duplicados ou nulos.

## Regras
-   **Retorne somente o código DBML puro**. Sem explicações, comentários, ou qualquer texto adicional.
-   Use nomes de tabelas e colunas em inglês.
-   Inclua relacionamentos lógicos e bidirecionais entre tabelas.
-   Suporte apenas tipos de dados básicos: int, varchar, text, boolean, datetime.
-   A primeira coluna de cada tabela é a chave primária (id) se não for especificado.

## Exemplos
<exemplo_1>
  <entrada_usuario>Crie uma tabela de usuários</entrada_usuario>
  <saida_dbml>
    Table users {
      id int [pk, increment]
      name varchar
    }
  </saida_dbml>
</exemplo_1>

<exemplo_2>
  <entrada_usuario>Agora crie uma tabela de posts para blog</entrada_usuario>
  <saida_dbml>
    Table users {
      id int [pk, increment]
      name varchar
    }
    Table posts {
      id int [pk, increment]
      user_id int [ref: > users.id]
      title varchar
      content text
    }
  </saida_dbml>
</exemplo_2>

<exemplo_3>
  <entrada_usuario>Adicione um campo de email único na tabela de usuários e um campo de data na tabela de posts</entrada_usuario>
  <saida_dbml>
    Table users {
      id int [pk, increment]
      name varchar
      email varchar [unique]
    }
    Table posts {
      id int [pk, increment]
      user_id int [ref: > users.id]
      title varchar
      content text
      created_at datetime
    }
  </saida_dbml>
</exemplo_3>

---

## Processamento
1.  **Analise** o \`schema_atual\` e o \`prompt_do_usuario\`.
2.  **Combine** o novo pedido com o schema existente, garantindo que não haja duplicações ou referências inválidas.
3.  **Gere** o DBML final e completo.
4.  Se o \`schema_atual\` estiver vazio, gere o DBML do zero.

## Schema DBML Atual
${currentSchema ? `<dbml_atual>\n${currentSchema}\n</dbml_atual>\n` : ''}

Agora, com base no esquema atual e no prompt a seguir, gere o DBML final completo e válido.
`.trim();

  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `<user_prompt>${userPrompt}</user_prompt>`
      },
    ];

    const completion = await mindbase.ai.chat.completions.create({
      model: mindbase.model,
      messages,
      response_format: {
        type: 'text'
      },
    });

    console.log(completion.usage)

    const dbmlText = completion.choices[0].message.content?.trim() || '';

    // Verificação adicional para garantir que o resultado não esteja vazio
    if (!dbmlText) {
      return {
        data: null,
        error: {
          type: 'EmptyDbmlError',
          message: 'A resposta da IA não contém DBML válido.',
        }
      }
    }

    console.log('DBML Gerado:', dbmlText);

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