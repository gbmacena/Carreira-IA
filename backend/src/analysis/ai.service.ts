import { Injectable } from '@nestjs/common';
import { PdfParsingService } from './services/pdf-parsing.service';
import { PromptBuilderService } from './services/prompt-builder.service';
import { ScoreCalculationService } from './services/score-calculation.service';
import { GroqApiService } from './services/groq-api.service';
import { Logger } from '../shared/utils/logger.util';
import { VALIDATION_ERRORS } from '../shared/config/constants.config';
import {
  LOGGING_MESSAGES,
  formatLogMessage,
} from '../shared/config/logging.messages';

@Injectable()
export class AIService {
  constructor(
    private readonly pdfParsingService: PdfParsingService,
    private readonly promptBuilderService: PromptBuilderService,
    private readonly scoreCalculationService: ScoreCalculationService,
    private readonly groqApiService: GroqApiService,
  ) {}

  async analyzeResume(
    filePath: string,
    candidateLevel?: string,
    jobDescription?: string,
  ) {
    try {
      Logger.info('AIService', LOGGING_MESSAGES.AI_SERVICE_STARTING_ANALYSIS, {
        filePath,
        candidateLevel,
      });

      const resumeText =
        await this.pdfParsingService.extractTextFromPdf(filePath);
      if (!resumeText || resumeText.length < 100) {
        throw new Error(VALIDATION_ERRORS.INVALID_RESUME_TEXT);
      }

      Logger.info('AIService', LOGGING_MESSAGES.AI_SERVICE_PDF_PARSED);

      let analysisResult;
      if (jobDescription && jobDescription.trim()) {
        analysisResult = await this.analyzeResumeWithJob(
          resumeText,
          jobDescription,
          candidateLevel,
        );
      } else {
        analysisResult = await this.analyzeResumeGeneral(
          resumeText,
          candidateLevel,
        );
      }

      return analysisResult;
    } catch (error) {
      Logger.error('AIService', LOGGING_MESSAGES.AI_SERVICE_ERROR, error);
      throw error;
    }
  }

  private async analyzeResumeGeneral(
    resumeText: string,
    candidateLevel?: string,
  ) {
    try {
      Logger.info('AIService', LOGGING_MESSAGES.AI_SERVICE_GENERAL_ANALYSIS);

      const prompt = this.promptBuilderService.buildGeneralAnalysisPrompt(
        resumeText,
        candidateLevel,
      );

      const response = await this.groqApiService.callGroqApi(prompt);

      const parsed = this.groqApiService.parseGroqResponse(response);
      Logger.info('AIService', LOGGING_MESSAGES.AI_SERVICE_JSON_PARSED);

      const overallScore = this.scoreCalculationService.calculateOverallScore(
        parsed.scores,
        candidateLevel,
      );

      parsed.overallScore = Math.round(overallScore * 10) / 10;

      Logger.info(
        'AIService',
        formatLogMessage(LOGGING_MESSAGES.AI_SERVICE_SCORE_RECALCULATED, {
          level: candidateLevel || 'PLENO',
          score: parsed.overallScore,
        }),
      );

      return parsed;
    } catch (error) {
      Logger.error(
        'AIService',
        LOGGING_MESSAGES.AI_SERVICE_ERROR_GENERAL,
        error,
      );
      throw error;
    }
  }

  private async analyzeResumeWithJob(
    resumeText: string,
    jobDescription: string,
    candidateLevel?: string,
  ) {
    try {
      Logger.info('AIService', LOGGING_MESSAGES.AI_SERVICE_JOB_ANALYSIS);

      const prompt = this.promptBuilderService.buildJobSpecificAnalysisPrompt(
        resumeText,
        jobDescription,
        candidateLevel,
      );

      const response = await this.groqApiService.callGroqApi(prompt);

      const parsed = this.groqApiService.parseGroqResponse(response);
      Logger.info('AIService', LOGGING_MESSAGES.AI_SERVICE_JSON_PARSED);

      const overallScore = this.scoreCalculationService.calculateOverallScore(
        parsed.scores,
        candidateLevel,
      );

      parsed.overallScore = Math.round(overallScore * 10) / 10;

      this.validateAndCorrectATSScore(parsed);

      Logger.info(
        'AIService',
        formatLogMessage(LOGGING_MESSAGES.AI_SERVICE_SCORE_RECALCULATED, {
          level: candidateLevel || 'PLENO',
          score: parsed.overallScore,
        }),
      );

      return parsed;
    } catch (error) {
      Logger.error('AIService', LOGGING_MESSAGES.AI_SERVICE_ERROR_JOB, error);
      throw error;
    }
  }

  private validateAndCorrectATSScore(parsed: any): void {
    if (!parsed.atsScore) {
      parsed.atsScore = 50;
    }

    if (
      typeof parsed.atsScore !== 'number' ||
      parsed.atsScore < 0 ||
      parsed.atsScore > 100
    ) {
      Logger.warn(
        'AIService',
        `ATS Score inválido recebido: ${parsed.atsScore}, normalizando para 50`,
      );
      parsed.atsScore = 50;
    }

    if (parsed.jobMatch && parsed.jobMatch.adherencePercentage !== undefined) {
      const adherence = parsed.jobMatch.adherencePercentage;

      if (adherence < 30 && parsed.atsScore > 45) {
        Logger.warn(
          'AIService',
          `Incoerência detectada: adherencePercentage=${adherence}% mas atsScore=${parsed.atsScore}. Ajustando ATS para 35`,
        );
        parsed.atsScore = 35;
      }

      if (
        adherence >= 30 &&
        adherence <= 50 &&
        (parsed.atsScore < 35 || parsed.atsScore > 65)
      ) {
        const correctedATS = Math.round(adherence * 1.2);
        Logger.warn(
          'AIService',
          `ATS ajustado de ${parsed.atsScore} para ${correctedATS} baseado em adherencePercentage=${adherence}%`,
        );
        parsed.atsScore = correctedATS;
      }

      if (adherence > 75 && parsed.atsScore < 75) {
        Logger.warn(
          'AIService',
          `ATS muito baixo (${parsed.atsScore}) para adherencePercentage=${adherence}%. Aumentando para 80`,
        );
        parsed.atsScore = 80;
      }
    }

    Logger.info('AIService', `ATS Score validado e final: ${parsed.atsScore}`);
  }
}
