import { v4 as uuid } from 'uuid';
import { GameSetting } from "@prisma/client";
import gameSettingRepository from "../../repositories/gameSettingRepository";

async function listGameSettings(): Promise<GameSetting[]> {
  const games = await gameSettingRepository.findAll();
  return games;
}



type GameSettingData = {
  time: number,
  increment: number,
  side: string,
  userId: string
}

async function createGameSetting(gameSettingData: GameSettingData): Promise<string> {
  const gameSetting = await gameSettingRepository.create(gameSettingData);
}

const gameSettingService = {
  listGameSettings,
  createGameSetting
}

export default gameSettingService;
