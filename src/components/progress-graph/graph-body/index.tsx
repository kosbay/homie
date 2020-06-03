import React from "react";

import GraphSideBar from "./graph-sidebar";
import PositiveBudgetChart from "./positive-budget-chart";
import NegativeBudgetChart from "./negative-budget-chart";
import IWeekBar from "models/IWeekBar";
import { Loader } from "components/index";

import "./style.scss";

interface IProps {
  values: number[];
  weeksBars: IWeekBar[];
  role: string;
}

const GraphBody = ({ values, weeksBars, role }: IProps) => {
  const isNegativeValue = values[values.length - 1] < 0;
  const maxValue = values[0];
  const minValue = values[values.length - 1];

  if (values.length === 0 && role === "admin") {
    return <Loader />;
  }

  return (
    <div id="body">
      <GraphSideBar values={values} />
      <div className="bars">
        <PositiveBudgetChart weeksBars={weeksBars} maxValue={maxValue} />
        {isNegativeValue && (
          <NegativeBudgetChart weeksBars={weeksBars} minValue={minValue} />
        )}
      </div>
    </div>
  );
};

export default GraphBody;
