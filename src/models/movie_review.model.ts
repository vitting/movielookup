import { DataTypes, Model, Sequelize } from "sequelize";

export function initMovieReviewModel(db: Sequelize) {
  class MovieReviewModel extends Model {}

  MovieReviewModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      review: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "",
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: 0,
      },
      nameOfReviewer: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "",
      },
      movieId: {
        type: DataTypes.UUID,
        defaultValue: 0,
      },
    },
    {
      sequelize: db,
      tableName: "moviereviews",
    }
  );

  return MovieReviewModel;
}
