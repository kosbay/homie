import React from "react";

import "./style.scss";

const GraphInfo = () => {
  return (
    <ul id="info">
      <li>
        <div className="green" />
        <span>Budget</span>
      </li>
      <li>
        <div className="blue" />
        <span>Besteed</span>
      </li>
      <li>
        <div className="red" />
        <span>Overmaat</span>
      </li>
    </ul>
  );
};

export default GraphInfo;
