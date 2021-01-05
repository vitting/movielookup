import { Model, DataTypes, Sequelize } from "sequelize";

export function initUserModel(db: Sequelize) {
    class UserModel extends Model {}

    UserModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
      },
      {
        tableName: "users",
        sequelize: db
      }
    );
    
    return UserModel;
}
