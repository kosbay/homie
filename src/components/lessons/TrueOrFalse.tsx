import React from "react";
import classnames from "classnames";

import { wrongAnswerSound, rightAnswerSound } from "../../helpers/sound";

import "./TrueOrFalse.scss";

class TrueOrFalse extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      correct: false,
      answerTrue: false,
      answerFalse: false
    };
  }

  handleAnswer = value => {
    if (value === this.props.question.answer) {
      let arg = value ? "answerTrue" : "answerFalse";
      this.setState({
        correct: true,
        [arg]: true
      });

      rightAnswerSound();
    } else {
      wrongAnswerSound();
    }
  };

  render() {
    const { question } = this.props;
    const { answerTrue, answerFalse } = this.state;
    console.log("correct", answerTrue, answerFalse);
    return (
      <div className="torf-container">
        {question.content}
        <span className="variants-container">
          <span
            className={classnames(
              { correct: answerTrue },
              { notCorrect: answerFalse },
              "variant"
            )}
            onClick={() => this.handleAnswer(true)}
          >
            True
          </span>
          <span
            className={classnames(
              { correct: answerFalse },
              { notCorrect: answerTrue },
              "variant"
            )}
            onClick={() => this.handleAnswer(false)}
          >
            False
          </span>
        </span>
      </div>
    );
  }
}

export default TrueOrFalse;
