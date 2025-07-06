import { ENV } from '@/config/env';
import { OpenAIEmbeddings } from "@langchain/openai";
import { RedisVectorStore } from "@langchain/redis";
import { createClient } from "redis";

export const redis = createClient({
  url: ENV.REDIS_DATABASE_URL
});

export async function getRedisVectorStore({
  keyPrefix
}: {
  keyPrefix: string
}) {
  const redisVectorStorage = new RedisVectorStore(
    new OpenAIEmbeddings({
      openAIApiKey: ENV.OPENAI_API_KEY,
    }),
    {
      indexName: 'mindbase-schemas',
      redisClient: redis,

      keyPrefix
    }
  );

  return {
    redisVectorStorage
  }
}
