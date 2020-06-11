import React from "react";
import {
  Switch,
  Route,
  withRouter,
  RouteComponentProps
} from "react-router-dom";

import Welcome from "../welcome/Welcome";
import Courses from "../courses/Courses";
import Teachers from "../teachers/Teachers";
import CreateLesson from "../lesson-creation/CreateLesson";

import { Header } from "components/index";

import "./App.scss";

const Routes = (props: any & RouteComponentProps) => {
  return (
    <div>
      <main className="page-container page">
        <Header />
        <Switch>
          <Route path="/index" component={Welcome} />
          <Route path="/courses" component={Courses} />
          <Route path="/teachers" component={Teachers} />
          <Route path="/create-lesson" component={CreateLesson} />
        </Switch>
      </main>
    </div>
  );
};

export default withRouter(Routes);
