import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

function isConfigured() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

let _redis: Redis | null = null;
function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

let _authLimiter: Ratelimit | null = null;
let _apiLimiter: Ratelimit | null = null;

function getAuthLimiter(): Ratelimit {
  if (!_authLimiter) {
    _authLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      prefix: 'rl:auth',
    });
  }
  return _authLimiter;
}

function getApiLimiter(): Ratelimit {
  if (!_apiLimiter) {
    _apiLimiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(60, '1 m'),
      prefix: 'rl:api',
    });
  }
  return _apiLimiter;
}

const noopResult = { success: true as const, limit: 0, remaining: 0, reset: 0, pending: Promise.resolve() };

export const authRatelimit = {
  limit: (ip: string) => isConfigured() ? getAuthLimiter().limit(ip) : Promise.resolve(noopResult),
};

export const apiRatelimit = {
  limit: (ip: string) => isConfigured() ? getApiLimiter().limit(ip) : Promise.resolve(noopResult),
};
