import express from "express";
import { getHomePage } from "../controllers/homeController";

let router = express.Router();

const initWebRouter = (app) => {
  router.get("/hihi", getHomePage);

  return app.use("/v1/api", router);
};

module.exports = { initWebRouter };
