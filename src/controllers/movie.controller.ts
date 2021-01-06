import { Request, Response } from "express";
import { MovieModel } from "../db";
import { Op } from "sequelize";
import movieReqParamsSchema from "../validators/movie_req_params.validator";
import movieReqSearchParamsSchema from "../validators/movie_req_search_params.validator";
import { MovieRequestParams } from "../interfaces/movie_request_params.interface";
export class MovieController {
  static async moviesAll(req: Request, res: Response) {
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

  static async movieSearch(req: Request, res: Response) {
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

  static async movie(req: Request, res: Response) {
    const id = req.params.id;
    const movie = await MovieModel.findByPk(id);

    res.json(movie?.toJSON());
  }
}
