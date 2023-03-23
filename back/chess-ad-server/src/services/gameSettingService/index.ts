import { v4 as uuid } from 'uuid';
import { GameSetting } from "@prisma/client";
import gameSettingRepository from "../../repositories/gameSettingRepository";

async function listGameSettings(): Promise<GameSetting[]> {
  const games = await gameSettingRepository.findAll();
  return games;
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
  console.log(path)
  const gameSetting = await gameSettingRepository.create({...gameSettingData, path});
  return gameSetting.path;
}

const gameSettingService = {
  listGameSettings,
  createGameSetting
}

export default gameSettingService;
