import React from "react";

import { Droppable, Draggable } from "components/index";

import "./Welcome.scss";

class Welcome extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        Welcome to Home works Platform
        <Droppable id="board-1">
          <Draggable id="card-1" draggable={true}>
            First One
          </Draggable>
        </Droppable>
        <Droppable id="board-2">
          <Draggable id="card-2" draggable={true}>
            Second One
          </Draggable>
        </Droppable>
      </div>
    );
  }
}

export default Welcome;
