import { prisma } from "../../config";
import { Prisma } from "@prisma/client";

async function createSession(sessionData: SessionData) {
  const { userId, token } = sessionData
}

type SessionData = {
    userId: string,
    token: string
  }

async function deleteSession() {
    
}

async function findSession() {
    
}

const sessionRepository = { 
  createSession,
  deleteSession, 
  findSession 
};

export default sessionRepository;
