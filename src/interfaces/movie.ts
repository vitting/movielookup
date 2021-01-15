export interface Movie {
    id?: string;
    title: string;
    year: number;
    genre: string;
    director: string;
    language: string;
    country: string;
    posterUrl: string;
    runtime: number;
    actors: string;
    plot: string;
    averageRating: number;
    userRating?: number;
    createdAt?: Date;
    updatedAt?: Date;
}