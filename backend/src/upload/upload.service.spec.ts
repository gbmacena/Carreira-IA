import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { PrismaService } from '../prisma/prisma.service';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

describe('UploadService', () => {
  let service: UploadService;
  let prismaService: any;
  let analysisQueue: jest.Mocked<Queue>;

  beforeEach(async () => {
    const mockPrismaService = {
      analysis: {
        create: jest.fn(),
      },
    };

    const mockQueue = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: getQueueToken('analysis'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    prismaService = module.get(PrismaService);
    analysisQueue = module.get(getQueueToken('analysis'));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('deve fazer upload de arquivo com sucesso', async () => {
      const file = {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1000,
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      jest.spyOn(fs, 'writeFileSync').mockImplementation();
      prismaService.analysis.create.mockResolvedValue({
        id: '1',
        status: 'PENDING',
        createdAt: new Date(),
      });
      analysisQueue.add.mockResolvedValue({} as any);

      const result = await service.uploadFile(file, 'user1');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('status');
      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(prismaService.analysis.create).toHaveBeenCalled();
      expect(analysisQueue.add).toHaveBeenCalled();
    });

    it('deve lançar BadRequestException para tipo de arquivo inválido', async () => {
      const file = {
        originalname: 'test.txt',
        mimetype: 'text/plain',
        size: 1000,
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      await expect(service.uploadFile(file, 'user1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException para arquivo muito grande', async () => {
      const file = {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 10000000, // 10MB
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      await expect(service.uploadFile(file, 'user1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
