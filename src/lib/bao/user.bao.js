const Base = require("./base");
const { UserDao } = require("../dao/index");
const db = require("../../db");
const _ = require("underscore");
const Helpers = require("../common/Helper/user.helper");
const moment = require("moment");

class UserBao extends Base {
  constructor() {
    super();
  }

  async findUserAsync(data) {
    let txn = await db.sequelize.transaction();
    try {
      console.log(data);
      const dbResult = await UserDao.findUsersAsync(txn);
      await txn.commit();
      console.log(dbResult);
      return dbResult;
    } catch (e) {
      await txn.rollback();
      throw e;
    }
  }

  async createUserAsync(data) {
    let txn = await db.sequelize.transaction();
    try {
      data.IsActive = 1;
      let date = new Date().toISOString();
      let dateLength = date.length;
      date = date.substring(0, dateLength - 1);
      data.CreatedOn = date;
      data.UpdatedOn = date;
      const dbResult = await UserDao.createUserAsync(data, txn);
      await txn.commit();
      console.log(dbResult);
      return dbResult;
    } catch (e) {
      await txn.rollback();
      throw e;
    }
  }
}

module.exports = UserBao;
