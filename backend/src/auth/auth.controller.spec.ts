import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserPayload } from '../shared/types/auth.types';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockService = {
      register: jest.fn(),
      login: jest.fn(),
      refreshToken: jest.fn(),
      logout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('deve registrar usuário', async () => {
      const dto = { name: 'Test', email: 'test@example.com', password: 'pass' };
      const result = {
        user: {
          id: '1',
          name: 'Test',
          email: 'test@example.com',
          createdAt: new Date(),
        },
        accessToken: 'token',
        refreshToken: 'refresh',
      };
      service.register.mockResolvedValue(result);

      const response = await controller.register(dto);

      expect(response).toEqual(result);
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('deve fazer login do usuário', async () => {
      const dto = { email: 'test@example.com', password: 'pass' };
      const result = {
        user: {
          id: '1',
          name: 'Test',
          email: 'test@example.com',
          createdAt: new Date(),
        },
        accessToken: 'token',
        refreshToken: 'refresh',
      };
      service.login.mockResolvedValue(result);

      const response = await controller.login(dto);

      expect(response).toEqual(result);
      expect(service.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('refresh', () => {
    it('deve renovar token', async () => {
      const result = { accessToken: 'newToken', refreshToken: 'newRefresh' };
      service.refreshToken.mockResolvedValue(result);

      const response = await controller.refresh('refreshToken');

      expect(response).toEqual(result);
      expect(service.refreshToken).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('logout', () => {
    it('deve fazer logout do usuário', async () => {
      service.logout.mockResolvedValue(undefined);

      const response = await controller.logout('refreshToken');

      expect(response).toEqual({ message: 'Logout realizado com sucesso' });
      expect(service.logout).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('me', () => {
    it('deve retornar informações do usuário', async () => {
      const user: UserPayload = {
        userId: '1',
        name: 'Test',
        email: 'test@example.com',
      };

      const response = await controller.me(user);

      expect(response).toEqual({
        id: '1',
        name: 'Test',
        email: 'test@example.com',
      });
    });
  });
});
