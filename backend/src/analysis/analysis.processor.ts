import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { AIService } from './ai.service';
import { Logger } from '../shared/utils/logger.util';
import { ANALYSIS_STATUS } from '../shared/config/constants.config';
import {
  LOGGING_MESSAGES,
  formatLogMessage,
} from '../shared/config/logging.messages';
import * as fs from 'fs';

@Processor('analysis')
export class AnalysisProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private aiService: AIService,
  ) {
    super();
  }

  async process(job: Job) {
    const { analysisId, filePath, jobDescription, candidateLevel } = job.data;

    try {
      Logger.info('AnalysisProcessor', LOGGING_MESSAGES.PROCESSOR_STARTING, {
        analysisId,
      });

      await this.prisma.analysis.update({
        where: { id: analysisId },
        data: { status: ANALYSIS_STATUS.PROCESSING },
      });

      Logger.info('AnalysisProcessor', LOGGING_MESSAGES.PROCESSOR_READING_PDF, {
        filePath,
      });
      fs.readFileSync(filePath);

      Logger.info('AnalysisProcessor', LOGGING_MESSAGES.PROCESSOR_CALLING_AI, {
        candidateLevel,
      });
      const analysisResult = await this.aiService.analyzeResume(
        filePath,
        candidateLevel,
        jobDescription,
      );

      Logger.info('AnalysisProcessor', LOGGING_MESSAGES.PROCESSOR_SUCCESS);

      await this.prisma.analysis.update({
        where: { id: analysisId },
        data: {
          status: ANALYSIS_STATUS.COMPLETED,
          generalSummary:
            analysisResult.generalSummary?.overallOverview || null,
          estimatedLevel: analysisResult.generalSummary?.estimatedLevel || null,
          strengths: analysisResult.strengths || null,
          weaknesses: analysisResult.weaknesses || null,
          suggestions: analysisResult.suggestions || null,
          sectionFeedback: analysisResult.sectionFeedback || null,
          jobMatch: analysisResult.jobMatch || null,
          scores: analysisResult.scores || null,
          overallScore: analysisResult.overallScore || null,
          atsScore: analysisResult.atsScore || null,
          completedAt: new Date(),
        },
      });

      return { success: true, analysisId };
    } catch (error) {
      const errorMessage = error?.message || 'Erro desconhecido';

      Logger.error(
        'AnalysisProcessor',
        formatLogMessage(LOGGING_MESSAGES.PROCESSOR_ERROR, {
          id: analysisId,
          reason: errorMessage,
        }),
        error,
      );

      if (errorMessage.includes('token') || errorMessage.includes('quota')) {
        Logger.warn(
          'AnalysisProcessor',
          `Limite de análises atingido para analysisId: ${analysisId}`,
        );
      } else if (
        errorMessage.includes('PDF') ||
        errorMessage.includes('parse')
      ) {
        Logger.warn(
          'AnalysisProcessor',
          `Falha ao processar PDF para analysisId: ${analysisId}`,
        );
      }

      await this.prisma.analysis.update({
        where: { id: analysisId },
        data: {
          status: ANALYSIS_STATUS.FAILED,
          errorMessage: this.formatErrorMessage(errorMessage),
        },
      });

      throw error;
    }
  }

  private formatErrorMessage(message: string): string {
    if (message.includes('token') || message.includes('quota')) {
      return 'Limite de análises atingido ou erro de autenticação com serviço de IA. Tente novamente mais tarde.';
    }

    if (
      message.includes('PDF') ||
      message.includes('parse') ||
      message.includes('extract')
    ) {
      return 'Erro ao processar o PDF. Verifique se o arquivo está corrompido ou é um PDF válido.';
    }

    if (
      message.includes('timeout') ||
      message.includes('network') ||
      message.includes('ECONNREFUSED')
    ) {
      return 'Erro de conexão com serviço de IA. Tente novamente em alguns minutos.';
    }

    if (message.includes('currículo') || message.includes('INVALID')) {
      return message;
    }

    if (message.length > 200) {
      return message.substring(0, 200) + '...';
    }

    return message;
  }
}
