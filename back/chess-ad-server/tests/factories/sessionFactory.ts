import { Session } from "@prisma/client";
import { prisma } from "../../src/config";

export async function createSession(params: Partial<Session> = {}): Promise<Session> {  
  const { userId, token } = params;
  try {
    const session = await prisma.session.create({
      data: {
        userId,
        token
      },
    });
    return session; 
  } catch (error) {
    console.log(error);
  }
}
