import React from "react";

import GraphHeader from "./graph-header";
import GraphBody from "./graph-body";
import GraphInfo from "./graph-info";
import { IWeekBar, IWeekLabel } from "models/index";
import { getGrapsBars } from "../../data/providers/api";

import "./ProgressGraph.scss";

interface IProps {
  budgetId: string;
  role: string;
}

interface IState {
  key: string;
  weeksLabel: IWeekLabel[];
  weeksBars: IWeekBar[];
  barValues: number[];
}

class ProgressGraph extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      key: "",
      weeksLabel: [],
      weeksBars: [],
      barValues: []
    };
  }

  async componentDidMount() {
    const { budgetId } = this.props;

    try {
      const budgetBars = await getGrapsBars({
        budgetId
      });

      this.setState(budgetBars);
    } catch (error) {
      console.log(error); // tslint:disable-line
    }
  }

  render() {
    const { weeksLabel, barValues, weeksBars } = this.state;
    const { role } = this.props;

    return (
      <div id="progress-graph">
        <h2 className="block-title">Budget/Week</h2>
        <div className="graph">
          <GraphHeader weeks={weeksLabel} />
          <GraphBody values={barValues} weeksBars={weeksBars} role={role} />
        </div>
        <GraphInfo />
      </div>
    );
  }
}

export default ProgressGraph;
