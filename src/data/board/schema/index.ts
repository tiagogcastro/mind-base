import { mindbaseApi } from '@/config/axios';
import { useNodeAndEdgeStore } from '@/store/DatabaseDiagramStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export async function fetchBoardSchema(boardId: string) {
  try {
    const result = await mindbaseApi.get(`/board/schema`, {
      params: {
        boardId
      }
    });

    return result.data.data.schema;
  } catch (error: any) {
    console.log(error)
  }
}

export function useGetBoardSchema(boardId: string) {
  const setDatabaseSchema = useNodeAndEdgeStore((state) => state.setDatabaseSchema);

  const query = useQuery({
    queryKey: ['board-schema', boardId],
    queryFn: () => fetchBoardSchema(boardId),
  });

  useEffect(() => {
    if (query.data) {
      setDatabaseSchema(query.data);
    }
  }, [query.data, setDatabaseSchema]);

  return query;
}
