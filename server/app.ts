/* tslint:disable:no-console */

import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import passport from "passport";
import * as Sentry from "@sentry/node";
import connectMongo from "connect-mongo";

const environment = process.env.NODE_ENV;
const MongoStore = connectMongo(session);

if (environment !== "development") {
  Sentry.init({
    dsn: "https://d9285437c145497a9cfbd4b57afcbf17@sentry.io/1778845",
    environment
  });
}

const app = express();

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);

app.use(cors());
app.use(express.static(path.join(__dirname, "../public"), { maxAge: 1 }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.listen(5000, () => {
  console.info(`Server running on ${environment} mode.`);
  console.log(`Server is running on Port: 5000`);
});

app.use((err, req, res, next) => {
  console.error(err.message);

  if (!err.statusCode) {
    // If err has no specified error code, set error code to 'Internal Server Error (500)'
    err.statusCode = 500;
  }

  // All HTTP requests must have a response, so let's send back an error with its status code and message
  res.status(err.statusCode).send(err.message);
});
