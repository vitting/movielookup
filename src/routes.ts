import express from "express";
import { MovieController } from "./controllers/movie.controller";
import { AuthController } from "./controllers/auth.controller";

const movieRouter = express.Router();
const authRouter = express.Router();

movieRouter.get("/movies/all", MovieController.moviesAll);

movieRouter.get("/movies/search", MovieController.movieSearch);

movieRouter.get("/movies/:id", MovieController.movie);

authRouter.post("/login", AuthController.login);

authRouter.get("/logout", AuthController.logout);

authRouter.post("/register", AuthController.register);

authRouter.post("/token", AuthController.token);

export { movieRouter, authRouter };