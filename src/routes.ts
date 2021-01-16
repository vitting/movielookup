import express from "express";
import { MovieController } from "./controllers/movie.controller";
import { AuthController } from "./controllers/auth.controller";
import { ViewController } from "./controllers/view.controller";

const movieRouter = express.Router();
const authRouter = express.Router();
const viewRouter = express.Router();

viewRouter.get("/", ViewController.apiOverview);

movieRouter.get("/movies/all", MovieController.getAllMovies);

movieRouter.get("/movies/search", MovieController.getMovieBySearch);

movieRouter.post("/movies/:id/rating/:rating", MovieController.setMovieRating); 

movieRouter.get("/movies/reviews", MovieController.getMovieReviewsForUser);

movieRouter.get("/movies/:id/reviews", MovieController.getMovieReviewsForMovie);

movieRouter.get("/movies/reviews/:id", MovieController.getMovieReview);

movieRouter.post("/movies/:id/reviews", MovieController.createMovieReview); 

movieRouter.put("/movies/:id/reviews/:reviewId", MovieController.updateMovieReview);

movieRouter.get("/movies/:id", MovieController.getMovie);

authRouter.post("/register", AuthController.register);

authRouter.post("/login", AuthController.login);

authRouter.post("/logout", AuthController.logout);

authRouter.get("/token/:refreshToken", AuthController.token);

export { movieRouter, authRouter, viewRouter };
