import faker from "@faker-js/faker";
import supertest from "supertest";
import httpStatus from "http-status";

import app, { init } from "../../src/app";
import { cleanDb } from "../helpers";
import { createUser, createSession } from "../factories";
import { createToken, TokenTypes } from "../../src/utils/token";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("GET /auth/token", () => {
  it("should respond with status 401 if no given token", async () => {
      const response = await server.get("/auth/token");
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  }); 

  it("should respond with status 401 if token is not valid", async () => {
    const token = faker.lorem.word();
    const response = await server.get("/auth/token").set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 200 and new tokens if token is valid", async () => {
    const user = await createUser();
    const token = await createToken({ userId: user.id, type: TokenTypes.refresh });
    const session = await createSession({ token, userId: user.id });
    
    const response = await server.get("/auth/token").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(typeof(response.body.token.accessToken)).toBe('string');
    expect(typeof(response.body.token.refreshToken)).toBe('string');
  }); 
});
