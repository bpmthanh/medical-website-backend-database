"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Allcodes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Allcodes.hasMany(models.User, {
        foreignKey: "positionId",
        as: "positionData",
      });
      Allcodes.hasMany(models.User, { foreignKey: "gender", as: "genderData" });
      Allcodes.hasMany(models.Schedule, {
        foreignKey: "timeType",
        as: "timeTypeData",
      });
      Allcodes.hasOne(models.Doctor_Infor, {
        foreignKey: "priceId",
        as: "priceTypeData",
      });
      Allcodes.hasOne(models.Doctor_Infor, {
        foreignKey: "provinceId",
        as: "provinceTypeData",
      });
      Allcodes.hasOne(models.Doctor_Infor, {
        foreignKey: "paymentId",
        as: "paymentTypeData",
      });
    }
  }
  Allcodes.init(
    {
      keyMap: DataTypes.STRING,
      type: DataTypes.STRING,
      value_en: DataTypes.STRING,
      value_vi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Allcodes",
    }
  );
  return Allcodes;
};
