'use server';
import { default as OpenAI } from "openai";
import { AI_CURRENT_PROVIDER, getAIModelConfig } from './config';

export const mindbaseAI = async () => {
  const { API_KEY, BASE_URL, MODEL } = getAIModelConfig(AI_CURRENT_PROVIDER);

  const ai = new OpenAI({
    apiKey: API_KEY,
    baseURL: BASE_URL,
  });

  return {
    ai,
    model: MODEL
  };
}