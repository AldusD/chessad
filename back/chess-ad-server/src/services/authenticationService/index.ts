import { User } from "@prisma/client";
import sessionRepository from "../../repositories/sessionsRepository";
import authenticationRepository from "../../repositories/authenticationRepository";
import { createToken, compareToken, TokenTypes } from "./token";
import { encryptPassword, validatePassword } from "./password";
import { conflictError, invalidCredentialsError } from "./errors";

export async function createUser({ username, email, password }: SignUpParams): Promise<User> {
  
  
  await validateUniqueEmail(email);
  await validateUniqueUsername(username);

  const hashedPassword = await encryptPassword(password); 

  return authenticationRepository.create({
    username,
    email,
    password: hashedPassword,
  });
}

async function validateUniqueEmail(email: string) {
  const userWithSameEmail = await authenticationRepository.findByEmail(email);
  if (userWithSameEmail) {
    throw conflictError("email");
  }
}

async function validateUniqueUsername(username: string) {
  const userWithSameUsername = await authenticationRepository.findByUsername(username);
  if (userWithSameUsername) {
    throw conflictError("username");
  }
}

async function login(params: SignInParams): Promise<LoginResult> {
  const { email, password } = params;

  const user = await getUserByEmail(email);
  await validatePassword(password, user.password);  
  const tokens = await createSession(user.id);

  return tokens;
}

async function getUserByEmail(email: string): Promise<GetUserByEmailResult> {
  const user = await authenticationRepository.findByEmail(email);
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: string) {
  const accessToken = createToken({ userId, type: TokenTypes.access });
  const refreshToken = createToken({ userId, type: TokenTypes.refresh }, "2d");

  await sessionRepository.create({
    token: refreshToken,
    userId,
  });

  return { accessToken, refreshToken };
}

type SignInResult = {
  user: Pick<User, "id" | "email">;
  token: string;
};

type LoginResult = {
  accessToken: string,
  refreshToken: string
};

type GetUserByEmailResult = Pick<User, "id" | "email" | "password">;

const authenticationService = {
  login,
  createUser
};

export default authenticationService;
export type SignUpParams = Pick<User, "email" | "password" | "username">;
export type SignInParams = Pick<User, "email" | "password">;
export * from "./errors";
