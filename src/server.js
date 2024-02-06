import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import { initWebRouter } from "./routes/web";
import connectDB from "./config/connectDB";
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8888; //port
//config app

//config req.body --để lấy data từ form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

viewEngine(app);
initWebRouter(app);

connectDB();

app.listen(port, () => {
  console.log(`Backend zero listening on port ${port}`);
});
