import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import moment from "moment";
import bcrypt from "bcrypt";
import _ from "lodash";

import config from "../config/connections";
import jwtSecret from "./jwtConfig";
import { UserController } from "../controllers";
import JiraAPIController from "../services/JiraAPIController";

const jiraAPIController = new JiraAPIController();

const info = "The username and/or password used for authentication are invalid";

// TODO get rid of any
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false
    },
    async (username, password, done) => {
      try {
        const user: any = await UserController.getUser(username);

        if (!user) {
          return done({ info });
        }

        if (
          config.customerJiraUsername === username &&
          config.customerJiraPassword === password
        ) {
          try {
            const allProjects = await jiraAPIController.getAllProjects();
            user.projects = _.map(allProjects, "key");

            return done({ user });
          } catch (err) {
            return done({
              info: "Access is denied due to invalid credentials"
            });
          }
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);

        if (!passwordCorrect) {
          return done({ info: "Access is denied due to invalid credentials" });
        }

        if (user.role === "admin") {
          try {
            const allProjects = await jiraAPIController.getAllProjects();
            user.projects = _.map(allProjects, "key");

            return done({ user });
          } catch (err) {
            return done({ info });
          }
        }

        user.projects =
          typeof user.projects === "string" ? [user.projects] : user.projects;
        user.isCustomer = true;

        try {
          const response = await UserController.updateLastLogin({
            _id: user._id,
            lastLogin: moment().toDate()
          });

          return done({ user: response });
        } catch (err) {
          return done({ err });
        }
      } catch (err) {
        return done({ info: "Access is denied due to invalid credentials" });
      }
    }
  )
);

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
  secretOrKey: jwtSecret.secret
};

passport.use(
  "jwt",
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await UserController.getUser(jwt_payload.id);

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  })
);
