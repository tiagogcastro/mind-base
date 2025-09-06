import { redis } from '@/config/redis';

export async function setDbml(boardId: string, dbml: string) {
  if (!redis.isOpen) {
    await redis.connect();
  }
  await redis.set(`board:${boardId}:dbml`, dbml);
}