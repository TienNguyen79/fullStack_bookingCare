import express from "express";
import { getHomePage } from "../controllers/homeController";
import { postUserApi } from "../controllers/userController";

let router = express.Router();

const initWebRouter = (app) => {
  router.get("/hihi", getHomePage);
  router.post("/users", postUserApi);

  return app.use("/v1/api", router);
};

module.exports = { initWebRouter };
