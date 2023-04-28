import { v4 as uuid } from 'uuid';
import { GameSetting } from "@prisma/client";
import gameSettingRepository from "../../repositories/gameSettingRepository";
import { invalidPath } from './errors';

async function listGameSettings(): Promise<GameSetting[]> {
  const games = await gameSettingRepository.findAll();
  return games;
}

async function listGameSettingByPath(path: string): Promise<GameSetting> {
  const game = await gameSettingRepository.findByPath(path);
  if (!game.id) throw invalidPath();
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

async function createGameSetting(gameSettingData: GameSettingParams): Promise<string> {
  const path = uuid();
  const gameSetting = await gameSettingRepository.create({...gameSettingData, path});
  return gameSetting.path;
}

const gameSettingService = {
  listGameSettings,
  listGameSettingByPath,
  createGameSetting
}

export default gameSettingService;
