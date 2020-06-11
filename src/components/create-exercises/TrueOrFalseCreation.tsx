import React from "react";
import _ from "lodash";
import classnames from "classnames";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { Input } from "components/index";

import "./TrueOrFalseCreation.scss";

class TrueOrFalseCreation extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      correct: false,
      answerTrue: false,
      answerFalse: false,
      blockCount: 1
    };
  }

  handleAddBlock = () => {
    this.setState({
      blockCount: this.state.blockCount + 1
    });
  };

  render() {
    const { answerTrue, answerFalse, blockCount } = this.state;

    return (
      <div className="torf-create-container">
        {_.range(blockCount).map(block => (
          <div className="torf-block" key={block}>
            <div className="torf-question-container">
              {block === 0 && (
                <label className="question-title">Question</label>
              )}
              <Input name="question" className="question-input" />
            </div>
            <div className="torf-answer-container">
              {block === 0 && <label className="answer-title">Answer</label>}
              <RadioGroup
                aria-label="gender"
                name="gender1"
                className="variants-container"
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="True"
                  className="variant"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="False"
                  className="variant"
                />
              </RadioGroup>
            </div>
          </div>
        ))}
        <div onClick={this.handleAddBlock}>Add Exercise</div>
      </div>
    );
  }
}

export default TrueOrFalseCreation;
