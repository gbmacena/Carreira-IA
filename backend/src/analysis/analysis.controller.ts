import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserPayload } from '../shared/types/auth.types';

@Controller('analysis')
@UseGuards(JwtAuthGuard)
export class AnalysisController {
  constructor(private analysisService: AnalysisService) {}

  @Get('history')
  @HttpCode(HttpStatus.OK)
  async getHistory(@CurrentUser() user: UserPayload) {
    return this.analysisService.getHistory(user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getAnalysis(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.analysisService.getAnalysis(id, user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteAnalysis(
    @Param('id') id: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.analysisService.deleteAnalysis(id, user.userId);
  }
}
