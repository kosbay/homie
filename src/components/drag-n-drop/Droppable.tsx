import React from "react";

import "./DragNDrop.scss";

class Droppable extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleDrop = e => {
    e.preventDefault();

    const cardId = e.dataTransfer.getData("card_id");

    const card: any = document.getElementById(cardId);
    card.style.display = "block";

    e.target.appendChild(card);
  };

  handleDragOver = e => {
    e.preventDefault();
  };

  render() {
    const { id, className, children } = this.props;

    return (
      <div
        id={id}
        className="droppable-container"
        onDrop={this.handleDrop}
        onDragOver={this.handleDragOver}
      >
        {children}
      </div>
    );
  }
}

export default Droppable;
