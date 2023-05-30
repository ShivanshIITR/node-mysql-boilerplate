var express = require("express");
var router = express.Router();
const { UserController } = require("../controllers");
const { validate, Joi } = require("express-validation");

const POST_createUserValidator = {
  body: Joi.object().keys({
    UserID: Joi.number().required(),
    Mobile: Joi.number().required(),
    FullName: Joi.string().required(),
    RoleID: Joi.number().required(),
  }),
};

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.get("/users", [UserController.GET_users]);
router.post("/create/user", [
  validate(POST_createUserValidator),
  UserController.POST_createUser,
]);

module.exports = router;
