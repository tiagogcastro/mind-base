'use server';
import { ENV } from '@/config/env';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { default as OpenAI } from "openai";
import { AI_CURRENT_PROVIDER, getAIModelConfig } from './config';

export const mindbaseAI = async () => {
  const { API_KEY, BASE_URL, MODEL } = getAIModelConfig(AI_CURRENT_PROVIDER);

  const ai = new OpenAI({
    apiKey: API_KEY,
    baseURL: BASE_URL,
  });

  const chatOpenAi = new ChatOpenAI({
    apiKey: API_KEY,
    configuration: {
      baseURL: BASE_URL,
    },
    model: MODEL,
  });

  const openAIEmbeddings = new OpenAIEmbeddings({
    openAIApiKey: ENV.OPENAI_API_KEY,
  });

  return {
    ai,
    chatOpenAi,
    openAIEmbeddings,
    model: MODEL
  };
}