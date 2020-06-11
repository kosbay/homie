import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Select from "react-select";
import { withRouter } from "react-router-dom";

import AddExercise from "./partials/AddExercise";
import { Input, SelectInput } from "components/index";

import "./CreateLesson.scss";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular
    }
  })
);

const Panels = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Expansion Panel 1</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Expansion Panel 2</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

const courses = [
  { value: "English", label: "English" },
  { value: "Kazakh", label: "Kazakh" },
  { value: "Russian", label: "Russian" }
];

const customStyles = {
  container: styles => ({ ...styles, display: "inline-table", width: "160px" }),
  control: styles => ({ ...styles, height: 42, minHeight: 42, width: "200px" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      color: "gray",
      height: 30,
      minHeight: 30,
      cursor: "pointer"
    };
  }
};

class CreateLesson extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onCardClick = () => {
    const { history } = this.props;
    history.push("/index");
  };

  render() {
    return (
      <div className="content-container">
        <div className="page-title">Lesson Creation</div>
        <br />
        <br />
        <div className="create-lesson-first-line">
          <div className="lesson-title-container">
            <label className="lesson-title-label">Lesson title:</label>
            <Input name="lessonName" className="lesson-title-input" />
          </div>
          <div className="lesson-title-container">
            <label className="lesson-title-label">Lesson title:</label>
            <Select
              options={courses}
              styles={customStyles}
              placeholder="Select Course"
            />
          </div>
        </div>
        <br />
        <br />
        <div className="lesson-desc-container">
          <label className="lesson-desc-label">Lesson description:</label>
          <Input
            name="lessonDesc"
            className="lesson-desc-input"
            textArea={true}
          />
        </div>
        <br />
        <Panels />
        <br />
        <br />
        <AddExercise />
      </div>
    );
  }
}

export default withRouter(CreateLesson);
