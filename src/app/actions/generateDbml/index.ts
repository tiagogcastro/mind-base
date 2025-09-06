'use server';

import { generateDbml } from '@/lib/AI/generate-dbml';
import { convertDbmlToNodesAndEdges } from '@/lib/dbml/convertDbmlToNodesAndEdges';
import { setDbml } from '@/lib/redis/setDBML';
import type { DatabaseSchema } from '@/store/DatabaseDiagramStore';

export type GenerateDbmlSuccess = {
  data: { schema: DatabaseSchema };
  error: null;
};

export type GenerateDbmlError = {
  data: null;
  error: { type: string; message: string };
};

export type GenerateDbmlResult = GenerateDbmlSuccess | GenerateDbmlError;

export async function handleGenerateDbml({ prompt, boardId }: { prompt: string, boardId: string }) {
  try {
    const generateDbmlFromPromptResult = await generateDbml(prompt, boardId);

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
