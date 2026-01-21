import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { APP_CONFIG } from '../shared/config/app.config';
import { Logger } from '../shared/utils/logger.util';
import {
  ANALYSIS_STATUS,
  FILE_CONFIG,
  VALIDATION_ERRORS,
} from '../shared/config/constants.config';
import { LOGGING_MESSAGES } from '../shared/config/logging.messages';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = path.join(process.cwd(), FILE_CONFIG.UPLOAD_DIR);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('analysis') private analysisQueue: Queue,
  ) {
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      Logger.info('UploadService', LOGGING_MESSAGES.UPLOAD_DIRECTORY_CREATED, {
        path: this.uploadDir,
      });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    jobDescription?: string,
    candidateLevel?: string,
  ) {
    try {
      this.validateFile(file);

      const filePath = await this.saveFile(file);
      const analysis = await this.createAnalysisRecord(
        userId,
        file.originalname,
        filePath,
        jobDescription,
        candidateLevel,
      );

      await this.queueAnalysisJob(
        analysis.id,
        filePath,
        jobDescription,
        candidateLevel,
      );

      Logger.info('UploadService', LOGGING_MESSAGES.UPLOAD_FILE_QUEUED, {
        analysisId: analysis.id,
      });

      return {
        id: analysis.id,
        status: analysis.status,
        createdAt: analysis.createdAt,
      };
    } catch (error) {
      Logger.error('UploadService', LOGGING_MESSAGES.UPLOAD_ERROR, error);
      throw error;
    }
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException(VALIDATION_ERRORS.FILE_NOT_PROVIDED);
    }

    if (!APP_CONFIG.ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
      throw new BadRequestException(VALIDATION_ERRORS.ONLY_PDF_ALLOWED);
    }

    if (file.size > APP_CONFIG.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `${VALIDATION_ERRORS.FILE_TOO_LARGE} (máximo ${APP_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB)`,
      );
    }
  }

  private async saveFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, fileName);

    try {
      fs.writeFileSync(filePath, file.buffer);
      return filePath;
    } catch (error) {
      Logger.error('UploadService', LOGGING_MESSAGES.UPLOAD_ERROR_SAVE, error);
      throw new BadRequestException(VALIDATION_ERRORS.FILE_SAVE_FAILED);
    }
  }

  private async createAnalysisRecord(
    userId: string,
    originalFileName: string,
    filePath: string,
    jobDescription?: string,
    candidateLevel?: string,
  ) {
    try {
      return await this.prisma.analysis.create({
        data: {
          userId,
          fileName: originalFileName,
          filePath,
          status: ANALYSIS_STATUS.PENDING,
          jobDescription: jobDescription || null,
          candidateLevel: candidateLevel || null,
        },
      });
    } catch (error) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      Logger.error(
        'UploadService',
        LOGGING_MESSAGES.UPLOAD_ERROR_RECORD,
        error,
      );
      throw new BadRequestException(VALIDATION_ERRORS.ANALYSIS_RECORD_FAILED);
    }
  }

  private async queueAnalysisJob(
    analysisId: string,
    filePath: string,
    jobDescription?: string,
    candidateLevel?: string,
  ): Promise<void> {
    try {
      await this.analysisQueue.add('process-analysis', {
        analysisId,
        filePath,
        jobDescription,
        candidateLevel,
      });
    } catch (error) {
      Logger.error('UploadService', LOGGING_MESSAGES.UPLOAD_ERROR_QUEUE, error);
      throw new BadRequestException(VALIDATION_ERRORS.ANALYSIS_QUEUE_FAILED);
    }
  }
}
