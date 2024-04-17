import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import { initWebRouter } from "./routes/web";
import connectDB from "./config/connectDB";
const cors = require("cors");
import cookieParser from "cookie-parser";
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8888; //port
//config app

//cho phép phía FE gọi api
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(cors());
app.use(cookieParser());

//config req.body --để lấy data từ form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

viewEngine(app);
initWebRouter(app);

connectDB();

app.listen(port, () => {
  console.log(`Backend zero listening on port ${port}`);
});
