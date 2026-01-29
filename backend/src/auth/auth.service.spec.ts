import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: any;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      refreshToken: {
        findUnique: jest.fn(),
        create: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('deve registrar um novo usuário', async () => {
      const dto = { name: 'Test', email: 'test@example.com', password: 'pass' };
      prismaService.user.findUnique.mockResolvedValue(null);
      jest.spyOn(bcryptjs, 'hash').mockImplementation(async () => 'hashed');
      prismaService.user.create.mockResolvedValue({
        id: '1',
        name: 'Test',
        email: 'test@example.com',
        createdAt: new Date(),
      });
      jwtService.sign.mockReturnValue('token');

      const result = await service.register(dto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('deve lançar ConflictException se email em uso', async () => {
      const dto = { name: 'Test', email: 'test@example.com', password: 'pass' };
      prismaService.user.findUnique.mockResolvedValue({ id: '1' } as any);

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('deve fazer login do usuário', async () => {
      const dto = { email: 'test@example.com', password: 'pass' };
      const user = {
        id: '1',
        name: 'Test',
        email: 'test@example.com',
        password: 'hashed',
        createdAt: new Date(),
      };
      prismaService.user.findUnique.mockResolvedValue(user);
      jest.spyOn(bcryptjs, 'compare').mockImplementation(async () => true);
      jwtService.sign.mockReturnValue('token');

      const result = await service.login(dto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('deve lançar UnauthorizedException para credenciais inválidas', async () => {
      const dto = { email: 'test@example.com', password: 'pass' };
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('deve atualizar token', async () => {
      const refreshToken = 'refresh';
      jwtService.verify.mockReturnValue({ sub: '1' });
      prismaService.refreshToken.findUnique.mockResolvedValue({
        expiresAt: new Date(Date.now() + 10000),
      } as any);
      jwtService.sign.mockReturnValue('newToken');

      const result = await service.refreshToken(refreshToken);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('deve lançar UnauthorizedException para token inválido', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error();
      });

      await expect(service.refreshToken('invalid')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('deve fazer logout do usuário', async () => {
      prismaService.refreshToken.deleteMany.mockResolvedValue({
        count: 1,
      } as any);

      await service.logout('token');

      expect(prismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { token: 'token' },
      });
    });
  });
});
