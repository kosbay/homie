import React from "react";
import moment from "moment";

import { Button } from "components/index";
import IAdditionalBudgetModel from "../../models/IAdditionalBudget";

import "./AdditionalBudget.scss";

interface IProps {
  additionalBudgets: IAdditionalBudgetModel[];
  addAdditionalBudget: (budgetId: string, hours: number) => void;
  removeAdditionalBudget: (budgetId: string, id: any) => void;
  budgetId: string;
  isAdmin?: boolean;
}

interface IState {
  hours: string;
}

class AdditionalBudget extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      hours: ""
    };
  }

  onChange = e => {
    const value = e.target.validity.valid ? e.target.value : this.state.hours;

    this.setState({
      hours: value
    });
  };

  onSubmit = () => {
    const { budgetId, addAdditionalBudget } = this.props;
    const { hours } = this.state;
    if (hours) {
      addAdditionalBudget(budgetId, Number(hours));
      this.setState({ hours: "" });
    }
  };

  isInThisMonth = date => {
    const startOfMonth = moment()
      .startOf("month")
      .format("YYYY-MM-DD hh:mm");
    const endOfMonth = moment()
      .endOf("month")
      .format("YYYY-MM-DD hh:mm");

    return moment(date).isBetween(startOfMonth, endOfMonth, undefined, "[]");
  };

  render() {
    const {
      additionalBudgets,
      isAdmin,
      removeAdditionalBudget,
      budgetId
    } = this.props;
    const { hours } = this.state;
    const isManyElements = additionalBudgets && additionalBudgets.length > 2;

    if (!isAdmin && (!additionalBudgets || additionalBudgets.length <= 0)) {
      return <div />;
    }

    return (
      <div className="userlist__container add-budget-container">
        <h2 className="block-title">Additional Budget</h2>
        <table className="userlist-table">
          <thead className="userlist__header table-display-block">
            <tr className="userlist__row">
              <td className="userlist__cell userlist__cell_head userlist__cell_first add-budget-fixed-width">
                Value
              </td>
              <td className="userlist__cell userlist__cell_head">Date</td>
            </tr>
          </thead>
          <tbody
            className={`userlist__body table-display-block ${isManyElements &&
              "tbody-scroll"}`}
          >
            {additionalBudgets &&
              additionalBudgets.map(({ _id, hours, created_at }) => (
                <tr className="userlist__row" key={_id}>
                  <td className="userlist__cell userlist__cell-80 userlist__cell_first userlist__cell_bold">
                    <span>{hours} hours</span>
                  </td>
                  <td className="userlist__cell">
                    <span>{moment(created_at).format("YYYY-MM-DD")}</span>
                  </td>
                  {isAdmin && this.isInThisMonth(created_at) && (
                    <td className="userlist__cell">
                      <i
                        onClick={() => removeAdditionalBudget(budgetId, _id)}
                        className="material-icons unselectable clickable"
                      >
                        delete_forever
                      </i>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
          {isAdmin && (
            <tfoot className="userlist__body table-display-block tfoot-padding-bottom">
              <tr className="userlist__row" key="2">
                <td
                  className="userlist__cell userlist__cell-80
                  userlist__cell_first userlist__cell_bold add-budget-fixed-width"
                >
                  <div className="edit-page__input-container">
                    <input
                      className="edit-page__input"
                      type="text"
                      name="hours"
                      pattern="[0-9]*"
                      id="hours"
                      value={hours}
                      onChange={this.onChange}
                    />
                    <div className="edit-page__input-hint-block">
                      <div className="edit-page__input-hint">hours</div>
                    </div>
                  </div>
                </td>
                <td className="userlist__cell">
                  <Button onClick={this.onSubmit}>Add</Button>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    );
  }
}

export default AdditionalBudget;
