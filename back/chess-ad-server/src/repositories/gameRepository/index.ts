import { prisma } from "../../config";
import { Game } from "@prisma/client";

type CreateGameParams = Pick<Game, 'time' | 'increment' | 'whitePlayerId' | 'blackPlayerId' | 'path' >;
type UpdateGameParams = Pick<Game, 'result' | 'pgn' | 'path' >;

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

async function findByPath(path: string) {
  try {
    const game = await prisma.game.findUnique({ 
      where: { 
        path 
      },
      include: {
        whitePlayer: {
          select: {
            email: true,
            username: true,
            profilePicture: true,
          }
        },
        blackPlayer: {
          select: {
            email: true,
            username: true,
            profilePicture: true,
          }
        }
      } 
    });
    return game;
  } catch (error) {
    console.log(error)
  }
}

async function findClosedByUsername(username: string) {
  try {
    const games = await prisma.game.findMany({ 
      where: {
        isOpen: false,
        OR: [
          {
            whitePlayer: {
              username
            }
          },
          {
            blackPlayer: {
              username
            }
          }
        ] 
      },
      include: {
        whitePlayer: {
          select: {
            email: true,
            username: true,
            profilePicture: true,
          }
        },
        blackPlayer: {
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
    return games;
  } catch (error) {
    console.log(error)
  }
}

async function findAllClosed() {
  try {
    const game = await prisma.game.findMany({ 
      where: { isOpen: false },
      include: {
        whitePlayer: {
          select: {
            email: true,
            username: true,
            profilePicture: true,
          }
        },
        blackPlayer: {
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
    return game;
  } catch (error) {
    console.log(error)
  }
}

async function updateByPath(finalGameParams: UpdateGameParams) {
  const { path, result, pgn } = finalGameParams;
  try {
    const game = await prisma.game.update({ 
      data: {
        result,
        pgn,
        isOpen: false
      },
      where: { 
        path 
      },
      include: {
        whitePlayer: {
          select: {
            email: true,
            username: true,
            profilePicture: true,
          }
        },
        blackPlayer: {
          select: {
            email: true,
            username: true,
            profilePicture: true,
          }
        }
      } 
    });
    return game;
  } catch (error) {
    console.log(error)
  }
}

const gameRepository = {
  create,
  findByPath,
  findClosedByUsername,
  findAllClosed,
  updateByPath
};

export default gameRepository;
