import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  console.warn('Warning: UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is not set. Using fallback content.');
}

export const redis = url && token 
  ? new Redis({ url, token })
  : null;
