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

async function deleteSession() {
    
}

async function find() {
    
}

const sessionRepository = { 
  create,
  deleteSession, 
  find 
};

export default sessionRepository;
