import React from "react";
import classnames from "classnames";

import IWeekBar from "models/IWeekBar";

import "./style.scss";

interface IProps {
  weeksBars: IWeekBar[];
  minValue: number;
}

const NegativeBudgetChart = ({ weeksBars, minValue }: IProps) => {
  const isCurrentWeek = state => {
    return state === "current";
  };

  const isNextWeek = state => {
    return state === "next";
  };

  const getExcessBarHeight = (remain, spent) => {
    return remain - spent > 0 ? 0 : ((remain - spent) * 100) / minValue;
  };

  return (
    <ul id="negative">
      {weeksBars.map(
        ({ budget_left: remain, spent_given_week: spent, state }, index) => {
          return (
            <li
              className={classnames({
                active: isCurrentWeek(state),
                next: isNextWeek(state)
              })}
              key={index}
            >
              <div
                style={{ height: `${getExcessBarHeight(remain, spent)}%` }}
              />
            </li>
          );
        }
      )}
    </ul>
  );
};

export default NegativeBudgetChart;
