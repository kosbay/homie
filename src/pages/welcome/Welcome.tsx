import React from "react";

import {
  OrderingLesson,
  MissingWordsLesson,
  TrueOrFalseLesson,
  SelectingLesson
} from "components/index";

import "./Welcome.scss";

const items = [
  { id: "1", content: "What" },
  { id: "2", content: "time" },
  { id: "3", content: "is" },
  { id: "4", content: "it?" }
];

const items2 = [
  { id: "1", content: "What" },
  { id: "2", content: "is" },
  { id: "3", content: "the" },
  { id: "4", content: "problem" },
  { id: "5", content: "of" },
  { id: "6", content: "acting" },
  { id: "7", content: "like this?" }
];

const sentence = {
  content: "How * are # ?",
  "*": "old",
  "#": "you"
};

const sentence2 = {
  content: "* do you do?",
  "*": "How"
};

const question = {
  content: "London is capital of Great Britain",
  answer: true
};

const question2 = {
  content: "WW|| started on 1941",
  answer: false
};

const selecting = {
  content: "What * your name?",
  "*": {
    options: [
      { value: "chocolate", label: "Chocolate" },
      { value: "strawberry", label: "Strawberry" },
      { value: "vanilla", label: "Vanilla" }
    ],
    vars: ["is", "are", "it"],
    answer: "chocolate"
  }
};

class Welcome extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        DEMO Ordering Lesson
        <br />
        <br />
        <OrderingLesson items={items} />
        <br />
        <OrderingLesson items={items2} />
        <br />
        <br />
        DEMO Missing Words Lesson
        <br />
        <br />
        <MissingWordsLesson sentence={sentence} />
        <br />
        <MissingWordsLesson sentence={sentence2} />
        <br />
        <br />
        DEMO True or False Lesson
        <br />
        <br />
        <TrueOrFalseLesson question={question} />
        <br />
        <TrueOrFalseLesson question={question2} />
        <br />
        <br />
        DEMO True or False Lesson
        <br />
        <br />
        <SelectingLesson sentence={selecting} />
      </div>
    );
  }
}

export default Welcome;
