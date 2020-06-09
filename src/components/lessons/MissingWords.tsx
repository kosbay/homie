import React from "react";
import classnames from "classnames";

import { Input } from "components/index";
import { wrongAnswerSound, rightAnswerSound } from "../../helpers/sound";

import "./MissingWords.scss";

class MissingWords extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      word1: "",
      word2: "",
      finished1: false,
      finished2: false
    };
  }

  handleInputChange = (e, word) => {
    this.setState({
      [word]: e.target.value
    });
  };

  handleCheckInput = (e, word) => {
    const { sentence } = this.props;
    if (e.key == "Enter") {
      if (e.target.value === sentence[word]) {
        let arg = e.target.name === "*" ? "finished1" : "finished2";
        this.setState({
          [arg]: true
        });
        rightAnswerSound();
      } else {
        wrongAnswerSound();
      }
    }
  };

  render() {
    const { sentence } = this.props;
    const { word1, word2, finished1, finished2 } = this.state;

    const renderSentence = sentence.content.split(" ").map((word, index) => {
      let result: any = null;
      if (word === "*") {
        result = finished1 ? (
          <div key={index} className="sentence-finished">
            {sentence["*"]}
          </div>
        ) : (
          <Input
            size="3"
            name="*"
            className={classnames("missing-word-input")}
            value={word1}
            key={word}
            onChange={e => this.handleInputChange(e, "word1")}
            onKeyDown={e => this.handleCheckInput(e, "*")}
          />
        );
      } else if (word === "#") {
        result = finished2 ? (
          <div key={index} className="sentence-finished">
            {sentence["#"]}
          </div>
        ) : (
          <Input
            name="#"
            className={classnames("missing-word-input")}
            value={word2}
            key={word}
            onChange={e => this.handleInputChange(e, "word2")}
            onKeyDown={e => this.handleCheckInput(e, "#")}
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

    return <div className="sentence-container">{renderSentence}</div>;
  }
}

export default MissingWords;
