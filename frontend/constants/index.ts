export const API_CONFIG = {
  POLLING_INTERVAL: 3000,
  UX_DELAY: 500,
} as const;

export const ANALYSIS_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export const CANDIDATE_LEVELS = [
  { value: "ESTAGIO", label: "Estágio (primeira oportunidade)" },
  { value: "JUNIOR", label: "Júnior" },
  { value: "PLENO", label: "Pleno" },
  { value: "SENIOR", label: "Sênior" },
] as const;

export const STATUS_COLORS = {
  PENDING: "text-yellow-500",
  PROCESSING: "text-blue-500 animate-spin",
  COMPLETED: "text-green-500",
  FAILED: "text-red-500",
} as const;

export const STATUS_LABELS = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  COMPLETED: "Concluído",
  FAILED: "Falhou",
} as const;
