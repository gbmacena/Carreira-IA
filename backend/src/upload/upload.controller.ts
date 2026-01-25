import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../shared/guards/rate-limit.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserPayload, CandidateLevel } from '../shared/types/auth.types';

@ApiTags('upload')
@ApiBearerAuth()
@Controller('upload')
@UseGuards(JwtAuthGuard, RateLimitGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Faz upload de currículo para análise' })
  @ApiResponse({ status: 201, description: 'Upload realizado com sucesso.' })
  @ApiBody({
    description: 'Arquivo de currículo, descrição da vaga e nível do candidato',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        jobDescription: { type: 'string' },
        candidateLevel: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: UserPayload,
    @Body('jobDescription') jobDescription?: string,
    @Body('candidateLevel') candidateLevel?: CandidateLevel,
  ) {
    return this.uploadService.uploadFile(
      file,
      user.userId,
      jobDescription,
      candidateLevel,
    );
  }
}
