import { Game, GameSetting } from "@prisma/client";

export type CreatingGameParams = {
  gameSettingData: GameSetting,
  joinedUserId: string
};

async function createGame(creatingGameParams: CreatingGameParams) {

}

const gameService = {
  createGame
};

export default gameService;