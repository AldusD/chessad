import "reflect-metadata";
import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";
import http from  "http";
import { Server, Socket } from "socket.io";

import connectServices from "./sockets";
import { loadEnv, connectDb, disconnectDB, prisma } from "./config";
import { authenticationRouter, gameSettingRouter } from "./routers";

loadEnv();

const app = express();
app
  .use(cors())
  .use(express.json())
  .get("/health", (_req, res) => res.send("1.e4!"))
  .use("/auth", authenticationRouter)
  .use("/game-setting/", gameSettingRouter);

const httpServer = http.createServer(app);

const io = new Server(httpServer, { cors: { origin: process.env.FRONTEND_URL, methods: ['GET', 'POST'] } });
const onConnection = (socket: Socket) => connectServices(io, socket);
io.on("connection", onConnection);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default httpServer;
