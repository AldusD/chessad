import { Game, GameSetting } from "@prisma/client";
import gameSettingRepository from "../../repositories/gameSettingRepository";
import gameRepository from "../../repositories/gameRepository";
import { PlayerTokenTypes, createToken } from "../../utils/token";

type CreateGameParams = {
    userId: string,
    path: string
  }

async function createGame(createGameParams: CreateGameParams) {
  const { path, userId } = createGameParams;

  const gameSetting = await gameSettingRepository.findByPath(path);
  const { time, increment, side } = gameSetting;
  const teams = setPlayersTeams({ creatorUserId: gameSetting.userId, joiningUserId: userId, side });

  const game = await gameRepository.create({ path, time, increment, whitePlayerId: teams[0], blackPlayerId: teams[1] });
  await gameSettingRepository.deleteByPath(path);
  
  const playerToken = createToken({ type: PlayerTokenTypes.joiningPlayer, path }, '10d');
  return playerToken;
}

type TeamsData = {
  creatorUserId: string,
  joiningUserId: string,
  side: string
}

function setPlayersTeams(teamsData: TeamsData) {
  const { side, creatorUserId, joiningUserId } = teamsData;
  if (side === 'white') return [creatorUserId, joiningUserId];
  if (side === 'black') return [joiningUserId, creatorUserId];

  const index = Math.floor(Math.random() * 2);
  const teams = [creatorUserId, creatorUserId];
  teams[index] = joiningUserId;
  return teams;
}

const gameService = {
  createGame
};

export default gameService;