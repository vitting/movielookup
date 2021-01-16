export interface MovieReview {
  id?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  nameOfReviewer?: string;
  title: string;
  review: string;
  movieId?: string;
}
