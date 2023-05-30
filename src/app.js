require("dotenv").config();

var express = require("express");
const expressHttpContext = require("express-http-context");
const cors = require("cors");
const helmet = require("helmet");
var path = require("path");
const { ValidationError } = require("express-validation");
const { _genRID, _error, _404 } = require("./lib/common/httpHelper");
const rateLimit = require("express-rate-limit");
// var logger = require("morgan");
// var models = require("./app/models");
const logger = require("./lib/common/logger")("app");
const routes = require("./lib/routes");
const bannedIPs = {};
const whitelist = ["3.6.232.51"];
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 500, // Limit each IP to 500 requests per `window` (here, per 1 minutes)
  skip: function (req, res) {
    return whitelist.includes(req.ip);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  onLimitReached: function (req, res, options) {
    console.log("API endpoint hit:", req.originalUrl);
    logger.info("API endpoint hit:", req.originalUrl);
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    // Ban the IP for 5 minutes
    bannedIPs[ip] = +new Date() + 5 * 60 * 1000;
    logger.info(`Blocked IP: ${ip}`);
    res.status(429).send(`Too many requests from IP: ${ip}`);
  },
});
const sendOtpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 5 minutes)
  // message: 'You have exceeded the 5 requests in 5 mins limit!',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  onLimitReached: function (req, res, options) {
    // The IP will be unblocked again in an hour (60*60*1000)
    bannedIPs[req.ip] = +new Date() + 60 * 60 * 1000;
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    logger.info("Ip", ip);
    logger.info("Contact:", req.body.contact);
    res.status(429).send("Sorry, too many requests: " + JSON.stringify(req));
  },
});

var apm = require("elastic-apm-node").start({
  //   Override the service name from package.json
  //      Allowed characters: a-z, A-Z, 0-9, -, _, and space
  serviceName: "neo",

  //     Use if APM Server requires a secret token
  secretToken: "",

  // Set the custom APM Server URL (default: http://localhost:8200)
  serverUrl: "http://3.6.232.51:8200",

  //      Set the service environment
  environment: process.env.APP_ENV,
});
const {
  _httpContext,
  _httpResponseInterceptor,
} = require("./lib/common/httpMiddleware");
// const routes = require("./lib/routes");
var app = express();

app.set("trust proxy", true);
app.use(expressHttpContext.middleware);
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());
app.use(express.json({ limit: "10mb", type: ["text/*", "*/json"] }));
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use(_httpContext);
app.use(_httpResponseInterceptor);
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", limiter);
app.use("/api/sendOtp", sendOtpLimiter);
//app.use(apm)
// init routes
routes(app);
// view engine setup

app.use(_404);

// error handler
app.use(function (err, req, res, next) {
  try {
    if (err instanceof ValidationError) {
      let response = {
        status: "error",
        request_id: expressHttpContext.get("request_id") || undefined,
        code: "INVALID_PAYLOAD",
        message: "Request payload validation failure",
        errors: err.details.body.map((x) => x.message.replace(/"/g, "")),
      };
      return res.status(400).json(response);
    } else if (err.name.toLowerCase().substring(0, 9) === "sequelize") {
      let response = {
        status: "error",
        request_id: expressHttpContext.get("request_id") || undefined,
        code: "ERR9",
        message:
          "An unexpected error has occurred while processing your request.",
        trace:
          process.env.APP_ENV === "development" ||
          process.env.APP_ENV === "local"
            ? [err.message, err.stack].join("|")
            : undefined,
      };
      return res.status(500).json(response);
    }
    _error(res, err, next);
  } catch (e) {
    res.status(500).json({
      status: "error",
      code: "SERVIER_ERROR",
      message:
        "An unexpected error has happened on the server while resolving your request.",
      trace:
        process.env.APP_ENV === "development" || process.env.APP_ENV === "local"
          ? e.stack
          : undefined,
    });
  }
});

app.use(logger.requestLogger);
app.use(logger.responseLogger);

module.exports = app;
