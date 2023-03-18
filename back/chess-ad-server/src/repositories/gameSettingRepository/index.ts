import { prisma } from "../../config";
import { Prisma } from "@prisma/client";

async function findAll() {
  try {
    const games = await prisma.gameSetting.findMany();
    const filteredGames = games.filter(game => {
      const gameCreationTime = game.createdAt.getTime();
      const timeLimit = Date.now() - (1000 * 60 * 60 * 2);
      return gameCreationTime > timeLimit; 
      console.log(gameCreationTime)

    })

    return filteredGames;
  } catch (error) {
    console.log(error);
  }  
};

const gameSettingRepository = {
  findAll 
};

export default gameSettingRepository;
