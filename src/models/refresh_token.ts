import { Model, DataTypes, Sequelize } from "sequelize";

export function initRefreshTokenModel(db: Sequelize) {
    class RefreshTokenModel extends Model {}

    RefreshTokenModel.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        token: {
          type: DataTypes.STRING,
          allowNull: false,
        }
      },
      {
        tableName: "tokens",
        sequelize: db
      }
    );
    
    return RefreshTokenModel;
}
