import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorHandler {
  static handleError(error: any, context: string): never {
    console.error(`[${context}] Error occurred:`, error);

    if (error instanceof HttpException) {
      throw error;
    }

    if (error.message && typeof error.message === 'string') {
      const message = error.message.toLowerCase();

      if (
        message.includes('token') ||
        message.includes('quota') ||
        message.includes('rate limit')
      ) {
        throw new HttpException(
          'Limite de análises atingido ou erro de autenticação com serviço de IA. Tente novamente mais tarde.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      if (
        message.includes('pdf') ||
        message.includes('parse') ||
        message.includes('extract')
      ) {
        throw new HttpException(
          'Erro ao processar o PDF. Verifique se o arquivo está corrompido.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (message.includes('invalid') || message.includes('currículo')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      if (
        message.includes('network') ||
        message.includes('timeout') ||
        message.includes('econnrefused')
      ) {
        throw new HttpException(
          'Erro de conexão com serviço de IA. Tente novamente em alguns minutos.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
    }

    if (error.code === 'P2002') {
      throw new HttpException('Recurso já existe', HttpStatus.CONFLICT);
    }

    if (error.code === 'P2025') {
      throw new HttpException('Recurso não encontrado', HttpStatus.NOT_FOUND);
    }

    if (error.name === 'ValidationError') {
      throw new HttpException(
        'Dados de entrada inválidos',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Mensagem de erro genérica mas informativa
    const errorMessage =
      error.message || 'Erro desconhecido ao processar a análise';
    throw new HttpException(
      `Erro ao analisar currículo: ${errorMessage}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
