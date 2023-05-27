import { User } from "@prisma/client";
import sessionRepository from "../../repositories/sessionsRepository";
import authenticationRepository from "../../repositories/authenticationRepository";
import { createToken, TokenTypes } from "../../utils/token";
import { encryptPassword, validatePassword } from "./password";
import { conflictError, invalidCredentialsError, serverError, unauthorizedError } from "../errors";

async function createUser({ username, email, password }: SignUpParams): Promise<User> {
  await validateUniqueEmail(email);
  await validateUniqueUsername(username);

  const hashedPassword = await encryptPassword(password); 
  
  const user = await authenticationRepository.create({
    username,
    email,
    password: hashedPassword,
  });

  if(!user) throw serverError();
  return user;
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

  return { token: tokens, user: { username: user.username, email: user.email, profilePicture: user.profilePicture } };
}

async function logout(userId: string) {
  return sessionRepository.deleteUserSessions(userId);
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

async function findSession(token: string) {
  const session = await sessionRepository.find(token);
  if (!session) throw unauthorizedError('refresh token expired or invalid');

  return session;
}

async function sendNewToken(refreshToken: string): Promise<Tokens> {
  const session = await findSession(refreshToken);
  const newRefreshToken = createToken({ userId: session.userId, type: TokenTypes.refresh });
  const newAccessToken = createToken({ userId: session.userId, type: TokenTypes.access });

  const renewedSession = await sessionRepository.updateSession({ previousToken: refreshToken, newToken: newRefreshToken });
  return { 
      refreshToken: newRefreshToken,
      accessToken: newAccessToken
    } 
}

async function sendUserData(userId: string): Promise<Partial<User>> {
  const user = await authenticationRepository.listUserData(userId); 
  return user;
}

type SignInResult = {
  user: Pick<User, "id" | "email">;
  token: string;
};

type Tokens = {
  accessToken: string,
  refreshToken: string
}

type UserResponse = {
  username: string,
  email: string,
  profilePicture: string
}

type LoginResult = {
  token: Tokens,
  user: UserResponse
};

type GetUserByEmailResult = Pick<User, "id" | "username" | "email" | "password" | "profilePicture" >;

const authenticationService = {
  login,
  createUser,
  logout,
  sendUserData,
  sendNewToken
};

export default authenticationService;
export type SignUpParams = Pick<User, "email" | "password" | "username">;
export type SignInParams = Pick<User, "email" | "password">;
