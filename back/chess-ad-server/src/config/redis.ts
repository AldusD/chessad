import { createClient } from 'redis';

export const redisClient = createClient();
export async function connectRedis () {
  try {
    await redisClient.connect();
  } catch (error) {
    console.log(error);
  }
}
