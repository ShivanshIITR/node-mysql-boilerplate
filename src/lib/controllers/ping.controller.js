const { _200 } = require("../common/httpHelper");
const { BusinessException } = require("../common/exceptions");

/*
 **
 * @param httpRequest *router request object
 * @param httpResponse *router response object
 * @param next *router next function
 * @return json 200 or 500
 */
module.exports.GET_ping = async (httpRequest, httpResponse, next) => {
  try {
    const d = new Date();
    const response = {
      server_time: `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`,
      server_name: process.env.APP_NAME,
      environment: process.env.APP_ENV,
      public: process.env.APP_PUBLIC,
      version: process.env.VERSION || "x.x.x",
    };
    //throw new BusinessException("PING_ERROR", "Unable to ping at the moment", new Error("some error"));
    return _200(httpResponse, response);
  } catch (e) {
    return next(e);
  }
};

module.exports.POST_ping = async (httpRequest, httpResponse, next) => {
  return _200(httpResponse.body);
};
