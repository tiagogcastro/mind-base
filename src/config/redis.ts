import { ENV } from '@/config/env';
import { createClient } from "redis";

export const redis = createClient({
  url: ENV.REDIS_DATABASE_URL
});