import { AIModel } from '@/lib/ai/config';

export const ENV = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET as string,
  GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY as string,
  AI_MODEL: {
    GOOGLE_GEMINI_MODEL: process.env.GOOGLE_GEMINI_MODEL as AIModel,
  }
}