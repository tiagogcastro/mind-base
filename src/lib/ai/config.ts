import { ENV } from '@/config/env';

export type AIProvider = 'google';
export type AIModel = 'gemini-2.0-flash';

export const AI_CURRENT_PROVIDER: AIProvider = 'google';

export type AIModelConfig = {
  API_KEY?: string;
  MODEL: AIModel;
  BASE_URL?: string;
}

export type AI_MODEL_TYPE = Record<AIProvider, AIModelConfig>;

export const AI_MODELS: AI_MODEL_TYPE = {
  'google': {
    API_KEY: ENV.GOOGLE_GEMINI_API_KEY,
    MODEL: ENV.AI_MODEL.GOOGLE_GEMINI_MODEL,
    BASE_URL: "https://generativelanguage.googleapis.com/v1beta/openai/"
  },
}

export function getAIModelConfig(provider: AIProvider): AIModelConfig {
  const modelConfig = AI_MODELS[provider];

  if (!modelConfig) {
    throw new Error(`No AI model config found for provider: ${provider}`);
  }

  return modelConfig;
}
