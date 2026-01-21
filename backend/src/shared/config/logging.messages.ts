export const LOGGING_MESSAGES = {
  // AIService
  AI_SERVICE_STARTING_ANALYSIS: 'Iniciando análise',
  AI_SERVICE_PDF_PARSED: 'PDF analisado com sucesso',
  AI_SERVICE_GENERAL_ANALYSIS: 'Realizando análise geral',
  AI_SERVICE_JSON_PARSED: 'JSON analisado com sucesso',
  AI_SERVICE_SCORE_RECALCULATED:
    'Pontuação recalculada para nível {level}: {score}',
  AI_SERVICE_JOB_ANALYSIS: 'Realizando análise específica para vaga',
  AI_SERVICE_ERROR: 'Erro na análise',
  AI_SERVICE_ERROR_GENERAL: 'Erro na análise geral',
  AI_SERVICE_ERROR_JOB: 'Erro na análise para vaga',

  // AuthService
  AUTH_STARTING_REGISTRATION: 'Iniciando registro',
  AUTH_REGISTRATION_SUCCESS: 'Registro concluído com sucesso',
  AUTH_ERROR_REGISTRATION: 'Erro no registro',
  AUTH_LOGIN_ATTEMPT: 'Tentativa de login',
  AUTH_LOGIN_SUCCESS: 'Login bem-sucedido',
  AUTH_ERROR_LOGIN: 'Erro no login',
  AUTH_TOKEN_REFRESHED: 'Token atualizado com sucesso',
  AUTH_ERROR_REFRESH: 'Erro ao atualizar token',
  AUTH_LOGOUT_SUCCESS: 'Usuário desconectado com sucesso',
  AUTH_ERROR_LOGOUT: 'Erro ao desconectar',

  // AnalysisService
  ANALYSIS_GETTING: 'Obtendo análise',
  ANALYSIS_RETRIEVED: 'Análise recuperada com sucesso',
  ANALYSIS_ERROR_GET: 'Erro ao obter análise',
  ANALYSIS_GETTING_HISTORY: 'Obtendo histórico de análises',
  ANALYSIS_HISTORY_RETRIEVED: 'Histórico recuperado: {count} análises',
  ANALYSIS_ERROR_HISTORY: 'Erro ao obter histórico',
  ANALYSIS_DELETING: 'Deletando análise',
  ANALYSIS_DELETED: 'Análise deletada com sucesso',
  ANALYSIS_ERROR_DELETE: 'Erro ao deletar análise',
  ANALYSIS_REMOVING_FILE: 'Arquivo removido: {filePath}',
  ANALYSIS_ERROR_REMOVE_FILE: 'Erro ao remover arquivo',

  // AnalysisProcessor
  PROCESSOR_STARTING: 'Iniciando processamento de análise',
  PROCESSOR_READING_PDF: 'Lendo arquivo PDF',
  PROCESSOR_CALLING_AI: 'Chamando serviço de IA',
  PROCESSOR_SUCCESS: 'Análise processada com sucesso',
  PROCESSOR_ERROR: 'Erro ao processar análise {id}',

  // UploadService
  UPLOAD_DIRECTORY_CREATED: 'Diretório de upload criado',
  UPLOAD_FILE_QUEUED: 'Arquivo enviado e enfileirado para análise',
  UPLOAD_ERROR: 'Erro no upload',
  UPLOAD_ERROR_SAVE: 'Erro ao salvar arquivo',
  UPLOAD_ERROR_RECORD: 'Erro ao criar registro de análise',
  UPLOAD_ERROR_QUEUE: 'Erro ao enfileirar análise',

  // PdfParsingService
  PDF_READING: 'Lendo arquivo PDF',
  PDF_PARSING_START: 'Iniciando análise do PDF',
  PDF_PARSED: 'PDF analisado com sucesso, comprimento do texto: {textLength}',
  PDF_ERROR: 'Erro ao analisar PDF',

  // ScoreCalculationService
  SCORE_CALCULATION:
    'Cálculo de pontuação para nível {level}: Formatação: {fmt}×{fmtw}={fmtr}, Clareza: {clr}×{clrw}={clrr}, Experiência: {exp}×{expw}={expr}, Habilidades: {hab}×{habw}={habr}, Impacto: {imp}×{impw}={impr}, Total: {total}',

  // GroqApiService
  GROQ_INITIALIZED: 'GroqApiService inicializado com chave de API',
  GROQ_CALLING: 'Chamando API Groq',
  GROQ_RESPONSE_RECEIVED: 'Resposta recebida com sucesso',
  GROQ_ERROR_CALL: 'Falha na chamada da API',
  GROQ_RESPONSE_PARSED: 'Resposta analisada com sucesso',
  GROQ_ERROR_PARSE: 'Erro ao analisar resposta',
  GROQ_REQUEST_CREATING: 'Criando requisição de conclusão Groq',
  GROQ_RESPONSE_SUCCESS: 'Resposta Groq recebida com sucesso',
  GROQ_ERROR: 'Erro ao chamar API Groq',
} as const;

export type LoggingMessage =
  (typeof LOGGING_MESSAGES)[keyof typeof LOGGING_MESSAGES];

export function formatLogMessage(
  template: string,
  variables?: Record<string, string | number>,
): string {
  if (!variables) return template;

  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{${key}}`, 'g'), String(value));
  });
  return result;
}
