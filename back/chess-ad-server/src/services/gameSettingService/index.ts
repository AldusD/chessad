import { v4 as uuid } from 'uuid';
import { GameSetting } from "@prisma/client";
import gameSettingRepository from "../../repositories/gameSettingRepository";
import { createToken, PlayerTokenTypes } from "../../utils/token";
import { invalidPathError } from '../errors';
import gameService from '../gameService';

async function listGameSettings(): Promise<GameSetting[]> {
  await gameSettingRepository.deleteExpired();
  const games = await gameSettingRepository.findAll();
  return games;
}

async function listGameSettingByPath(path: string): Promise<GameSetting> {
  await gameSettingRepository.deleteExpired();
  const game = await gameSettingRepository.findByPath(path);
  if (!game.id) throw invalidPathError();
  return game;
}

export type GameSettingData = {
  time: number,
  increment: number,
  side: string,
  userId: string,
  path: string
}

export type GameSettingParams = Pick<GameSetting, "time" | "increment" | "side" | "userId">;

export type CreateGameSettingResponse = {
  path: string,
  playerToken: string
}

async function createGameSetting(gameSettingData: GameSettingParams): Promise<CreateGameSettingResponse> {
  const path = uuid();
  const playerToken = createToken({ type: PlayerTokenTypes.creatorPlayer, path }, '10d');
  const gameSetting = await gameSettingRepository.create({...gameSettingData, path});
  return { path: gameSetting.path, playerToken };
}

const gameSettingService = {
  listGameSettings,
  listGameSettingByPath,
  createGameSetting
}

export default gameSettingService;
