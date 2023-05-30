var express = require("express");
const defaultRouter = express.Router();
const { PingController } = require("../controllers");
const { validate, Joi } = require("express-validation");

const usersRouter = require('./users.router');

const POST_pingValidator = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};
/* GET home page. */
defaultRouter.get("/ping", [PingController.GET_ping]);
defaultRouter.post("/ping", [
  validate(POST_pingValidator),
  PingController.POST_ping,
]);

const init = (app) => {
  app.use("/api", defaultRouter);
  app.use("/api", usersRouter);
};

module.exports = init;
