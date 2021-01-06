import joi from "joi";
import movieReqParamsSchema from "./movie_req_params.validator";

const movieReqSearchParamsSchema = movieReqParamsSchema.append({
  query: joi.string().required(),
});

export default movieReqSearchParamsSchema;
