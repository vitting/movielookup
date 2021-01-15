import { DataTypes, Model, Sequelize } from "sequelize";

export function initMovieRatingModel(db: Sequelize) {
  class MovieRatingModel extends Model {}

  MovieRatingModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.UUID,
        
        defaultValue: 0,
      },
      movieId: {
        type: DataTypes.UUID,
        defaultValue: 0,
      },
    },
    {
      sequelize: db,
      tableName: "movieratings",
    }
  );

  return MovieRatingModel;
}
