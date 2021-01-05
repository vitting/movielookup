export interface Movie {
    id?: string;
    title: string;
    year: number;
    genre: string;
    director: string;
    language: string;
    country: string;
    posterUrl: string;
    createdAt?: Date;
    updatedAt?: Date;
}