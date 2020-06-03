import React from "react";
import classnames from "classnames";

import "./style.scss";

interface IProps {
  values: number[];
}

const GraphSideBar = ({ values }: IProps) => {
  return (
    <ul id="values">
      {values.map((value, index) => {
        return (
          <li key={index}>
            <span className={classnames({ negative: value < 0 })}>{value}</span>
            <div />
          </li>
        );
      })}
    </ul>
  );
};

export default GraphSideBar;
