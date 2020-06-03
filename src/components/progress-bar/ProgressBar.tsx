import React from "react";

import Card from "../card/Card";

import "./ProgressBar.scss";

interface IProps {
  monthlyBudget: number;
  spent: number;
  currentDate: number;
  remaining: number;
}

const ProgressBar = (props: IProps) => {
  const getBarsWidth = () => {
    const { spent, remaining } = props;

    const currentBudgetBarWidth =
      spent > spent + remaining
        ? 100
        : +((spent * 100) / (remaining + spent)).toFixed(0);
    const remainBudgetBarWidth = 100 - currentBudgetBarWidth;

    return [currentBudgetBarWidth, remainBudgetBarWidth];
  };

  const getBarsBorderRadius = currentBudgetBarWidth => {
    switch (currentBudgetBarWidth) {
      case 0:
        return ["0", "10px"];
      case 100:
        return ["10px", "0"];
      default:
        return ["10px 0 0 10px", "0 10px 10px 0"];
    }
  };

  const getCurrentMonthAndYear = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    const currentDate = new Date();

    const month = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    return `${month} ${year}`;
  };

  const { monthlyBudget, spent, remaining } = props;
  const [currentBudgetBarWidth, remainBudgetBarWidth] = getBarsWidth();
  const [currentBudgetBarBorder, accumBudgetBarBorder] = getBarsBorderRadius(
    currentBudgetBarWidth
  );

  return (
    <div id="progress-bar">
      <h2 className="block-title">{getCurrentMonthAndYear()}</h2>
      <Card className="budget-bar" noMargin>
        <ul>
          <li>
            <span>Resterend budget</span>
            <b>{Math.round(remaining)}</b>
          </li>
          <li>
            <span>Uitgegeven maand</span>
            <b>{Math.round(spent)}</b>
          </li>
          <li>
            <span>Maandelijks budge</span>
            <b>{monthlyBudget}</b>
          </li>
        </ul>
        <div className="bar">
          <div
            className="spent"
            style={{
              width: `${currentBudgetBarWidth}%`,
              borderRadius: currentBudgetBarBorder
            }}
          >
            {currentBudgetBarWidth > remainBudgetBarWidth &&
              `${Math.round(remaining)} resterende uren`}
          </div>
          <div
            className="remain"
            style={{
              width: `${remainBudgetBarWidth}%`,
              borderRadius: accumBudgetBarBorder
            }}
          >
            {currentBudgetBarWidth <= remainBudgetBarWidth &&
              `${Math.round(remaining)} resterende uren`}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProgressBar;
