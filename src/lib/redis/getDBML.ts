import { redis } from '@/config/redis';

export async function getDbml(boardId: string) {
  if (!redis.isOpen) {
    await redis.connect();
  }
  return await redis.get(`board:${boardId}:dbml`);
}