import jwt from "jsonwebtoken";
import { configs } from "../config/app.config";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("🚀 ~ verifyToken ~ token:", req.headers);

  if (token) {
    const accessToken = token.split(" ")[1];
    console.log("🚀 ~ verifyToken ~ accessToken:", accessToken);
    jwt.verify(accessToken, configs.key.private, (err, user) => {
      console.log("🚀 ~ jwt.verify ~ user:", user);
      if (err) {
        return res.status(403).json({ ms: "Token is not valid " });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ ms: "You are not authentication " });
  }
};

const verifyTokenAdminAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log("🚀 ~ verifyToken ~ req99:", req.user);
    if (req.user.roleId === "admin") {
      next();
    } else {
      return res.status(403).json({ ms: "You are not allowed " });
    }
  });
};

module.exports = {
  verifyToken: verifyToken,
  verifyTokenAdminAuth: verifyTokenAdminAuth,
};
