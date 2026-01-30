import { Injectable } from '@nestjs/common';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimiterService {
  private readonly store = new Map<string, RateLimitRecord>();
  private readonly WINDOW_MS = 24 * 60 * 60 * 1000;
  private readonly MAX_REQUESTS = 5;

  isAllowed(userId: string): boolean {
    const now = Date.now();
    const record = this.store.get(userId);

    if (!record || now > record.resetTime) {
      this.store.set(userId, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      });
      return true;
    }

    if (record.count < this.MAX_REQUESTS) {
      record.count++;
      return true;
    }

    return false;
  }

  getRemainingRequests(userId: string): number {
    const record = this.store.get(userId);
    if (!record || Date.now() > record.resetTime) {
      return this.MAX_REQUESTS;
    }
    return Math.max(0, this.MAX_REQUESTS - record.count);
  }

  getResetTime(userId: string): number {
    const record = this.store.get(userId);
    if (!record) {
      return Date.now();
    }
    return record.resetTime;
  }
}
