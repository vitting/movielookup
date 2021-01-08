import express from "express";
import dotenv from "dotenv";
import { authRouter, movieRouter } from "./routes";
import { db } from "./db";
import { dbToken, RefreshTokenModel } from "./db_tokens";
import authMiddleware from "./middlewares/auth_middleware";
import colors from "colors";
import { AuthController } from "./controllers/auth.controller";
dotenv.config();

(async function() {
  const app = express();
  const port = process.env.SERVER_PORT;
  await AuthController.loadRefreshTokensToMem();
  // await db.sync();
  // await dbToken.sync();
  app.use(express.json());
  
  app.use("/api/v1", authRouter);
  app.use("/api/v1", authMiddleware, movieRouter);
  
  
  app.listen(port, () => {
    console.log("server listening at " + colors.yellow(`http://localhost:${port}`));
  });
}) ()
