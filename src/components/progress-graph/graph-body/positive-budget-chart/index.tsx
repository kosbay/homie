import React from "react";
import classnames from "classnames";

import IWeekBar from "models/IWeekBar";

import "./style.scss";

const maxHeightInPX = 200;

interface IProps {
  weeksBars: IWeekBar[];
  maxValue: number;
}

class PositiveBudgetChart extends React.Component<IProps, any> {
  constructor(props) {
    super(props);
  }

  isCurrentWeek = state => {
    return state === "current";
  };

  isNextWeek = state => {
    return state === "next";
  };

  getRemainBarHeight = (spent, remain) => {
    return spent >= remain || remain < 0
      ? 0
      : ((remain - spent) * maxHeightInPX) / this.props.maxValue;
  };

  getSpentBarHeight = (spent, remain) => {
    if (spent >= remain && remain !== 0) {
      return (remain * maxHeightInPX) / this.props.maxValue;
    }

    return remain < 0 ? 0 : (spent * maxHeightInPX) / this.props.maxValue;
  };

  render() {
    const { weeksBars } = this.props;

    return (
      <ul id="positive">
        {weeksBars.map(
          ({ budget_left: remain, spent_given_week: spent, state }, index) => {
            return (
              <li
                className={classnames({
                  active: this.isCurrentWeek(state)
                })}
                key={index}
              >
                <div className="bar">
                  <div
                    className={classnames("remain", {
                      last: this.isNextWeek(state)
                    })}
                    style={{
                      height: `${this.getRemainBarHeight(spent, remain)}px`
                    }}
                  />
                  <div
                    className="spent"
                    style={{
                      height: `${this.getSpentBarHeight(spent, remain)}px`
                    }}
                  />
                </div>
              </li>
            );
          }
        )}
      </ul>
    );
  }
}

export default PositiveBudgetChart;
