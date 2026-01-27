import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserPayload } from '../shared/types/auth.types';

describe('AnalysisController', () => {
  let controller: AnalysisController;
  let service: jest.Mocked<AnalysisService>;

  beforeEach(async () => {
    const mockService = {
      getHistory: jest.fn(),
      getAnalysis: jest.fn(),
      deleteAnalysis: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalysisController],
      providers: [
        {
          provide: AnalysisService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AnalysisController>(AnalysisController);
    service = module.get(AnalysisService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('getHistory', () => {
    it('deve retornar histórico', async () => {
      const mockHistory = [
        {
          id: '1',
          fileName: 'file.pdf',
          status: 'COMPLETED' as any,
          createdAt: new Date(),
          completedAt: new Date(),
          estimatedLevel: 'JUNIOR',
          errorMessage: null,
        },
      ];
      service.getHistory.mockResolvedValue(mockHistory as any);
      const user: UserPayload = {
        userId: 'user1',
        name: 'User',
        email: 'user@example.com',
      };

      const result = await controller.getHistory(user);

      expect(result).toEqual(mockHistory);
      expect(service.getHistory).toHaveBeenCalledWith('user1');
    });
  });

  describe('getAnalysis', () => {
    it('deve retornar análise', async () => {
      const mockAnalysis = { id: '1', userId: 'user1' };
      service.getAnalysis.mockResolvedValue(mockAnalysis as any);
      const user: UserPayload = {
        userId: 'user1',
        name: 'User',
        email: 'user@example.com',
      };

      const result = await controller.getAnalysis('1', user);

      expect(result).toEqual(mockAnalysis);
      expect(service.getAnalysis).toHaveBeenCalledWith('1', 'user1');
    });
  });

  describe('deleteAnalysis', () => {
    it('deve deletar análise', async () => {
      const mockResult = { message: 'Deleted' };
      service.deleteAnalysis.mockResolvedValue(mockResult);
      const user: UserPayload = {
        userId: 'user1',
        name: 'User',
        email: 'user@example.com',
      };

      const result = await controller.deleteAnalysis('1', user);

      expect(result).toEqual(mockResult);
      expect(service.deleteAnalysis).toHaveBeenCalledWith('1', 'user1');
    });
  });
});
