import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import logger from "morgan";
import cors from "cors";
import createError from "http-errors";

import routes from "./routes";

const app = express();
const log = console.log;

app.use(bodyParser.json());
app.use(logger("combined"));
app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

/**
 * Routes
 */
app.use("/api", routes);

/**
 * Error handling
 */
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({
      err
    })
    .end();
});

/**
 * Start
 */
app.listen(process.env.PORT || 3000, () => {
  log("------------------------------");
  log(`Host:\t${process.env.HOST || "localhost"}`);
  log(`Port:\t${process.env.PORT || 3000}`);
  log("------------------------------");
});

export default app;
