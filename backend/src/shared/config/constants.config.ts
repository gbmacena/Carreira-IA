export const ANALYSIS_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type AnalysisStatus =
  (typeof ANALYSIS_STATUS)[keyof typeof ANALYSIS_STATUS];

export const FILE_CONFIG = {
  UPLOAD_DIR: 'uploads',
  MIN_RESUME_TEXT_LENGTH: 100,
  MAX_FILE_SIZE_MB: 5,
} as const;

export const VALIDATION_ERRORS = {
  FILE_NOT_PROVIDED: 'Arquivo não fornecido',
  ONLY_PDF_ALLOWED: 'Apenas arquivos PDF são permitidos',
  FILE_TOO_LARGE: 'Arquivo muito grande',
  INVALID_RESUME_TEXT: 'Texto do currículo muito curto ou não encontrado',
  API_KEY_NOT_CONFIGURED: 'GROQ_API_KEY não está configurada',
  PDF_NOT_FOUND: 'Arquivo PDF não encontrado',
  PDF_PARSING_FAILED: 'Falha ao processar o arquivo PDF',
  FILE_SAVE_FAILED: 'Falha ao salvar arquivo',
  ANALYSIS_RECORD_FAILED: 'Falha ao criar registro de análise',
  ANALYSIS_QUEUE_FAILED: 'Falha ao enfileirar análise',
  ANALYSIS_NOT_FOUND: 'Análise não encontrada',
  EMAIL_IN_USE: 'Email já está em uso',
  REGISTRATION_FAILED: 'Falha no registro do usuário',
  INVALID_CREDENTIALS: 'Email ou senha incorretos',
  INVALID_TOKEN: 'Token inválido ou expirado',
  GROQ_RESPONSE_PARSING_FAILED: 'Falha ao processar análise com IA',
  EMPTY_GROQ_RESPONSE: 'Resposta vazia da API Groq',
} as const;
