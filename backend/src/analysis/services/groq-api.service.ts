import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { Logger } from '../../shared/utils/logger.util';
import { AnalysisResult } from '../../shared/types/analysis.types';
import { GROQ_CONFIG } from '../../shared/config/groq.config';
import { VALIDATION_ERRORS } from '../../shared/config/constants.config';
import { LOGGING_MESSAGES } from '../../shared/config/logging.messages';

@Injectable()
export class GroqApiService {
  private groq: Groq;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error(VALIDATION_ERRORS.API_KEY_NOT_CONFIGURED);
    }

    Logger.info('GroqApiService', LOGGING_MESSAGES.GROQ_INITIALIZED);
    this.groq = new Groq({ apiKey });
  }

  async callGroqApi(prompt: string) {
    try {
      Logger.info('GroqApiService', LOGGING_MESSAGES.GROQ_CALLING);

      const response = await this.groq.chat.completions.create({
        model: GROQ_CONFIG.DEFAULT_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: GROQ_CONFIG.TEMPERATURE,
        max_tokens: GROQ_CONFIG.MAX_TOKENS,
      });

      Logger.info('GroqApiService', LOGGING_MESSAGES.GROQ_RESPONSE_RECEIVED);
      return response;
    } catch (error) {
      Logger.error('GroqApiService', LOGGING_MESSAGES.GROQ_ERROR_CALL, error);
      throw error;
    }
  }

  parseGroqResponse(response: any): any {
    try {
      const content = response.choices?.[0]?.message?.content || response || '';

      if (!content || typeof content !== 'string') {
        Logger.error('GroqApiService', 'Resposta inválida da API', {
          response,
        });
        throw new Error(VALIDATION_ERRORS.GROQ_RESPONSE_PARSING_FAILED);
      }

      let cleanText = content.trim();

      Logger.info('GroqApiService', 'Resposta bruta (primeiros 200 chars)', {
        preview: cleanText.substring(0, 200),
      });

      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.substring(7);
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.substring(3);
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }

      cleanText = cleanText.trim();

      if (!cleanText.startsWith('{')) {
        const startIdx = cleanText.indexOf('{');
        if (startIdx !== -1) {
          let braceCount = 0;
          let endIdx = -1;

          for (let i = startIdx; i < cleanText.length; i++) {
            if (cleanText[i] === '{') braceCount++;
            else if (cleanText[i] === '}') {
              braceCount--;
              if (braceCount === 0) {
                endIdx = i + 1;
                break;
              }
            }
          }

          if (endIdx !== -1) {
            cleanText = cleanText.substring(startIdx, endIdx);
            Logger.info('GroqApiService', 'JSON extraído com sucesso', {
              length: cleanText.length,
            });
          } else {
            Logger.error('GroqApiService', 'JSON incompleto encontrado', {
              cleanText: cleanText.substring(0, 200),
            });
            throw new Error(VALIDATION_ERRORS.GROQ_RESPONSE_PARSING_FAILED);
          }
        } else {
          Logger.error('GroqApiService', 'Nenhum JSON encontrado na resposta', {
            cleanText: cleanText.substring(0, 100),
          });
          throw new Error(VALIDATION_ERRORS.GROQ_RESPONSE_PARSING_FAILED);
        }
      }

      const parsed = JSON.parse(cleanText);

      Logger.info('GroqApiService', LOGGING_MESSAGES.GROQ_RESPONSE_PARSED);
      return parsed;
    } catch (error) {
      Logger.error('GroqApiService', LOGGING_MESSAGES.GROQ_ERROR_PARSE, error);
      throw new Error(VALIDATION_ERRORS.GROQ_RESPONSE_PARSING_FAILED);
    }
  }

  async analyzeWithGroq(prompt: string): Promise<AnalysisResult> {
    try {
      Logger.info('GroqApiService', LOGGING_MESSAGES.GROQ_REQUEST_CREATING);

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.1-70b-versatile',
        max_tokens: 4000,
        temperature: 0.3,
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error(VALIDATION_ERRORS.EMPTY_GROQ_RESPONSE);
      }

      Logger.info('GroqApiService', LOGGING_MESSAGES.GROQ_RESPONSE_SUCCESS);

      return this.parseGroqResponse(responseContent);
    } catch (error) {
      Logger.error('GroqApiService', LOGGING_MESSAGES.GROQ_ERROR, error);
      throw new Error(VALIDATION_ERRORS.GROQ_RESPONSE_PARSING_FAILED);
    }
  }
}
