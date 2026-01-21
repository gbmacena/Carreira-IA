import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { RateLimiterService } from '../shared/services/rate-limiter.service';
import { RateLimitGuard } from '../shared/guards/rate-limit.guard';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'analysis',
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, RateLimiterService, RateLimitGuard],
})
export class UploadModule {}
