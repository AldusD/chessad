import Joi from "joi";
import { prisma } from "../config";
import { Prisma } from "@prisma/client";
import { SignUpParams } from "@/services";

export const signUpSchema = Joi.object<any>({
  time: Joi.number().required(),
  increment: Joi.number().required(),
  side: Joi.string().valid('black', 'white', 'random').required(),
  userId: Joi.string().required()
  });

  
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
  
  const authenticationRepository = {
    findByEmail,
    findByUsername,
    create, 
  };
  
  export default authenticationRepository;
  