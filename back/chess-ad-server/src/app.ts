import "reflect-metadata";
import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";

import { loadEnv, connectDb, disconnectDB, prisma } from "@/config";
import { hRouter } from "./routers";
loadEnv();

const app = express();
app
  .use(cors())
  .use(express.json())
  .get("/health", (_req, res) => res.send("1.e4!"))
  .use("/h", hRouter)
  .get("/users", async (req, res) => {
    try { 
      const users = await prisma.user.findMany();
      res.status(200).send(users)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  }).post("/users", async (req, res) => {
    try { 
      const users = await prisma.user.create({
        data: {
          username: 'allduss',
          email: 'aaa@aaa.com',
          profilePicture: 'aa'
        }
      });
      res.status(201).send(users)
    } catch (error) {
      console.log(error)
      res.status(400).send(error)
    }
  })

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
