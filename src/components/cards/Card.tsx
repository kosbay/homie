import React from "react";
import classnames from "classnames";

import "./Card.scss";

interface IProps {
  className?: string;
  theme?: "white" | "dark";
  noMargin?: boolean;
  noPadding?: boolean;
  course: any;
  key: any;
}

const Card = ({
  className = "",
  theme = "white",
  noMargin = false,
  noPadding = false,
  course
}: IProps) => (
  <div id="card" className={classnames({ noMargin })}>
    <div
      className={classnames("card-container", className, theme, { noPadding })}
    >
      <div className="card-info">{course.name}</div>
    </div>
    <div className="card-title">{course.name}</div>
  </div>
);

export default Card;
