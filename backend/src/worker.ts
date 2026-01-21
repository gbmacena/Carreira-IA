import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AnalysisProcessor } from './analysis/analysis.processor';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const processor = app.get(AnalysisProcessor);

  console.log('🔄 Worker iniciado e aguardando jobs...');
}

bootstrap();
