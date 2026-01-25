import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserPayload } from '../shared/types/auth.types';

@ApiTags('analysis')
@ApiBearerAuth()
@Controller('analysis')
@UseGuards(JwtAuthGuard)
export class AnalysisController {
  constructor(private analysisService: AnalysisService) {}

  @Get('history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lista o histórico de análises do usuário' })
  @ApiResponse({ status: 200, description: 'Histórico retornado com sucesso.' })
  async getHistory(@CurrentUser() user: UserPayload) {
    return this.analysisService.getHistory(user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Obtém uma análise específica pelo ID' })
  @ApiResponse({ status: 200, description: 'Análise retornada com sucesso.' })
  async getAnalysis(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.analysisService.getAnalysis(id, user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma análise pelo ID' })
  @ApiResponse({ status: 200, description: 'Análise removida com sucesso.' })
  async deleteAnalysis(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.analysisService.deleteAnalysis(id, user.userId);
  }
}
