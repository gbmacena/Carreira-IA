import { Injectable } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
import * as fs from 'fs';
import { Logger } from '../../shared/utils/logger.util';
import { VALIDATION_ERRORS } from '../../shared/config/constants.config';
import {
  LOGGING_MESSAGES,
  formatLogMessage,
} from '../../shared/config/logging.messages';

@Injectable()
export class PdfParsingService {
  async extractTextFromPdf(filePath: string): Promise<string> {
    try {
      Logger.info('PdfParsingService', LOGGING_MESSAGES.PDF_READING, {
        filePath,
      });

      if (!fs.existsSync(filePath)) {
        throw new Error(VALIDATION_ERRORS.PDF_NOT_FOUND);
      }

      const pdfBuffer = fs.readFileSync(filePath);
      Logger.info('PdfParsingService', LOGGING_MESSAGES.PDF_PARSING_START);

      const pdfData = await pdfParse(pdfBuffer);
      Logger.info(
        'PdfParsingService',
        formatLogMessage(LOGGING_MESSAGES.PDF_PARSED, {
          textLength: pdfData.text.length,
        }),
      );
      return pdfData.text;
    } catch (error) {
      Logger.error('PdfParsingService', LOGGING_MESSAGES.PDF_ERROR, error);
      throw new Error(VALIDATION_ERRORS.PDF_PARSING_FAILED);
    }
  }
}
