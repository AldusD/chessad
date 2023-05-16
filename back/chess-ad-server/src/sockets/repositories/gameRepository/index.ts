import { redisClient as redis } from "../../../config";

const EXPIRATION_TIME = 10 * 60 * 60;

function saveGamePosition (positionSavingData: { path: string, position: any } ) {
  const { path, position } = positionSavingData;  
  return redis.setEx(`position/${path}`, EXPIRATION_TIME, position);
}

function readGamePosition (path: string) {
  return redis.get(`position/${path}`);
}

export enum Results {
  WHITE = 'whtie',
  BLACK = 'black',
  TIE = 'tie',
  ONGOING = 'ongoing'
}

export type Status = {
  whitePlayerTime: number,
  blackPlayerTime: number,
  lastMoveTimestamp: number,
  result: Results
  timeControl: number[] 
}

function saveGameStatus (statusSavingData: { path: string, status: Status } ) {
  const { path, status } = statusSavingData;  
  return redis.setEx(`status/${path}`, EXPIRATION_TIME, JSON.stringify(status));
}

function readGameStatus (path: string) {
  return redis.get(`status/${path}`);
}

const gameRepository = {
  saveGamePosition,
  readGamePosition,
  saveGameStatus,
  readGameStatus
};

export default gameRepository;