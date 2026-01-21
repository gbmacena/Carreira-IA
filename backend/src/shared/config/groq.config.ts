export const GROQ_MODELS = {
  LLAMA_3_3_70B: 'llama-3.3-70b-versatile',
  LLAMA_3_1_70B: 'llama-3.1-70b-versatile',
} as const;

export const GROQ_CONFIG = {
  DEFAULT_MODEL: GROQ_MODELS.LLAMA_3_3_70B,
  MAX_TOKENS: 8000,
  TEMPERATURE: 0.7,
  TIMEOUT: 30000,
} as const;
