import { prisma } from "../../config";
import { GameSettingData } from "../../services/gameSettingService";

async function findAll() {
  try {
    const games = await prisma.gameSetting.findMany({
      include: {
        user: {
          select: {
            email: true,
            username: true,
            profilePicture: true,
          }
        }
      }
    });
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

async function create(gameSettingData: GameSettingData) { 
  try {
    const game = await prisma.gameSetting.create({
      data: gameSettingData
    });
    return game;
  } catch (error) {
    console.log(error);
  }
}

const gameSettingRepository = {
  findAll,
  create
};

export default gameSettingRepository;
