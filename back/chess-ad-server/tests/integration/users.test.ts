import faker from "@faker-js/faker";
import supertest from "supertest";
import httpStatus from "http-status";

import app, { init } from "../../src/app";
import { cleanDb } from "../helpers";
import { createUser } from "../factories";

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
      email: faker.internet.email(),
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
        await createUser(body);

        const response = await server.post("/auth/sign-in").send(body);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body.token).toBeDefined();
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
      email: faker.internet.email(),
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
      username: faker.internet.email(),
      email: faker.internet.email(),
      password: faker.internet.password(6),
     };
    const response = await server.post("/auth/sign-up").send(invalidBody);
    expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });

  describe("when body is valid", () => {
    const generateValidBody = () => ({
      username: faker.lorem.word(4),
      email: faker.internet.email(),
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
      await createUser({ email: faker.internet.email(), username: body.username });

      const response = await server.post("/auth/sign-up").send(body);

      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it("should respond with status 201", async () => {
      const body = generateValidBody();

      const response = await server.post("/auth/sign-up").send(body);

      expect(response.status).toBe(httpStatus.CREATED);
    });
  });
})