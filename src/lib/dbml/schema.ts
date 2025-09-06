import { redis } from '@/lib/redis';

export async function getDbml(boardId: string) {
  if (!redis.isOpen) {
    await redis.connect();
  }
  return await redis.get(`board:${boardId}:dbml`);
}

export async function setDbml(boardId: string, dbml: string) {
  if (!redis.isOpen) {
    await redis.connect();
  }
  await redis.set(`board:${boardId}:dbml`, dbml);
}