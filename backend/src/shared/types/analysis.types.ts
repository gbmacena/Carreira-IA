export interface Scores {
  formatacao: number;
  clareza: number;
  experiencia: number;
  habilidades: number;
  impacto: number;
}

export interface GeneralSummary {
  estimatedLevel: string;
  overallOverview: string;
}

export interface SectionFeedback {
  resumoProfissional?: string;
  experiencias?: string;
  habilidades?: string;
  organizacaoGeral?: string;
}

export interface JobMatch {
  adherencePercentage: number;
  mainGaps: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export interface BaseAnalysisResult {
  scores: Scores;
  overallScore: number;
  atsScore: number;
  generalSummary: GeneralSummary;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  sectionFeedback: SectionFeedback;
}

export interface GeneralAnalysisResult extends BaseAnalysisResult {}

export interface JobAnalysisResult extends BaseAnalysisResult {
  jobMatch: JobMatch;
}

export type AnalysisResult = GeneralAnalysisResult | JobAnalysisResult;
