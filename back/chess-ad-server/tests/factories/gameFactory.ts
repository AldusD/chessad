import faker from "@faker-js/faker";
import { Game } from "@prisma/client";
import { prisma } from "../../src/config";

export async function createGame(params: Partial<Game> = {}): Promise<Game> {  
  const results = ['1-0', '1/2-1/2', '0-1'];
  
  const result = params.result || results[Math.floor(Math.random() * 3)];
  const pgn = params.pgn || faker.lorem.word();
  const path = params.path || faker.internet.password();
  const isOpen = params.isOpen || 0; // default value work as false
  const time = params.time || Math.floor(Math.random() * 10)
  const increment = params.increment || Math.floor(Math.random() * 10)
  const createdAt = params.createdAt || new Date(Date.now());
  const whitePlayerId = params.whitePlayerId;
  const blackPlayerId = params.blackPlayerId;

  
  try {
    const game = await prisma.game.create({
      data: {
        pgn,
        path,
        isOpen: !!isOpen,
        time,
        increment,
        createdAt,
        whitePlayerId,
        blackPlayerId
      },
    });
    return game; 
  } catch (error) {
    console.log(error);
  }
}
