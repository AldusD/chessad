import { prisma } from "../../config";
import { GameSettingData } from "../../services/gameSettingService";

const TIME_TO_FADE = 1000 * 60 * 60 * 2;

async function deleteByPath(path: string) {
  return prisma.gameSetting.deleteMany({ where: { path } });
}

async function deleteExpired() {
  const expireTimeStamp = Date.now() - TIME_TO_FADE; 
  const expireDate = new Date(expireTimeStamp);
  
  return prisma.gameSetting.deleteMany({
      where: {
        createdAt: {
          lte: expireDate
        }
      }
    });
}

async function findAll() {
  return prisma.gameSetting.findMany({
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
  create,
  deleteExpired,
  deleteByPath
};

export default gameSettingRepository;
