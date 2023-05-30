module.exports = (sequelize) => {
  const UserBasic = require("./UserBasic.model")(sequelize);
  return {
    Schema: "UserSchema",
    UserBasic,
  };
};
