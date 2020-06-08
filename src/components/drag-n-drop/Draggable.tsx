import React from "react";

import "./DragNDrop.scss";

class Draggable extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleDragStart = e => {
    const target = e.target;

    e.dataTransfer.setData("card_id", target.id);

    setTimeout(() => {
      target.style.backgroundColor = "gray";
    }, 0);
  };

  handleDragOver = e => {
    e.stopPropagation();
    e.style.backgroundColor = "black";
  };

  render() {
    const { id, className, draggable, children } = this.props;
    return (
      <div
        id={id}
        className="draggable-container"
        draggable={draggable}
        onDragStart={this.handleDragStart}
        onDragOver={this.handleDragOver}
      >
        {children}
      </div>
    );
  }
}

export default Draggable;
