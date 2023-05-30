const { DataTypes } = require("sequelize");
const schema = "";
const tableName = `userBasic`;
const definition = {
  ID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: "ID",
    autoIncrement: true,
    primaryKey: true,
  },
  UserID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: "UserID",
  },
  Mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "Mobile",
  },
  FullName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "FullName",
  },
  RoleID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "RoleID",
  },
  IsActive: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "isActive",
  },
  CreatedOn: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "CreatedOn",
  },
  UpdatedOn: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "UpdatedOn",
  },
};

module.exports = (sequelize) => {
  const table = sequelize.define(tableName, definition, {
    schema,
    createdAt: false,
    updatedAt: false,
    freezeTableName: true,
  });
  return table;
};
