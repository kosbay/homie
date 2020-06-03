import React from "react";
import { withRouter } from "react-router-dom";

import { Input, Button } from "components/index";

import "./Teachers.scss";

const courses = [
  {
    name: "English language"
  },
  {
    name: "Kazakh language"
  },
  {
    name: "Russian language"
  },
  {
    name: "French language"
  }
];

class Teachers extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="content-container">
        <div className="page-title">Teachers Page</div>
        <br />
        <br />
        <div className="teacher-form">
          <Input name="name" placeholder="Name" className="teacher-inputs" />
          <Input name="email" placeholder="Email" className="teacher-inputs" />
          <Input
            name="course"
            placeholder="Course"
            className="teacher-inputs"
          />
          <Button onClick={() => console.log("Submit")}>Add Teacher</Button>
        </div>
      </div>
    );
  }
}

export default withRouter(Teachers);
