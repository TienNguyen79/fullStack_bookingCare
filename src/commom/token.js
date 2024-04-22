import jwt from "jsonwebtoken";
import { configs } from "../config/app.config.js";

export function generateAccessToken(payload) {
  const signOption = {
    expiresIn: "20s",
    algorithm: "RS256",
  };

  payload = { ...payload, type: "access_token" };
  let accessToken = jwt.sign(payload, configs.key.private, signOption);
  return accessToken;
}

export function generateRefreshToken(id) {
  const signOption = {
    expiresIn: "7d",
    algorithm: "RS256",
  };

  let payload = { type: "refresh_token", id };
  let refreshToken = jwt.sign(payload, configs.key.private, signOption);
  return refreshToken;
}
