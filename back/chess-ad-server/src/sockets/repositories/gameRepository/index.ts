import { redisClient as redis } from "../../../config";

const EXPIRATION_TIME = 10 * 60 * 60;

export enum Results {
  WHITE = 'white',
  BLACK = 'black',
  TIE = 'tie',
}

export type Status = {
  whitePlayerTime: number,
  blackPlayerTime: number,
  lastMoveTimestamp: number,
  timeControl: number[],
  pgn: string,
}

function saveGamePosition (positionSavingData: { path: string, position: any } ) {
  const { path, position } = positionSavingData;  
  return redis.setEx(`position/${path}`, EXPIRATION_TIME, position);
}

function readGamePosition (path: string) {
  return redis.get(`position/${path}`);
}

function saveGameStatus (statusSavingData: { path: string, status: Status } ) {
  const { path, status } = statusSavingData;  
  return redis.setEx(`status/${path}`, EXPIRATION_TIME, JSON.stringify(status));
}

function readGameStatus (path: string) {
  return redis.get(`status/${path}`);
}

function saveGameResult (resultSavingData: { path: string, resultToken: string }) {
  const { path, resultToken } = resultSavingData;
  return redis.setEx(`result/${path}`, EXPIRATION_TIME, resultToken);
}

function readGameResult (path: string) {
  return redis.get(`result/${path}`);
}

function saveDrawOffer (DrawOfferSavingData: { path: string, side: Results.WHITE | Results.BLACK } ) {
  const { path, side } = DrawOfferSavingData;  
  return redis.setEx(`draw/${path}`, EXPIRATION_TIME, side);
}

function readDrawOffer (path: string) {
  return redis.get(`draw/${path}`);
}

function deleteDrawOffer (path: string) {
  return redis.del(`draw/${path}`);
}

const gameRepository = {
  saveGamePosition, readGamePosition,
  saveGameStatus, readGameStatus,
  saveGameResult, readGameResult,
  saveDrawOffer, readDrawOffer, deleteDrawOffer
};

export default gameRepository;