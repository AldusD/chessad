import { redisClient as redis } from "../../../config";

async function createSillyData () {
    return redis.set('banana', 'nanica');
}

async function readSillyData () {
    return redis.get('banana');
}

const gameRepository = {
  createSillyData,
  readSillyData
};

export default gameRepository;