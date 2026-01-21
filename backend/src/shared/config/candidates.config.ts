export enum CandidateLevelEnum {
  ESTAGIO = 'ESTAGIO',
  JUNIOR = 'JUNIOR',
  PLENO = 'PLENO',
  SENIOR = 'SENIOR',
}

export const DEFAULT_CANDIDATE_LEVEL = CandidateLevelEnum.PLENO;

export const CANDIDATE_LEVEL_DESCRIPTIONS: Record<string, string> = {
  [CandidateLevelEnum.ESTAGIO]: 'Estagiário/Trainee (0-1 ano de experiência)',
  [CandidateLevelEnum.JUNIOR]: 'Desenvolvedor Júnior (1-3 anos de experiência)',
  [CandidateLevelEnum.PLENO]: 'Desenvolvedor Pleno (3-7 anos de experiência)',
  [CandidateLevelEnum.SENIOR]: 'Desenvolvedor Sênior (7+ anos de experiência)',
};

export const VALID_CANDIDATE_LEVELS = Object.values(CandidateLevelEnum);

export function isValidCandidateLevel(level: any): level is CandidateLevelEnum {
  return VALID_CANDIDATE_LEVELS.includes(level);
}
