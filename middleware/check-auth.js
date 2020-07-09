const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next(); // allowing OPTIONS request created by browser to pass/ dont block actual request send by user
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; //Authorization: "Bearer TOKEN"
    if (!token) {
      throw new Error("Authentication failed.");
    }

    const decodedToken = jwt.verify(token, "supersecret_dont_share");

    req.userData = { userId: decodedToken.userId };

    next(); // user is verified, next will allow to continue
  } catch (err) {
    const error = new HttpError("Authentication failed.", 401);
    return next(error);
  }
};
