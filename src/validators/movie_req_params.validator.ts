import joi from "joi";
import { MovieRequestParams } from "../interfaces/movie_request_params.interface";


const movieReqParamsSchema = joi.object<MovieRequestParams>({
    limit: joi.number().min(0).max(100).default(100).optional(),
    offset: joi.number().min(0).default(0).optional(),
    order: joi.string().lowercase().valid("asc", "desc").default("asc").optional()
});

export default movieReqParamsSchema;