import { prisma } from "../../config";
import { Prisma } from "@prisma/client";

async function create(sessionData: SessionData) {
  const { userId, token } = sessionData

  return prisma.session.create({
    data: sessionData
  })
}

type SessionData = {
    userId: string,
    token: string
  }

async function updateSession(tokens: UpdateSessionData) {
  return prisma.session.updateMany({
    where: {
      token: tokens.previousToken
    },

    data: {
      token: tokens.newToken
    }
  })
}

type UpdateSessionData = {
  previousToken: string,
  newToken: string
}

async function find(refreshToken: string) {
  return prisma.session.findFirst({
    where: {
      token: refreshToken
    }
  })
}

const sessionRepository = { 
  create,
  updateSession, 
  find 
};

export default sessionRepository;
