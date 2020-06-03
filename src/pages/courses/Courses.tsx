import React from "react";
import { withRouter } from "react-router-dom";

import { Cards } from "components/index";

import "./Courses.scss";

const courses = [
  {
    name: "English"
  },
  {
    name: "Kazakh"
  }
];

class Courses extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onCardClick = () => {
    const { history } = this.props;
    history.push("/index");
  };

  render() {
    return (
      <div>
        Courses Page
        <br />
        <br />
        <Cards courses={courses} />
      </div>
    );
  }
}

export default withRouter(Courses);
