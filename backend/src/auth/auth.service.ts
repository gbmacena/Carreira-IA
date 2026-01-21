import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { APP_CONFIG } from '../shared/config/app.config';
import { Logger } from '../shared/utils/logger.util';
import { VALIDATION_ERRORS } from '../shared/config/constants.config';
import { LOGGING_MESSAGES } from '../shared/config/logging.messages';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      Logger.info('AuthService', LOGGING_MESSAGES.AUTH_STARTING_REGISTRATION, {
        email: dto.email,
      });

      const existingUser = await this.findUserByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException(VALIDATION_ERRORS.EMAIL_IN_USE);
      }

      const hashedPassword = await this.hashPassword(dto.password);
      const user = await this.createUser(dto.name, dto.email, hashedPassword);
      const tokens = await this.generateTokens(user.id);

      Logger.info('AuthService', 'Registration completed successfully', {
        email: dto.email,
      });

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      Logger.error(
        'AuthService',
        LOGGING_MESSAGES.AUTH_ERROR_REGISTRATION,
        error,
      );
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(VALIDATION_ERRORS.REGISTRATION_FAILED);
    }
  }

  async login(dto: LoginDto) {
    try {
      Logger.info('AuthService', LOGGING_MESSAGES.AUTH_LOGIN_ATTEMPT, {
        email: dto.email,
      });

      const user = await this.validateUserCredentials(dto.email, dto.password);
      const tokens = await this.generateTokens(user.id);

      Logger.info('AuthService', LOGGING_MESSAGES.AUTH_LOGIN_SUCCESS, {
        email: dto.email,
      });

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      Logger.error('AuthService', LOGGING_MESSAGES.AUTH_ERROR_LOGIN, error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const tokenRecord = await this.findRefreshToken(refreshToken);
      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw new UnauthorizedException(VALIDATION_ERRORS.INVALID_TOKEN);
      }

      const tokens = await this.generateTokens(payload.sub);
      Logger.info('AuthService', 'Token refreshed successfully', {
        userId: payload.sub,
      });

      return tokens;
    } catch (error) {
      Logger.error('AuthService', LOGGING_MESSAGES.AUTH_ERROR_REFRESH, error);
      throw new UnauthorizedException(VALIDATION_ERRORS.INVALID_TOKEN);
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
      Logger.info('AuthService', LOGGING_MESSAGES.AUTH_LOGOUT_SUCCESS);
    } catch (error) {
      Logger.error('AuthService', LOGGING_MESSAGES.AUTH_ERROR_LOGOUT, error);
    }
  }

  private async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async createUser(
    name: string,
    email: string,
    hashedPassword: string,
  ) {
    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  private async validateUserCredentials(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(VALIDATION_ERRORS.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(VALIDATION_ERRORS.INVALID_CREDENTIALS);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  private async findRefreshToken(refreshToken: string) {
    return this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });
  }

  private async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: APP_CONFIG.JWT_ACCESS_EXPIRATION,
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: APP_CONFIG.JWT_REFRESH_EXPIRATION,
      },
    );

    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + APP_CONFIG.JWT_REFRESH_EXPIRATION_DAYS,
    );

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
