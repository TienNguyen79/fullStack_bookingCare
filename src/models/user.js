"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Allcode, {
        foreignKey: "positionId",
        // targetKey: "keyMap",
        as: "positionData",
      });
      User.belongsTo(models.Allcode, {
        foreignKey: "gender",
        // targetKey: "keyMap",
        as: "genderData",
      });
      User.belongsTo(models.Allcode, {
        foreignKey: "roleId",
        // targetKey: "keyMap",
        as: "roleData",
      });
      User.hasOne(models.Markdown, { foreignKey: "doctorId" });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      gender: DataTypes.BOOLEAN,
      image: DataTypes.STRING,
      roleId: DataTypes.STRING,
      positionId: DataTypes.STRING,
      email_verified_at: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
      // paranoid: true,
      // deletedAt: "softDelete",
      timestamps: true,
      paranoid: true,
    }
  );
  return User;
};
