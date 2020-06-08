import React from "react";

import { OrderingLesson } from "components/index";

import "./Welcome.scss";

const items = [
  { id: "1", content: "What" },
  { id: "2", content: "time" },
  { id: "3", content: "is" },
  { id: "4", content: "it?" }
];

const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

class Welcome extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        Welcome to Home works Platform
        <OrderingLesson items={items} />
      </div>
    );
  }
}

export default Welcome;
