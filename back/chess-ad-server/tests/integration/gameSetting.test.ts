import faker from "@faker-js/faker";
import supertest from "supertest";
import httpStatus from "http-status";

import app, { init } from "../../src/app";
import { cleanDb } from "../helpers";
import { createUser, createGameSetting } from "../factories";
import { createToken, TokenTypes } from "../../src/utils/token";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("GET /game-setting", () => {
  it("should respond with status 200 and an empty array", async () => {
      const response = await server.get("/game-setting");
  
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.games).toEqual([]);
  });

  it("should respond with status 200 and an empty array (expired game settings)", async () => {
    const user = await createUser();
    const expiredDate = new Date(Date.now() - (1000 * 60 * 60 * 10));
    const gameSetting = await createGameSetting({ userId: user.id, createdAt: expiredDate });
    const response = await server.get("/game-setting");

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.games).toEqual([]);
  }); 

  it("should respond with status 200 and the correspondent data", async () => {
      const user = await createUser();
      const gameSetting = await createGameSetting({ userId: user.id });
      const response = await server.get("/game-setting");

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.games).toEqual([
        { 
          ...gameSetting, 
          createdAt: gameSetting.createdAt.toISOString(), 
          user: {
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture
          }
        }]);
  }); 
});

describe("POST /game-setting", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/game-setting");
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });  

  it("should respond with status 401 if given access token is not valid", async () => {
    const accessToken = faker.lorem.word();
    const response = await server.post("/game-setting").set("Authorization", `Bearer ${accessToken}`);  
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 422 when body is not given", async () => {
        const user = await createUser();
        const accessToken = createToken({ userId: user.id, type: TokenTypes.access });
        const response = await server.post("/game-setting").set("Authorization", `Bearer ${accessToken}`);
        
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
      });
    
    it("should respond with status 422 when body is not valid", async () => {
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
      const user = await createUser();
      const accessToken = createToken({ userId: user.id, type: TokenTypes.access });
      const response = await server.post("/game-setting")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(invalidBody);

      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    describe("when body is valid", () => {        
      const generateValidBody = () => {
        const sides = ['black', 'white', 'random'];
        return {
          time: Math.floor(Math.random() * 10),
          increment: Math.floor(Math.random() * 10),
          side: sides[Math.floor(Math.random() * 3)]
        }
      };
  
      it("should respond with status 201 and corresponding data", async () => {
        const user = await createUser();
        const body = generateValidBody();
        const accessToken = createToken({ userId: user.id, type: TokenTypes.access });  
        const response = await server.post("/game-setting")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(body);
  
        expect(response.status).toBe(httpStatus.CREATED);
        expect(typeof(response.body.path)).toBe('string');
        expect(typeof(response.body.playerToken)).toBe('string');
      });
    });
  });
});

describe("GET /game-setting/:path", () => {
  it("should respond with status 410 if there is no active game setting for this path", async () => {
      const invalidPath = faker.lorem.word();
      const response = await server.get(`/game-setting/${invalidPath}`);
      expect(response.status).toBe(httpStatus.GONE);
  }); 

  it("should respond with status 200 and the correspondent data", async () => {
      const user = await createUser();
      const gameSetting = await createGameSetting({ userId: user.id });
      const response = await server.get(`/game-setting/${gameSetting.path}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.game).toEqual(
        { 
          ...gameSetting, 
          createdAt: gameSetting.createdAt.toISOString(), 
          user: {
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture
          }
        });
  }); 
});