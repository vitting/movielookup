import joi from "joi";
import { MovieReview } from "../interfaces/movie_review.interface";


const movieReviewSchema = joi.object<MovieReview>({
    title: joi.string().min(5).max(255).required(),
    review: joi.string().min(10).required(),
    movieId: joi.string().required()
});

export default movieReviewSchema;