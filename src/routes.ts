import express from "express";
import { MovieController } from "./controllers/movie.controller";
import { AuthController } from "./controllers/auth.controller";
import { ViewController } from "./controllers/view.controller";

const movieRouter = express.Router();
const authRouter = express.Router();
const viewRouter = express.Router();

viewRouter.get("/", ViewController.apiOverview);
movieRouter.get("/movies/all", MovieController.moviesAll);

movieRouter.get("/movies/search", MovieController.movieSearch);

movieRouter.post("/movies/rating", MovieController.setMovieRating);

movieRouter.get("/movies/reviews", MovieController.getMovieReviewsForUser);

movieRouter.get("/movies/:id/reviews", MovieController.getMovieReviewsForMovie);

movieRouter.get("/movies/reviews/:id", MovieController.getMovieReview);

movieRouter.post("/movies/reviews", MovieController.setMovieReview);

movieRouter.put("/movies/reviews/:id", MovieController.updateMovieReview);

movieRouter.get("/movies/:id", MovieController.movie);

authRouter.post("/login", AuthController.login);

authRouter.get("/logout", AuthController.logout);

authRouter.post("/register", AuthController.register);

authRouter.post("/token", AuthController.token);

export { movieRouter, authRouter, viewRouter };
