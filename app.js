const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const logger = require("morgan");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

const contactRouter = require("./contact/contact.routers");
const userRouter = require("./user/user.routers");

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const PORT = process.env.PORT || 3031;
const MONGO_URL = process.env.MONGO_URL;

start();

function start() {
  const app = initServer();
  connectMiddlewares(app);
  declareRoutes(app);
  connectToDb();
  initErrorHandling(app);
  listen(app);
}
function initServer() {
  return express();
}

function connectMiddlewares(app) {
  const formatsLogger = app.get("env") === "development" ? "dev" : "short";
  app.use(logger(formatsLogger));
  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use(express.static("public"));
  app.use(morgan("combined"));
}

function declareRoutes(app) {
  app.use("/users", userRouter);
  app.use("/contacts", contactRouter);
}

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
function initErrorHandling(app) {
  app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    return res.status(statusCode).send({
      name: err.name,
      status: statusCode,
      message: err.message,
    });
  });
}

function listen(app) {
  app.listen(PORT, () => {
    console.log("Server is listeting on port", PORT);
  });
}
