import faker from "@faker-js/faker";
import supertest from "supertest";
import httpStatus from "http-status";

import app, { init } from "../../src/app";
import { prisma } from "../../src/config";
import { cleanDb } from "../helpers";
import { createUser, createGameSetting, createGame } from "../factories";
import { createToken, TokenTypes } from "../../src/utils/token";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /game/join", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post(`/game/join`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });  
  
  it("should respond with status 401 if given access token is not valid", async () => {
    const accessToken = faker.lorem.word();
    const response = await server.post(`/game/join`).set("Authorization", `Bearer ${accessToken}`);  
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  describe("when token is valid", () => {
    it("should respond with status 422 if no path given", async () => {
      const user = await createUser();
      const accessToken = createToken({ userId: user.id, type: TokenTypes.access });
      const response = await server.post(`/game/join`).set("Authorization", `Bearer ${accessToken}`);
      
      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    }); 

    it("should respond with status 410 if there is no active game setting for path given", async () => {
      const user = await createUser();
      const accessToken = createToken({ userId: user.id, type: TokenTypes.access });
      const invalidPath = faker.lorem.word();
      const response = await server.post(`/game/join`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ path: invalidPath });
      
      expect(response.status).toBe(httpStatus.GONE);
    }); 

    describe("when body is valid", () => {
      it("should respond with status 403 if access token refers to the creator of the game setting", async () => {
        const user = await createUser();
        const accessToken = createToken({ userId: user.id, type: TokenTypes.access });
        const gameSetting = await createGameSetting({ userId: user.id });
        const response = await server.post(`/game/join`)
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ path: gameSetting.path });
      
        expect(response.status).toBe(httpStatus.FORBIDDEN);
      }); 
    
      it("should respond with status 201 and playerToken", async () => {
        const JoiningUser = await createUser();
        const creatorUser = await createUser();
        const accessToken = createToken({ userId: JoiningUser.id, type: TokenTypes.access });
        const gameSetting = await createGameSetting({ userId: creatorUser.id });
        const response = await server.post(`/game/join`)
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ path: gameSetting.path });

        const checkGameSetting = await prisma.gameSetting.findUnique({ where: { path: gameSetting.path } });
        
        expect(checkGameSetting).toBeNull();
        expect(response.status).toBe(httpStatus.CREATED);
        expect(typeof(response.body.playerToken)).toBe('string');
      }); 
    })
  });
});

describe("GET /game/:path", () => {
  it("should respond with status 404 if there is no game for path given", async () => {
    const invalidPath = faker.lorem.word();
    const response = await server.get(`/game/${invalidPath}`);
    
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  }); 

  it("should respond with status 200 and corresponding data", async () => {
    const whitePlayer = await createUser();
    const blackPlayer = await createUser();
    const whitePlayerId = whitePlayer.id;
    const blackPlayerId = blackPlayer.id;
    const game = await createGame({ whitePlayerId, blackPlayerId });
    
    const response = await server.get(`/game/${game.path}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.game).toEqual(
      { 
        ...game, 
        createdAt: game.createdAt.toISOString(), 
        whitePlayer: {
          username: whitePlayer.username,
          email: whitePlayer.email,
          profilePicture: whitePlayer.profilePicture
        },
        blackPlayer: {
          username: blackPlayer.username,
          email: blackPlayer.email,
          profilePicture: blackPlayer.profilePicture
        }
      });
  }); 

});
  
describe("GET /game/:path/token", () => {
  it("should respond with status 401 if no token is given", async () => {
    const whitePlayer = await createUser();
    const blackPlayer = await createUser();
    const whitePlayerId = whitePlayer.id;
    const blackPlayerId = blackPlayer.id;
    const game = await createGame({ whitePlayerId, blackPlayerId });
    const response = await server.get(`/game/${game.path}/token`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });  
  
  it("should respond with status 401 if given access token is not valid", async () => {
    const whitePlayer = await createUser();
    const blackPlayer = await createUser();
    const whitePlayerId = whitePlayer.id;
    const blackPlayerId = blackPlayer.id;
    const game = await createGame({ whitePlayerId, blackPlayerId });
    const accessToken = faker.lorem.word();

    const response = await server.get(`/game/${game.path}/token`).set("Authorization", `Bearer ${accessToken}`);  
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 if there is no game for path given", async () => {
      const user = await createUser();
      const invalidPath = faker.lorem.word();
      const accessToken = createToken({ userId: user.id, type: TokenTypes.access });

      const response = await server.get(`/game/${invalidPath}/token`).set("Authorization", `Bearer ${accessToken}`);  
      
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 403 if user is not signed as one of the players", async () => {
      const whitePlayer = await createUser();
      const blackPlayer = await createUser();
      const whitePlayerId = whitePlayer.id;
      const blackPlayerId = blackPlayer.id;
      const game = await createGame({ whitePlayerId, blackPlayerId });
      const user = await createUser();
      const accessToken = createToken({ userId: user.id, type: TokenTypes.access });

      const response = await server.get(`/game/${game.path}/token`).set("Authorization", `Bearer ${accessToken}`);  
      
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("should respond with status 200 and corresponding data (player as white)", async () => {
      const whitePlayer = await createUser();
      const blackPlayer = await createUser();
      const whitePlayerId = whitePlayer.id;
      const blackPlayerId = blackPlayer.id;
      const game = await createGame({ whitePlayerId, blackPlayerId });
      const accessToken = createToken({ userId: whitePlayerId, type: TokenTypes.access });

      const response = await server.get(`/game/${game.path}/token`).set("Authorization", `Bearer ${accessToken}`);  
      
      expect(response.status).toBe(httpStatus.OK);
      expect(typeof(response.body.token)).toBe('string');
    });

    it("should respond with status 200 and corresponding data (player as black)", async () => {
      const whitePlayer = await createUser();
      const blackPlayer = await createUser();
      const whitePlayerId = whitePlayer.id;
      const blackPlayerId = blackPlayer.id;
      const game = await createGame({ whitePlayerId, blackPlayerId });
      const accessToken = createToken({ userId: blackPlayerId, type: TokenTypes.access });

      const response = await server.get(`/game/${game.path}/token`).set("Authorization", `Bearer ${accessToken}`);  
      
      expect(response.status).toBe(httpStatus.OK);
      expect(typeof(response.body.token)).toBe('string');
    });
  })
});
