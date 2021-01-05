import { Request, Response } from "express";
import { MovieModel } from "../db";
import { isEmpty } from "lodash";
import { Op } from "sequelize";
export namespace MovieController {
  export async function moviesAll(req: Request, res: Response) {
    const qparams = req.query;
    let order = "ASC";
    let limit = 100;
    let offset = 0;

    if (!isEmpty(qparams)) {
      order = (qparams.order as string)?.toUpperCase() ?? "ASC";
      if (!isNaN((qparams.limit as unknown) as number)) {
        limit = (qparams.limit as unknown) as number;
      }

      if (!isNaN((qparams.offset as unknown) as number)) {
        offset = (qparams.offset as unknown) as number;
      }
    }

    const movies = await MovieModel.findAll({
      limit,
      offset,
      order: [["title", order]],
    });
    res.json(
      movies.map((movie) => {
        return movie.toJSON();
      })
    );
  }

  export async function movieSearch(req: Request, res: Response) {
    const qparams = req.query;
    let order = "ASC";
    let limit = 100;
    let offset = 0;
    let query = "";

    if (!isEmpty(qparams)) {
      order = (qparams.order as string)?.toUpperCase() ?? "ASC";
      if (!isNaN((qparams.limit as unknown) as number)) {
        limit = (qparams.limit as unknown) as number;
      }

      if (!isNaN((qparams.offset as unknown) as number)) {
        offset = (qparams.offset as unknown) as number;
      }

      if (!qparams.query) {
        return res.status(400).json({ error: "Missing query parameter" });
      }

      query = qparams.query as string;
    } else {
      return res.status(400).json({ error: "Missing query parameter" });
    }

    const movies = await MovieModel.findAll({
      limit,
      offset,
      order: [["title", order]],
      where: {
        [Op.or]: [
          {
            title: {
              [Op.substring]: query,
            },
          },
          {
            director: {
              [Op.substring]: query,
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
  export async function movie(req: Request, res: Response) {
    const id = req.params.id;
    const movie = await MovieModel.findByPk(id);

    res.json(movie?.toJSON());
  }
}
