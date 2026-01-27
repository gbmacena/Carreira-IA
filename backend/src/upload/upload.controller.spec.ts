import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from '../shared/guards/rate-limit.guard';
import { UserPayload } from '../shared/types/auth.types';

describe('UploadController', () => {
  let controller: UploadController;
  let service: jest.Mocked<UploadService>;

  beforeEach(async () => {
    const mockService = {
      uploadFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RateLimitGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get(UploadService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('deve fazer upload de arquivo', async () => {
      const file = { originalname: 'test.pdf' } as Express.Multer.File;
      const user: UserPayload = {
        userId: '1',
        name: 'User',
        email: 'user@example.com',
      };
      const result = {
        id: '1',
        status: 'PENDING' as any,
        createdAt: new Date(),
      };
      service.uploadFile.mockResolvedValue(result as any);

      const response = await controller.uploadFile(
        file,
        user,
        'desc',
        'JUNIOR',
      );

      expect(response).toEqual(result);
      expect(service.uploadFile).toHaveBeenCalledWith(
        file,
        '1',
        'desc',
        'JUNIOR',
      );
    });
  });
});
