import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { initUserModel } from "./models/user.model";
import { initMovieModel } from "./models/movie.model";

dotenv.config();

const db = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DATABASE_PATH,
  logging: process.argv.includes("--dev")
});

const UserModel = initUserModel(db);
const MovieModel = initMovieModel(db);
export { db, UserModel, MovieModel };
