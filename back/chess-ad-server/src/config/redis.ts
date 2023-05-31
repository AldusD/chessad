import { createClient } from 'redis';

export const redisClient = createClient({ url: process.env.REDIS_URL });
export async function connectRedis () {
  try {
    await redisClient.connect();
  } catch (error) {
    console.log(error);
  }
}
