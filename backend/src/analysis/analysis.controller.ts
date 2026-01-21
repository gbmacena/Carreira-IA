import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserPayload } from '../shared/types/auth.types';

@Controller('analysis')
@UseGuards(JwtAuthGuard)
@ApiTags('analysis')
export class AnalysisController {
  constructor(private analysisService: AnalysisService) {}

  @Get('history')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'Histórico de análises retornado' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou expirado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async getHistory(@CurrentUser() user: UserPayload) {
    return this.analysisService.getHistory(user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Análise retornada com sucesso' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou expirado' })
  @ApiResponse({ status: 403, description: 'Acesso negado à análise' })
  @ApiResponse({ status: 404, description: 'Análise não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async getAnalysis(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.analysisService.getAnalysis(id, user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Análise deletada com sucesso' })
  @ApiResponse({ status: 401, description: 'Token JWT inválido ou expirado' })
  @ApiResponse({ status: 403, description: 'Acesso negado para deletar análise' })
  @ApiResponse({ status: 404, description: 'Análise não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async deleteAnalysis(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.analysisService.deleteAnalysis(id, user.userId);
  }
}
