const { _200, _error } = require("../common/httpHelper");
const { UserBao } = require("../bao");
const Joi = require("joi");
const { validateSchema } = require("../common/validator");
const db = require("../../db");

module.exports.GET_users = async (httpRequest, httpResponse, next) => {
  try {
    const userBao = new UserBao();
    const result = await userBao.findUserAsync(httpRequest.query);
    return _200(httpResponse, result);
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports.POST_createUser = async (httpRequest, httpResponse, next) => {
  try {
    const userBao = new UserBao();
    const result = await userBao.createUserAsync(httpRequest.body);
    return _200(httpResponse, result);
  } catch (e) {
    return e;
  }
};
