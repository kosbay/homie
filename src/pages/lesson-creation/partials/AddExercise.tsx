import React from "react";
import { withRouter } from "react-router-dom";
import Select from "react-select";

import { Input, SelectInput, TrueOrFalseCreation } from "components/index";

import "./AddExercise.scss";

const courses = [
  { value: "English", label: "English" },
  { value: "Kazakh", label: "Kazakh" },
  { value: "Russian", label: "Russian" }
];

const customStyles = {
  container: styles => ({ ...styles, display: "inline-table", width: "160px" }),
  control: styles => ({ ...styles, height: 42, minHeight: 42, width: "200px" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      color: "gray",
      height: 30,
      minHeight: 30,
      cursor: "pointer"
    };
  }
};

class AddExercise extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="add-exes-container">
        <h2>Exercise Creation</h2>
        <br />
        <br />
        <div className="exes-type-container">
          <label className="exes-type-label">Lesson type:</label>
          <Select
            options={courses}
            styles={customStyles}
            placeholder="Select Type"
          />
        </div>
        <br />
        <br />
        <TrueOrFalseCreation />
      </div>
    );
  }
}

export default withRouter(AddExercise);
