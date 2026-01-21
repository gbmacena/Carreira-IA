export interface LevelWeights {
  formatacao: number;
  clareza: number;
  experiencia: number;
  habilidades: number;
  impacto: number;
}

export const SCORING_WEIGHTS: Record<string, LevelWeights> = {
  ESTAGIO: {
    formatacao: 0.2,
    clareza: 0.25,
    experiencia: 0.05,
    habilidades: 0.3,
    impacto: 0.2,
  },
  JUNIOR: {
    formatacao: 0.15,
    clareza: 0.2,
    experiencia: 0.2,
    habilidades: 0.2,
    impacto: 0.25,
  },
  PLENO: {
    formatacao: 0.08,
    clareza: 0.12,
    experiencia: 0.35,
    habilidades: 0.15,
    impacto: 0.3,
  },
  SENIOR: {
    formatacao: 0.05,
    clareza: 0.1,
    experiencia: 0.35,
    habilidades: 0.15,
    impacto: 0.35,
  },
};

export const DEFAULT_LEVEL = 'PLENO';
