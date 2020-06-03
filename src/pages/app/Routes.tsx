import React from "react";
import {
  Switch,
  Route,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import Welcome from "../welcome/Welcome";
import Courses from "../courses/Courses";

import "./App.scss";

const Routes = (props: any & RouteComponentProps) => {
  return (
    <div>
      <main className="page-container page">
        <Route
          render={({ location }) => {
            const { pathname } = location;
            return (
              <TransitionGroup>
                <CSSTransition
                  key={pathname}
                  classNames="page"
                  timeout={{
                    enter: 500,
                    exit: 500
                  }}
                >
                  <Route
                    location={location}
                    render={() => (
                      <Switch>
                        <Route
                          path="/index"
                          render={renderProps => <Welcome {...renderProps} />}
                        />
                        <Route
                          path="/courses"
                          render={renderProps => <Courses {...renderProps} />}
                        />
                      </Switch>
                    )}
                  />
                </CSSTransition>
              </TransitionGroup>
            );
          }}
        />
      </main>
    </div>
  );
};

export default withRouter(Routes);
