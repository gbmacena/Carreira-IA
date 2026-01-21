export interface Scores {
  formatacao: number;
  clareza: number;
  experiencia: number;
  habilidades: number;
  impacto: number;
}

export interface SectionFeedback {
  resumoProfissional?: string;
  experiencias?: string;
  habilidades?: string;
  organizacaoGeral?: string;
}

export interface JobMatch {
  adherencePercentage?: number;
  mainGaps?: string[];
  missingKeywords?: string[];
  suggestions?: string[];
}

export interface AnalysisData {
  id: string;
  fileName: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  scores: Scores | null;
  overallScore: number | null;
  atsScore: number | null;
  candidateLevel: string | null;
  generalSummary: string | null;
  estimatedLevel: string | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  suggestions: string[] | null;
  sectionFeedback: SectionFeedback | null;
  jobMatch: JobMatch | null;
  errorMessage?: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface ScoreMessage {
  text: string;
  color: string;
}
