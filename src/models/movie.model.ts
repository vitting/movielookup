import { DataTypes, Model, Sequelize } from "sequelize";

export function initMovieModel(db: Sequelize) {
  class MovieModel extends Model {}

  MovieModel.init({
      id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
      },
      title: {
          type: DataTypes.STRING,
          allowNull: true
      },
      year: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    genre: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    director: {
        type: DataTypes.STRING,
        allowNull: true
    },
    language: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    posterUrl: {
        type: DataTypes.STRING(2000),
        allowNull: true
    }
  }, {
      sequelize: db,
      tableName: "movies"
  });

  return MovieModel;
}
