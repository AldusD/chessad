import { prisma } from "../../config";
import { Game } from "@prisma/client";

type CreateGameParams = Pick<Game, 'time' | 'increment' | 'whitePlayerId' | 'blackPlayerId' | 'path' >

async function create(gameSettingData: CreateGameParams) { 
  try {
    const game = await prisma.game.create({
      data: gameSettingData
    });
    return game;
  } catch (error) {
    console.log(error);
  }
}

const gameRepository = {
  create
};

export default gameRepository;
