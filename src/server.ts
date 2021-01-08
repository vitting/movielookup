import express from "express";
import dotenv from "dotenv";
import { authRouter, movieRouter } from "./routes";
import { db } from "./db";
import { dbToken } from "./db_tokens";
import authMiddleware from "./middlewares/auth_middleware";
import colors from "colors";
import { AuthController } from "./controllers/auth.controller";
import { prompt } from "enquirer";

dotenv.config();

(async function () {
  const app = express();
  const port = process.env.SERVER_PORT;

  if (
    process.argv.includes("--dbsync") ||
    process.argv.includes("--dbsyncall")
  ) {
    try {
      if (process.argv.includes("--dbsyncall")) {
        const answer: { dropdb: string } = await prompt({
          type: "input",
          name: "dropdb",
          message: colors.bold.white.bgRed("All database data will be dropped. Type YES to continue: ")
        });
        
        if (!answer.dropdb.includes("YES")) {
          process.exit();
        }
      }
    
      console.log(colors.black.bgGreen("   Database sync started   "));

      await db.sync({ force: process.argv.includes("--dbsyncall") });
      await dbToken.sync({ force: process.argv.includes("--dbsyncall") });

      console.log(colors.black.bgGreen("   Database sync ended   "));
    } catch (error) {
      console.error(error);
    }
  }

  await AuthController.loadRefreshTokensToMem();

  app.use(express.json());

  app.use("/api/v1", authRouter);
  app.use("/api/v1", authMiddleware, movieRouter);

  app.listen(port, () => {
    console.log(
      "server listening at " + colors.yellow(`http://localhost:${port}`)
    );
  });
})();
