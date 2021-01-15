export interface MovieRating {
    id?: string;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    rating: number;
    movieId: string;
}