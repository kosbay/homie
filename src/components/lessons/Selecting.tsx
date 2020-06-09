import React from "react";
import classnames from "classnames";
import Select from "react-select";

import { SelectInput } from "components/index";
import { wrongAnswerSound, rightAnswerSound } from "../../helpers/sound";

import "./Selecting.scss";

class Selecting extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      finished: false
    };
  }

  handleChange = selectedOption => {
    const { sentence } = this.props;

    if (selectedOption.value === sentence["*"].answer) {
      this.setState({
        finished: true
      });
      rightAnswerSound();
    } else {
      wrongAnswerSound();
    }
  };

  render() {
    const { sentence } = this.props;
    const { finished } = this.state;

    const renderSentence = sentence.content.split(" ").map((word, index) => {
      let result: any = null;
      if (word === "*") {
        result = finished ? (
          <div key={index} className="sentence-finished">
            {sentence["*"].answer}
          </div>
        ) : (
          <SelectInput
            key={index}
            options={sentence["*"].options}
            onChange={e => this.handleChange(e)}
            isSearchable={false}
          />
        );
      } else {
        result = (
          <span className="sentence-word" key={word}>
            {word}
          </span>
        );
      }
      return result;
    });

    return <div className="selecting-container">{renderSentence}</div>;
  }
}

export default Selecting;
