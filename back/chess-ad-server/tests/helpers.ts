import * as jwt from "jsonwebtoken";
import { User } from "@prisma/client";

import { prisma } from "../src/config";

export async function cleanDb() {
  await prisma.user.deleteMany({});
}
