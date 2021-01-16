import { Request, Response } from "express";
import { MovieModel, MovieReviewModel } from "../db";
import { MovieRatingModel } from "../db";
import { Op } from "sequelize";
import movieReqParamsSchema from "../validators/movie_req_params.validator";
import movieReqSearchParamsSchema from "../validators/movie_req_search_params.validator";
import { MovieRequestParams } from "../interfaces/movie_request_params.interface";
import { AuthRequest } from "../interfaces/auth_request.interface";
import { Movie } from "../interfaces/movie";
import movieReviewSchema from "../validators/movie_review.validator";
import { MovieReview } from "../interfaces/movie_review.interface";

export class MovieController {
  static async getAllMovies(req: Request, res: Response) {
    const qparams = req.query;
    const { error, value } = movieReqParamsSchema.validate(qparams);

    if (error) {
      return res.status(400).json({ error: "error in parameters" });
    }

    const params = value as MovieRequestParams;
    const movies = await MovieModel.findAll({
      limit: params.limit,
      offset: params.offset,
      order: [["title", params.order!]],
    });
    res.json(
      movies.map((movie) => {
        return movie.toJSON();
      })
    );
  }

  static async getMovieBySearch(req: Request, res: Response) {
    const qparams = req.query;
    const { error, value } = movieReqSearchParamsSchema.validate(qparams);

    if (error) {
      return res.status(400).json({ error: "Invalid values in parameters" });
    }

    const params = value as MovieRequestParams;

    const movies = await MovieModel.findAll({
      limit: params.limit,
      offset: params.offset,
      order: [["title", params.order!]],
      where: {
        [Op.or]: [
          {
            title: {
              [Op.substring]: params.query,
            },
          },
          {
            director: {
              [Op.substring]: params.query,
            },
          },
        ],
      },
    });

    res.json(
      movies.map((movie) => {
        return movie.toJSON();
      })
    );
  }

  static async getMovie(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const id = req.params.id;
    const userId = authReq.auth.id;
    const movie = await MovieModel.findByPk(id);
    let movieResult: Movie | null = null;

    if (movie) {
      movieResult = movie.toJSON() as Movie;
      const userRating = await MovieRatingModel.findOne({
        where: { movieId: id, userId },
      });

      movieResult.userRating = userRating
        ? (userRating.get("rating") as number)
        : 0;
    }

    res.json(movieResult);
  }

  static async setMovieRating(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const userId = authReq.auth.id;
    const movieId = req.params.id;
    let rating = 0;
    if (Number.isInteger(parseInt(req.params.rating))) {
      rating = parseInt(req.params.rating);
    }

    if ((!movieId && rating < 0) || rating > 10) {
      res.status(404).json({ error: "Invalid data supplied" });
      return;
    }

    const result = await MovieRatingModel.findOne({
      where: {
        userId,
        movieId,
      },
    });

    if (result) {
      result.set("rating", rating);
      await result.save();
    } else {
      await MovieRatingModel.create({
        rating,
        movieId,
        userId,
      });
    }

    res.json({ message: "Rating saved" });
  }

  static async createMovieReview(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const { id, name } = authReq.auth;
    const movieId = req.params.id;
    const body = req.body;
    const { error, value } = movieReviewSchema.validate(body);
    if (error) {
      res.status(404).json({ error: "Invalid data supplied" });
      return;
    }

    const movieReviewData: MovieReview = value as MovieReview;
    movieReviewData.userId = id;
    movieReviewData.movieId = movieId;
    movieReviewData.nameOfReviewer = name;

    await MovieReviewModel.create(movieReviewData);
    res.json({ message: "Review created" });
  }

  static async updateMovieReview(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const userId = authReq.auth.id;
    const movieId = req.params.movieId;
    const reviewId = req.params.reviewId;
    const body = req.body;

    const { error, value } = movieReviewSchema.validate(body);
    console.log(error);
    if (error) {
      res.status(404).json({ error: "Invalid data supplied" });
      return;
    }

    const movieReviewData: MovieReview = value as MovieReview;
    const review = await MovieReviewModel.findOne({
      where: {
        id: reviewId,
        movieId,
        userId,
      },
    });

    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }

    review.set("title", movieReviewData.title);
    review.set("review", movieReviewData.review);
    await review.save();

    res.json({ message: "Review updated" });
  }

  static async getMovieReview(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const reviewId = req.params.id;
    const userId = authReq.auth.id;

    const result = await MovieReviewModel.findOne({
      where: {
        id: reviewId,
        userId,
      },
    });

    return res.json(result?.toJSON());
  }

  static async getMovieReviewsForUser(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const userId = authReq.auth.id;

    const result = await MovieReviewModel.findAll({
      where: {
        userId,
      },
      order: [["createdAt", "ASC"]],
    });

    res.json(result.map((review) => review.toJSON()));
  }

  static async getMovieReviewsForMovie(req: Request, res: Response) {
    const movieId = req.params.id;

    const result = await MovieReviewModel.findAll({
      where: {
        movieId,
      },
      order: [["createdAt", "ASC"]],
    });

    res.json(result.map((review) => review.toJSON()));
  }
}
