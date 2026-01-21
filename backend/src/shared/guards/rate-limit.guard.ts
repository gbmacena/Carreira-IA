import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RateLimiterService } from '../services/rate-limiter.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private rateLimiter: RateLimiterService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const userId = request.user?.userId;

    if (!userId) {
      throw new HttpException(
        'Usuário não autenticado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!this.rateLimiter.isAllowed(userId)) {
      const resetTime = this.rateLimiter.getResetTime(userId);
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

      response.set('Retry-After', retryAfter.toString());

      throw new HttpException(
        `Muitas requisições. Tente novamente em ${retryAfter} segundos.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const remaining = this.rateLimiter.getRemainingRequests(userId);
    response.set('X-RateLimit-Remaining', remaining.toString());

    return true;
  }
}
