import bcrypt from "bcrypt";
import faker from "@faker-js/faker";
import { User } from "@prisma/client";
import { prisma } from "../../src/config";

export async function createUser(params: Partial<User> = {}): Promise<User> {  
  const incomingPassword = params.password || faker.internet.password(6);
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username: params.username || faker.lorem.word(),
        email: params.email || faker.internet.email().toLowerCase(),
        password: hashedPassword,
      },
    });
    return user; 
  } catch (error) {
    console.log(error);
  }
}
