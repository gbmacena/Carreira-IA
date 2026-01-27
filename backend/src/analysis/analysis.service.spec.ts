import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService } from './analysis.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';

describe('AnalysisService', () => {
  let service: AnalysisService;
  let prismaService: any;

  beforeEach(async () => {
    const mockPrismaService = {
      analysis: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysisService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
    prismaService = module.get(PrismaService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('getAnalysis', () => {
    it('deve retornar análise se encontrada', async () => {
      const mockAnalysis = { id: '1', userId: 'user1' };
      prismaService.analysis.findFirst.mockResolvedValue(mockAnalysis);

      const result = await service.getAnalysis('1', 'user1');

      expect(result).toEqual(mockAnalysis);
      expect(prismaService.analysis.findFirst).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user1' },
      });
    });

    it('deve lançar NotFoundException se análise não encontrada', async () => {
      prismaService.analysis.findFirst.mockResolvedValue(null);

      await expect(service.getAnalysis('1', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getHistory', () => {
    it('deve retornar histórico de análises', async () => {
      const mockAnalyses = [
        {
          id: '1',
          userId: 'user1',
          fileName: 'file.pdf',
          status: 'COMPLETED',
          createdAt: new Date(),
          completedAt: new Date(),
          estimatedLevel: 'JUNIOR',
          errorMessage: null,
        },
      ];
      prismaService.analysis.findMany.mockResolvedValue(mockAnalyses);

      const result = await service.getHistory('user1');

      expect(result).toEqual(mockAnalyses);
      expect(prismaService.analysis.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        orderBy: { createdAt: 'desc' },
        select: expect.any(Object),
      });
    });
  });

  describe('deleteAnalysis', () => {
    it('deve deletar análise e arquivo', async () => {
      const mockAnalysis = {
        id: '1',
        userId: 'user1',
        filePath: '/path/to/file',
      };
      prismaService.analysis.findFirst.mockResolvedValue(mockAnalysis);
      prismaService.analysis.delete.mockResolvedValue(mockAnalysis);

      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'unlinkSync').mockImplementation();

      const result = await service.deleteAnalysis('1', 'user1');

      expect(result).toEqual({ message: 'Análise deletada com sucesso' });
      expect(prismaService.analysis.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(fs.unlinkSync).toHaveBeenCalledWith('/path/to/file');
    });

    it('deve lançar NotFoundException se análise não encontrada', async () => {
      prismaService.analysis.findFirst.mockResolvedValue(null);

      await expect(service.deleteAnalysis('1', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
