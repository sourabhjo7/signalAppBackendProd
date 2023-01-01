require("dotenv").config();
require("./config/database").connect();
const fileUpload = require("express-fileupload");
const axios = require("axios");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routers
const indexRouter = require("./route/index");
const authRouter = require("./route/auth");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",// origin: ["http://localhost:3000"], // change origin based on domain main of the application
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// Using Routes
app.use("/", indexRouter);
app.use("/auth", authRouter);

module.exports = app;
