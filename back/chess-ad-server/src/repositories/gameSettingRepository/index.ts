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
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    });
    const filteredGames = games.filter(game => {
      const gameCreationTime = game.createdAt.getTime();
      const timeLimit = Date.now() - (1000 * 60 * 60 * 2);
      return gameCreationTime > timeLimit;
    })

    return filteredGames;
  } catch (error) {
    console.log(error);
  }  
};

async function findByPath(path: string) {
  try {
    const game = await prisma.gameSetting.findUnique({
      where: {
        path
      },      
      include: {
        user: {
          select: {
            email: true,
            username: true,
            profilePicture: true,
          }
        }
      },
    });
    return game;
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
  findByPath,
  create
};

export default gameSettingRepository;
