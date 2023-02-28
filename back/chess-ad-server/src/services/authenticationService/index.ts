import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { User } from "@prisma/client";
import sessionRepository from "@/repositories/sessionsRepository";
import authenticationRepository from "@/repositories/authenticationRepository";
import { conflictError, invalidCredentialsError } from "./errors";

export async function createUser({ username, email, password }: SignUpParams): Promise<User> {
  
  
  await validateUniqueEmail(email);
  await validateUniqueUsername(username);

  const hashedPassword = await bcrypt.hash(password, 12);

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

async function signIn(params: SignInParams): Promise<string> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return token;
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await authenticationRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: string) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.createSession({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

type SignInResult = {
  user: Pick<User, "id" | "email">;
  token: string;
};

type GetUserOrFailResult = Pick<User, "id" | "email" | "password">;

const authenticationService = {
  signIn,
  createUser
};

export default authenticationService;
export type SignUpParams = Pick<User, "email" | "password" | "username">;
export type SignInParams = Pick<User, "email" | "password">;
export * from "./errors";
