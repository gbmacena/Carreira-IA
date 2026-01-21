import { Injectable } from '@nestjs/common';
import { LevelWeights, SCORING_WEIGHTS } from '../config/scoring.config';
import { Scores } from '../../shared/types/analysis.types';
import { Logger } from '../../shared/utils/logger.util';

@Injectable()
export class ScoreCalculationService {
  calculateOverallScore(scores: Scores, candidateLevel?: string): number {
    if (!scores) {
      Logger.error(
        'ScoreCalculationService',
        'Pontuações não fornecidas para cálculo',
      );
      return 0;
    }

    const level = candidateLevel || 'PLENO';
    const weights: LevelWeights =
      SCORING_WEIGHTS[level] || SCORING_WEIGHTS.PLENO;

    const overallScore =
      (scores.formatacao || 0) * weights.formatacao +
      (scores.clareza || 0) * weights.clareza +
      (scores.experiencia || 0) * weights.experiencia +
      (scores.habilidades || 0) * weights.habilidades +
      (scores.impacto || 0) * weights.impacto;

    Logger.info(
      'ScoreCalculationService',
      `Score calculation for level ${level}:
      Formatação: ${scores.formatacao} × ${weights.formatacao} = ${(scores.formatacao || 0) * weights.formatacao}
      Clareza: ${scores.clareza} × ${weights.clareza} = ${(scores.clareza || 0) * weights.clareza}
      Experiência: ${scores.experiencia} × ${weights.experiencia} = ${(scores.experiencia || 0) * weights.experiencia}
      Habilidades: ${scores.habilidades} × ${weights.habilidades} = ${(scores.habilidades || 0) * weights.habilidades}
      Impacto: ${scores.impacto} × ${weights.impacto} = ${(scores.impacto || 0) * weights.impacto}
      Total: ${overallScore}`,
    );

    return Math.round(overallScore * 10) / 10;
  }

  getWeightsForLevel(candidateLevel?: string): LevelWeights {
    const level = candidateLevel || 'PLENO';
    return SCORING_WEIGHTS[level] || SCORING_WEIGHTS.PLENO;
  }
}
