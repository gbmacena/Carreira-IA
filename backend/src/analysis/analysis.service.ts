import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorHandler } from '../shared/utils/error-handler.util';
import { Logger } from '../shared/utils/logger.util';
import { VALIDATION_ERRORS } from '../shared/config/constants.config';
import {
  LOGGING_MESSAGES,
  formatLogMessage,
} from '../shared/config/logging.messages';
import * as fs from 'fs';

@Injectable()
export class AnalysisService {
  constructor(private prisma: PrismaService) {}

  async getAnalysis(analysisId: string, userId: string) {
    try {
      Logger.info('AnalysisService', LOGGING_MESSAGES.ANALYSIS_GETTING, {
        analysisId,
        userId,
      });

      const analysis = await this.findAnalysisByIdAndUser(analysisId, userId);

      Logger.info('AnalysisService', LOGGING_MESSAGES.ANALYSIS_RETRIEVED);
      return analysis;
    } catch (error) {
      ErrorHandler.handleError(error, 'AnalysisService.getAnalysis');
    }
  }

  async getHistory(userId: string) {
    try {
      Logger.info(
        'AnalysisService',
        LOGGING_MESSAGES.ANALYSIS_GETTING_HISTORY,
        { userId },
      );

      const analyses = await this.prisma.analysis.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fileName: true,
          status: true,
          createdAt: true,
          completedAt: true,
          estimatedLevel: true,
          errorMessage: true,
        },
      });

      Logger.info(
        'AnalysisService',
        formatLogMessage(LOGGING_MESSAGES.ANALYSIS_HISTORY_RETRIEVED, {
          count: analyses.length,
        }),
      );
      return analyses;
    } catch (error) {
      ErrorHandler.handleError(error, 'AnalysisService.getHistory');
    }
  }

  async deleteAnalysis(analysisId: string, userId: string) {
    try {
      Logger.info('AnalysisService', LOGGING_MESSAGES.ANALYSIS_DELETING, {
        analysisId,
        userId,
      });

      const analysis = await this.findAnalysisByIdAndUser(analysisId, userId);

      await this.removeAnalysisFile(analysis.filePath);

      await this.prisma.analysis.delete({
        where: { id: analysisId },
      });

      Logger.info('AnalysisService', LOGGING_MESSAGES.ANALYSIS_DELETED);
      return { message: 'Análise deletada com sucesso' };
    } catch (error) {
      ErrorHandler.handleError(error, 'AnalysisService.deleteAnalysis');
    }
  }

  private async findAnalysisByIdAndUser(analysisId: string, userId: string) {
    const analysis = await this.prisma.analysis.findFirst({
      where: {
        id: analysisId,
        userId,
      },
    });

    if (!analysis) {
      throw new NotFoundException(VALIDATION_ERRORS.ANALYSIS_NOT_FOUND);
    }

    return analysis;
  }

  private async removeAnalysisFile(filePath: string): Promise<void> {
    if (!filePath) return;

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        Logger.info(
          'AnalysisService',
          formatLogMessage(LOGGING_MESSAGES.ANALYSIS_REMOVING_FILE, {
            filePath,
          }),
        );
      }
    } catch (error) {
      Logger.error(
        'AnalysisService',
        LOGGING_MESSAGES.ANALYSIS_ERROR_REMOVE_FILE,
        error,
      );
    }
  }
}
