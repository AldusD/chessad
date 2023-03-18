import faker from "@faker-js/faker";
import { GameSetting } from "@prisma/client";
import { prisma } from "../../src/config";

export async function createGameSetting(params: Partial<GameSetting> = {}): Promise<GameSetting> {  
  const sides = ['black', 'white', 'random'];
  const time = params.time || Math.floor(Math.random() * 10)
  const increment = params.increment || Math.floor(Math.random() * 10)
  const side = params.side || sides[Math.floor(Math.random() * 3)];
  const userId = params.userId;
  const path = params.path || faker.internet.password();
  
  try {
    const gameSetting = await prisma.gameSetting.create({
      data: {
        path,
        userId,
        side,
        increment,
        time
      },
    });
    return gameSetting; 
  } catch (error) {
    console.log(error);
  }
}
