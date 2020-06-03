import React from "react";
import classnames from "classnames";
import FaThumbsUp from "react-icons/lib/fa/thumbs-up";

import "./ThumbUp.scss";

interface IProps {
  onClick: (event: React.SyntheticEvent) => void;
  anim: boolean | undefined;
  amount: number;
}

interface IState {
  animate: boolean;
}
class ThumbUp extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      animate: false
    };
  }

  handleClick = (event: React.SyntheticEvent) => {
    const { onClick, anim } = this.props;

    if (!anim) {
      this.setState({ animate: true });
    }
    onClick(event);
  };

  render() {
    const { anim, amount } = this.props;
    const { animate } = this.state;

    return (
      <div
        className={classnames("icon-wrapper", { anim })}
        onClick={this.handleClick}
      >
        <div className="thumbs_amount">{amount !== 0 && amount}</div>
        <span className="icon">
          <FaThumbsUp size={24} />
        </span>
        {animate && (
          <div className="spark">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
    );
  }
}

export default ThumbUp;
