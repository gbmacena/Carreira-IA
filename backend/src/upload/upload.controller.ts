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
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../shared/guards/rate-limit.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserPayload, CandidateLevel } from '../shared/types/auth.types';

@Controller('upload')
@UseGuards(JwtAuthGuard, RateLimitGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
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
