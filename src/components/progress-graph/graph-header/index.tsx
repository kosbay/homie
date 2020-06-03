import React from "react";
import classnames from "classnames";
import ReactTooltip from "react-tooltip";

import IWeekLabel from "models/IWeekLabel";

import "./style.scss";

interface IProps {
  weeks: IWeekLabel[];
}

const GraphHeader = ({ weeks }: IProps) => (
  <ul id="weeks">
    <li>Week</li>
    {weeks.map(
      ({ currentWeek, weekNumber, state, additionalBudget }, index) => (
        <li key={index} className={classnames({ active: currentWeek })}>
          <span>{state && weekNumber}</span>
          {additionalBudget ? (
            <span
              data-tip={`${additionalBudget} additional hours`}
              className="tooltip"
            />
          ) : (
            ""
          )}
          <ReactTooltip />
        </li>
      )
    )}
  </ul>
);

export default GraphHeader;
