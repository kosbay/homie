import React from "react";
import classnames from "classnames";

import "./Card.scss";

interface IProps {
  children: any;
  className?: string;
  theme?: "white" | "dark";
  noMargin?: boolean;
  noPadding?: boolean;
}

const Card = ({
  children,
  className = "",
  theme = "white",
  noMargin = false,
  noPadding = false
}: IProps) => (
  <div id="card" className={classnames({ noMargin })}>
    <div
      className={classnames("card-container", className, theme, { noPadding })}
    >
      {children}
    </div>
  </div>
);

export default Card;
