import bcrypt from "bcrypt";
import { raw } from "body-parser";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../commom/token";
import { configs } from "../config/app.config.js";
const db = require("../models");
let refreshTokensTemp = [];

const registerService = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(data.password, salt);

  let results = await db.User.create({ email: data.email, password: hashed });

  return results;
};

const LoginService = async (data, res) => {
  try {
    const user = await db.User.findOne({
      where: { email: data.email },
      raw: true,
    });

    if (!user) {
      return res.status(403).json({ ms: "Wrong email" });
    }
    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      return res.status(403).json({ ms: "Wrong password" });
    }
    if (user && validPassword) {
      const { email, roleId, id } = user;
      const payload = { email, roleId, id };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(id);

      refreshTokensTemp.push(refreshToken);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        samsite: "strict",
      });

      const { password, ...rest } = user;
      return res.status(200).json({
        ms: "Login success !",
        user: rest,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    }
  } catch (error) {
    return res.status(500).json(err);
  }
};

const refreshTokenService = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // lấy refreshToken trong cookie xử lý ở login

  if (!refreshToken) return res.status(401).json("You are not authenticated!");

  if (!refreshTokensTemp.includes(refreshToken)) {
    //nếu có refresh token nhưng không phải của mình
    return res.status(403).json("Refresh token is not valid");
  }

  // const dataVerify = jwt.verify(refreshToken, configs.key.public, {
  //   algorithms: "RS256",
  // });

  // key public ở verify
  jwt.verify(refreshToken, configs.key.public, async (err, data) => {
    if (err) {
      console.log(err);
    }

    refreshTokensTemp = refreshTokensTemp.filter(
      (token) => token != refreshToken
    );

    const idUser = data.id;

    const user = await db.User.findOne({
      where: { id: idUser },
      raw: true,
    });

    const { email, roleId, id } = user;
    const payload = { email, roleId, id };

    const accessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(id);
    refreshTokensTemp.push(newRefreshToken);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      samsite: "strict",
    });
    return res.status(200).json({ accessToken: accessToken });
  });
};

const LogoutService = async (res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json("Logout successfully!");
};

module.exports = {
  registerService: registerService,
  LoginService: LoginService,
  refreshTokenService: refreshTokenService,
  LogoutService: LogoutService,
};
