import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisProcessor } from './analysis.processor';
import { PrismaService } from '../prisma/prisma.service';
import { AIService } from './ai.service';
import { Job } from 'bullmq';
import * as fs from 'fs';

describe('AnalysisProcessor', () => {
  let processor: AnalysisProcessor;
  let prismaService: any;
  let aiService: jest.Mocked<AIService>;

  beforeEach(async () => {
    const mockPrisma = {
      analysis: {
        update: jest.fn(),
      },
    };
    const mockAi = {
      analyzeResume: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysisProcessor,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: AIService,
          useValue: mockAi,
        },
      ],
    }).compile();

    processor = module.get<AnalysisProcessor>(AnalysisProcessor);
    prismaService = module.get(PrismaService);
    aiService = module.get(AIService);
  });

  it('deve estar definido', () => {
    expect(processor).toBeDefined();
  });

  describe('process', () => {
    it('deve processar análise com sucesso', async () => {
      const job = {
        data: {
          analysisId: '1',
          filePath: '/path/to/file.pdf',
          jobDescription: 'desc',
          candidateLevel: 'JUNIOR',
        },
      } as Job;

      const analysisResult = {
        generalSummary: {
          overallOverview: 'summary',
          estimatedLevel: 'JUNIOR',
        },
        strengths: ['strength'],
        weaknesses: ['weakness'],
        suggestions: ['suggestion'],
        sectionFeedback: {},
        jobMatch: {},
        scores: {},
        overallScore: 85,
        atsScore: 70,
      };

      prismaService.analysis.update.mockResolvedValue({} as any);
      jest.spyOn(fs, 'readFileSync').mockReturnValue(Buffer.from('test'));
      aiService.analyzeResume.mockResolvedValue(analysisResult);

      const result = await processor.process(job);

      expect(result).toEqual({ success: true, analysisId: '1' });
      expect(prismaService.analysis.update).toHaveBeenCalledTimes(2);
      expect(aiService.analyzeResume).toHaveBeenCalledWith(
        '/path/to/file.pdf',
        'JUNIOR',
        'desc',
      );
    });

    it('deve lidar com erro de processamento', async () => {
      const job = {
        data: {
          analysisId: '1',
          filePath: '/path/to/file.pdf',
        },
      } as Job;

      prismaService.analysis.update.mockResolvedValue({} as any);
      jest.spyOn(fs, 'readFileSync').mockReturnValue(Buffer.from('test'));
      aiService.analyzeResume.mockRejectedValue(new Error('AI Error'));

      await expect(processor.process(job)).rejects.toThrow('AI Error');
      expect(prismaService.analysis.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'FAILED', errorMessage: expect.any(String) },
      });
    });
  });
});
