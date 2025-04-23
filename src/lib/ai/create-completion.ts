'use server'

import { mindbaseAI } from '@/lib/ai';
import { ApiResponse } from '@/lib/result';

type CreateCompletionRequest = {
  content: string;
}

type CreateCompletionResponse = {
  result: string | null;
}

export async function createCompletion({
  content
}: CreateCompletionRequest): Promise<ApiResponse<CreateCompletionResponse>> {
  const mindbaseAi = await mindbaseAI();

  const node = {
    "id": 'Crie um ID HEX',
    "type": 'db',
    "position": {
      "x": "number",
      "y": "number"
    },
    "data": {
      "tableName": "",
      "fields": [{
        "id": 'Crie um ID HEX',
        "name": "",
        "type": "",
        "isPrimaryKey": "boolean",
        "isForeignKey": "boolean",
        "isUnique": "boolean",
      }]
    }
  }

  const edge = {
    "animated": "boolean",
    "style": {
      "stroke": "white",
      "strokeWidth": 1,
      "strokeDasharray": 0,
      "strokeLinecap": "square"
    },
    "source": "NODE SOURCE ID",
    "sourceHandle": "top | bottom | left | right",
    "target": "NODE TARGET ID",
    "targetHandle": "top | bottom | left | right",
    "id": "Crie um ID HEX",
    "type": "default"
  }

  const jsonBase = {
    nodes: [node],
    edges: [edge]
  };

  try {
    const result = await mindbaseAi.ai.chat.completions.create({
      model: mindbaseAi.model,
      messages: [
        {
          role: "system",
          content: `
            Você é especializado em gerar json para nodes e edges na biblioteca javascript React Flow para fazer um design de banco de dados.

            Regras:
            - Deverá retornar um json com os nodes e o edges no formato a seguir: ${JSON.stringify(jsonBase)}
            - Defina o position X e Y de cada node para que fique em uma distância longe um do outro.
            - Defina o position X e Y mais próximo baseado na conexão da tabela mais próxima.
            - Defina o position X e Y com pelo menos 300 de distância do node mais próximo.
            - Considere ligar o target e source mais próximo baseado no x e y de cada node.
            - Caso seja solicitado relações entre as tabelas do banco de dados, faça utilizando edges.
            - Crie Id's fictícios para os objetos.
            - Retorne apenas o JSON. Não use crases, como: \`\`\`json.
            - Defina o nome das colunas e tipos da melhor forma.
          `,
          name: 'mindBase AI'
        },
        {
          role: "user",
          content,
        },
      ],
    });

    return {
      data: {
        result: JSON.parse((result.choices[0].message.content?.replace('```json', '')?.replace('```', '').toString()) as string),
      },
      error: null,
    };
  } catch (error: any) {
    console.error(`Error on AI create completion: ${JSON.stringify(error)}`);

    return {
      data: null,
      error: {
        type: "AiCreateCompletionError",
        message: "Error on AI create completion",
      },
    };
  }
}