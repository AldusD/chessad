import faker from "@faker-js/faker";
import supertest from "supertest";
import httpStatus from "http-status";

import app, { init } from "../../src/app";
import { cleanDb } from "../helpers";
import { createUser, createSession } from "../factories";
import { prisma } from "../../src/config";
import { TokenTypes, createToken } from "../../src/utils/token";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /auth/sign-in", () => {
  it("should respond with status 422 when body is not given", async () => {
    const response = await server.post("/auth/sign-in");
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should respond with status 422 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/auth/sign-in").send(invalidBody);

    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  describe("when body is valid", () => {
    const generateValidBody = () => ({
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(6),
    });

    it("should respond with status 401 if there is no user for given email", async () => {
      const body = generateValidBody();

      const response = await server.post("/auth/sign-in").send(body);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is a user for given email but password is not correct", async () => {
      const body = generateValidBody();
      await createUser(body);

      const response = await server.post("/auth/sign-in").send({
        email: body.email,
        password: faker.lorem.word()
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when credentials are valid", () => {
      it("should respond with status 200", async () => {
        const body = generateValidBody();
        const user = await createUser(body);

        const response = await server.post("/auth/sign-in").send(body);
        const checkUser = await prisma.user.findUnique({
          where: {
            username: user.username
          }
        });
        const session = await prisma.session.findFirst({
          where: {
            userId: user.id
          }
        });

        expect(response.status).toBe(httpStatus.OK);
        expect(typeof(response.body.token.accessToken)).toBe("string");
        expect(response.body.token.refreshToken).toBe(session.token);
        expect(response.body.user).toEqual({
          username: checkUser.username,
          email: checkUser.email,
          profilePicture: checkUser.profilePicture
        })
      });
    });
  });
});

describe("POST /auth/sign-up", () => {
  it("should respond with status 422 when body is not given", async () => {
    const response = await server.post("/auth/sign-up");
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should respond with status 422 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
    const response = await server.post("/auth/sign-up").send(invalidBody);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should respond with status 422 when body is not valid (password)", async () => {
    const invalidBody = { 
      username: faker.lorem.word(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(2),
     };
    const response = await server.post("/auth/sign-up").send(invalidBody);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  it("should respond with status 422 when body is not valid (email)", async () => {
    const invalidBody = { 
      username: faker.lorem.word(),
      email: faker.lorem.word(),
      password: faker.internet.password(6),
     };
    const response = await server.post("/auth/sign-up").send(invalidBody);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });
  
  it("should respond with status 422 when body is not valid (username)", async () => {
    const invalidBody = { 
      username: faker.internet.email().toLowerCase(),
      email: faker.internet.email().toLowerCase().toLowerCase(),
      password: faker.internet.password(6),
     };
    const response = await server.post("/auth/sign-up").send(invalidBody);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  describe("when body is valid", () => {
    const generateValidBody = () => ({
      username: faker.lorem.word(4),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(6),
    });

    it("should respond with status 409 if there is already an user for given email", async () => {
      const body = generateValidBody();
      await createUser({ email: body.email });
      
      const response = await server.post("/auth/sign-up").send(body);

      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it("should respond with status 409 if username is already in use", async () => {
      const body = generateValidBody();
      await createUser({ email: faker.internet.email().toLocaleLowerCase(), username: body.username });

      const response = await server.post("/auth/sign-up").send(body);

      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it("should respond with status 201", async () => {
      const body = generateValidBody();

      const response = await server.post("/auth/sign-up").send(body);
      const user = await prisma.user.findUnique({
        where: {
          username: body.username
        }
      });

      expect(user.username).toBe(body.username);
      expect(response.status).toBe(httpStatus.CREATED);
    });
  });
})

describe("POST /auth/logout", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/auth/logout");
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });  

  it("should respond with status 401 if given access token is not valid", async () => {
    const accessToken = faker.lorem.word();
    const response = await server.post("/auth/logout").set("Authorization", `Bearer ${accessToken}`);  
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 204", async () => {
    const user = await createUser();
    const refreshToken = createToken({ userId: user.id, type: TokenTypes.refresh });
    const accessToken = createToken({ userId: user.id, type: TokenTypes.access });  
    
    await createSession({ userId: user.id, token: refreshToken });
    const response = await server.post("/auth/logout").set("Authorization", `Bearer ${accessToken}`);
    const userSessions = await prisma.session.findMany({ where: { userId: user.id } });

    expect(response.status).toBe(httpStatus.NO_CONTENT);
    expect(userSessions).toEqual([]);
  });
})

describe("GET /auth/data", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/auth/data");
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });  

  it("should respond with status 401 if given access token is not valid", async () => {
    const accessToken = faker.lorem.word();
    const response = await server.get("/auth/data").set("Authorization", `Bearer ${accessToken}`);  
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 200 and corresponding user data", async () => {
    const user = await createUser();
    const accessToken = createToken({ userId: user.id, type: TokenTypes.access });  
    
    const response = await server.get("/auth/data").set("Authorization", `Bearer ${accessToken}`)

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.user).toEqual({
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture
    });
  });
})
