import express from "express";
import { getHomePage } from "../controllers/homeController";
import {
  deleteUserApi,
  getUserApi,
  getUserWithParamsApi,
  postUserApi,
  updateUserApi,
} from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import authController from "../controllers/authController";
import middlewareController from "../controllers/middlewareController";
import { verifyEmail } from "../services/authService";
let router = express.Router();

const initWebRouter = (app) => {
  //user
  router.get("/hihi", getHomePage);
  router.post("/users", postUserApi);
  router.get("/users", getUserApi);
  router.get("/users/:id", getUserWithParamsApi);
  router.put("/users", updateUserApi);
  router.delete("/users/:id", deleteUserApi);

  //doctor
  router.get("/get-detail-doctor-by-id", doctorController.getDetailsDoctorById);

  //auth
  router.post("/register", authController.registerUser);
  router.post("/login", authController.loginUser);
  router.post("/refresh-tokens", authController.handleRefreshToken);
  router.post(
    "/logout",
    middlewareController.verifyToken,
    authController.handleLogout
  );

  router.post("/sendMail", authController.handleSendMail);
  router.post("/forgotPass", authController.handleForgotPassword);
  router.get("/verify", verifyEmail);

  return app.use("/v1/api", router);
};

module.exports = { initWebRouter };
