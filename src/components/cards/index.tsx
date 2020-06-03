import React from "react";
import { withRouter } from "react-router-dom";

import Card from "./Card";

import "./Card.scss";

class Cards extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onCardClick = () => {
    const { history } = this.props;
    history.push("/index");
  };

  render() {
    const { courses } = this.props;

    return (
      <div>
        <div className="cards">
          {courses.map((course, index) => (
            <Card key={index} course={course} />
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(Cards);
