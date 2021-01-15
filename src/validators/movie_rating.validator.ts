import joi from "joi";
import { MovieRating } from "../interfaces/movie_rating.interface";


const movieRatingSchema = joi.object<MovieRating>({
    rating: joi.number().min(0).max(10).required(),
    movieId: joi.string().required()
});

export default movieRatingSchema;