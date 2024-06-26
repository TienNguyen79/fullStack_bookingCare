import { generateAccessToken, generateRefreshToken } from "../commom/token";
import {
  registerService,
  LoginService,
  refreshTokenService,
  LogoutService,
  sendMailService,
  forgotPassService,
} from "../services/authService";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    let results = await registerService(req.body, res);

    return results;
  } catch (error) {
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  try {
    let results = await LoginService(req.body, res);
    return results;
  } catch (error) {
    res.status(500).json(error);
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    let results = await refreshTokenService(req, res);
    return results;
  } catch (error) {
    res.status(500).json(error);
  }
};

const handleLogout = async (req, res) => {
  try {
    let results = await LogoutService(res);
    return results;
  } catch (error) {
    res.status(500).json(error);
  }
};

const handleSendMail = async (req, res) => {
  try {
    let results = await sendMailService(req, res);
    return results;
  } catch (error) {
    res.status(500).json(error);
  }
};

const handleForgotPassword = async (req, res) => {
  try {
    let results = await forgotPassService(req, res);
    return results;
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  registerUser: registerUser,
  loginUser: loginUser,
  handleRefreshToken: handleRefreshToken,
  handleLogout: handleLogout,
  handleSendMail: handleSendMail,
  handleForgotPassword: handleForgotPassword,
};
