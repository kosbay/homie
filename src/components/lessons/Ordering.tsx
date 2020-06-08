import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { wrongAnswerSound, rightAnswerSound } from "../../helpers/sound";

import "./Ordering.scss";

const toStringIds = items => {
  return items.map(({ id }) => id).toString();
};

const shuffle = array => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 4;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: `${grid}px ${grid * 2}px`,
  margin: `0 ${grid}px 0 0`,
  borderRadius: "4px",

  background: isDragging ? "lightgreen" : "grey",

  ...draggableStyle
});

const getListStyle = finished => ({
  transition: "ease-in-out 1s",
  background: finished ? "lightgreen" : "lightgrey",
  borderRadius: "4px",
  display: "flex",
  padding: grid,
  overflow: "auto"
});

class Ordering extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      answers: toStringIds(props.items),
      items: shuffle(props.items),
      finished: false,
      play: false
    };
  }

  onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });

    if (toStringIds(items) === this.state.answers) {
      this.setState({
        finished: true
      });

      rightAnswerSound();
    }
  };

  render() {
    const { items, finished } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(finished)}
              {...provided.droppableProps}
            >
              {items.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                  isDragDisabled={finished}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default Ordering;
