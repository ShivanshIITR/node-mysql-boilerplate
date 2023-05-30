const db = require("../../db");
const { Op, Transaction, col, literal, QueryTypes } = require("sequelize");
const { sequelize } = require("../../db");
const paginate = require("../../db/paginate");
const constants = require("../common/constants");
const Helpers = require("../common/helpers");
const _ = require("underscore");

let { UserBasic } = db.UserSchema;

module.exports.findUsersAsync = async (txn, modelObj = null) => {
  try {
    let data;
    if (modelObj != null) {
      modelObj.transaction = txn;
      modelObj.raw = true;
      data = await UserBasic.findAll({ modelObj });
    } else {
      data = await UserBasic.findAll({
        where: { IsActive: 1 },
        transaction: txn,
        raw: true,
      });
    }
    return data;
  } catch (e) {
    return e;
  }
};

module.exports.createUserAsync = async (insertObj, txn) => {
  try {
    let data = await UserBasic.create(insertObj, {
      transaction: txn,
      raw: true,
    });
    return data;
  } catch (e) {
    return e;
  }
};
