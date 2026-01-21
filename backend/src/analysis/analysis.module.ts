import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { AnalysisProcessor } from './analysis.processor';
import { AIService } from './ai.service';
import { PdfParsingService } from './services/pdf-parsing.service';
import { PromptBuilderService } from './services/prompt-builder.service';
import { ScoreCalculationService } from './services/score-calculation.service';
import { GroqApiService } from './services/groq-api.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'analysis',
    }),
  ],
  controllers: [AnalysisController],
  providers: [
    AnalysisService,
    AnalysisProcessor,
    AIService,
    PdfParsingService,
    PromptBuilderService,
    ScoreCalculationService,
    GroqApiService,
  ],
})
export class AnalysisModule {}
