import { Game, GameSetting } from "@prisma/client";
import jwt from "jsonwebtoken";
import gameSettingRepository from "../../repositories/gameSettingRepository";
import gameRepository from "../../repositories/gameRepository";
import { cannotJoinGameError, invalidPathError, unprocessableEntityError, invalidTokenError } from "../errors";
import { PlayerTokenTypes, Results, Teams, createToken, getTokenDataOrFail } from "../../utils/token";

type JoinGameParams = {
    userId: string,
    path: string
  }

async function createGame(createGameParams: JoinGameParams) {
  const { path, userId } = createGameParams;

  if (!path) throw unprocessableEntityError('Path is required');
  
  const gameSetting = await gameSettingRepository.findByPath(path);
  if (!gameSetting) throw invalidPathError();
  if (userId === gameSetting.userId) throw cannotJoinGameError('User can not join its own game');
  
  const { time, increment, side } = gameSetting;
  const teams = setPlayersTeams({ creatorUserId: gameSetting.userId, joiningUserId: userId, side });


  const game = await gameRepository.create({ path, time, increment, whitePlayerId: teams[0], blackPlayerId: teams[1] });
  await gameSettingRepository.deleteByPath(path);
  
  const playerToken = createToken({ type: PlayerTokenTypes.joiningPlayer, path, timeControl: [gameSetting.time, gameSetting.increment] }, '10d');
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

async function listGameByPath(path: string): Promise<Game> {
  const game = await gameRepository.findByPath(path);
  if (!game) throw invalidPathError();
  return game;
}

async function sendPlayerToken(getTokenData: JoinGameParams): Promise<string> {
  const { path, userId } = getTokenData;
  
  const game = await gameRepository.findByPath(path);
  if (!game) throw invalidPathError();
  if(userId !== game.whitePlayerId && userId !== game.blackPlayerId) throw cannotJoinGameError('User is not signed as player of this game');
  const team = (userId === game.whitePlayerId) ? Teams.white : Teams.black;
  const playerToken = createToken({ type: PlayerTokenTypes.joiningPlayer, path, team, timeControl: [game.time, game.increment] }, '10d');

  return playerToken;
}

type ResultTokenData = {
  pgn: string,
  result: Results,
  path: string
}

type TokenVerificationResult = {
  tokenData?: ResultTokenData,
  error?: Error 
}

const verifyPlayerToken = (resultToken: string): TokenVerificationResult => {
  if (!resultToken) return { error: Error('Result token invalid or expired') };  
  
  const result = {} as TokenVerificationResult;
  
  getTokenDataOrFail(resultToken, (error: jwt.JsonWebTokenError, tokenData: ResultTokenData) => {
    if (error || !tokenData.path) return result.error = Error('Player token invalid or expired');
    return result.tokenData = tokenData;
  })
  return result;
}

async function finishGame(resultToken: string): Promise<Game> {
  const { tokenData, error } = verifyPlayerToken(resultToken);
  if (error) throw invalidTokenError();
  const { path, result, pgn } = tokenData;

  const game = await gameRepository.updateByPath({ path, result, pgn });
  if (!game) throw invalidPathError();  

  return game;
}

const gameService = {
  createGame,
  listGameByPath,
  sendPlayerToken,
  finishGame
};

export default gameService;