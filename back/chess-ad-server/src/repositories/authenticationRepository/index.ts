import { prisma } from "../../config";
import { Prisma } from "@prisma/client";

async function findByEmail(email: string, select?: Prisma.UserSelect) {
  const params: Prisma.UserFindUniqueArgs = {
    where: {
      email,
    },
  };

  if (select) {
    params.select = select;
  }
  try {
    const conflict = await prisma.user.findUnique(params);
    return conflict; 
  } catch (error) {
    console.log(error);
  }
}

async function findByUsername(username: string, select?: Prisma.UserSelect) {
    const params: Prisma.UserFindUniqueArgs = {
      where: {
        username,
      },
    };
  
    if (select) {
      params.select = select;
    }
  
    return prisma.user.findUnique(params);
}

async function create(data: Prisma.UserUncheckedCreateInput) {
  return prisma.user.create({
    data,
  });
}

async function listUserData(userId: string) {
  const params: Prisma.UserFindUniqueArgs = {
    where: {
      id: userId,
    },
    select: {
      username: true,
      email: true,
      profilePicture: true,
    }
  };

  return prisma.user.findUnique(params);
}

const authenticationRepository = {
  findByEmail,
  findByUsername,
  listUserData,
  create, 
};

export default authenticationRepository;
