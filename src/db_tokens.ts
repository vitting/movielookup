import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { initRefreshTokenModel } from "./models/refresh_token";

dotenv.config();

const db = new Sequelize({
  dialect: "sqlite",
  storage: process.env.TOKENS_DATABASE_PATH,
  logging: true
});

const RefreshTokenModel = initRefreshTokenModel(db);
export { db as dbToken, RefreshTokenModel };
