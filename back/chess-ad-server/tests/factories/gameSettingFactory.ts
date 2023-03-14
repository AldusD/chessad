import { GameSetting } from "@prisma/client";
import { prisma } from "../config";

export async function CreateGameSetting(params: Partial<GameSetting> = {}): Promise<GameSetting> {  
  const sides = ['black', 'white', 'random'];
  const time = params.time || Math.floor(Math.random() * 10)
  const increment = params.increment || Math.floor(Math.random() * 10)
  const side = params.side || sides[Math.floor(Math.random() * 3)];
  const userId = params.userId;
  
  try {
    const gameSetting = await prisma.gameSetting.create({
      data: {
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
