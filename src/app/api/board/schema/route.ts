import { convertDbmlToNodesAndEdges } from '@/lib/dbml/convertDbmlToNodesAndEdges';
import { getDbml } from '@/lib/redis/getDBML';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const boardId = searchParams.get('boardId');

  if (!boardId) {
    return NextResponse.json({ data: { schema: null }, error: 'boardId is required' }, { status: 400 });
  }

  const dbml = await getDbml(boardId);
  const schema = convertDbmlToNodesAndEdges(dbml ?? '');

  return NextResponse.json({
    data: { schema },
    error: null
  });
}
