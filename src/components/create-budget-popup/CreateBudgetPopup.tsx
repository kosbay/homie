import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import moment from "moment";

import { IAppState } from "reduxFiles/types";
import {
  createBudgetAction,
  clearBudgetErrors
} from "reduxFiles/budgets/actions";
import { Modal } from "components/index";

import "./CreateBudgetPopup.scss";

interface IProps {
  createBudgetError: string;
  onClose: () => void;
  onClearErrors: () => void;
  onCreateBudget: (
    name: string,
    initialBudget: number,
    monthlyBudget: number,
    createDate: Date
  ) => void;
}

class CreateBudgetPopup extends React.Component<IProps, any> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      name: "",
      monthlyBudget: 0,
      initialBudget: 0,
      createDate: moment().format("YYYY-MM-DD")
    };
  }

  addBudget = async e => {
    e.preventDefault();

    const { onCreateBudget } = this.props;
    const {
      name = "",
      initialBudget = 0,
      monthlyBudget = 0,
      createDate = ""
    } = this.state;

    onCreateBudget(name, initialBudget, monthlyBudget, createDate);
  };

  onInputNumbers = e => {
    const value = e.target.validity.valid
      ? e.target.value
      : this.state[e.target.name];

    if (parseInt(value || 0, 10) < 999999) {
      this.setState({
        [e.target.name]: value
      });
    }
  };

  onChange = e => {
    const value = e.target.validity.valid
      ? e.target.value
      : this.state[e.target.name];

    this.setState({
      [e.target.name]: value
    });
  };

  onClose = () => {
    this.setState({
      name: "",
      monthlyBudget: 0,
      initialBudget: 0
    });

    this.props.onClearErrors();
    this.props.onClose();
  };

  displayInputNumber = value => {
    return value === -1 ? "" : value;
  };

  render() {
    const { name, initialBudget, monthlyBudget, createDate } = this.state;
    const { createBudgetError } = this.props;

    return (
      <Modal className="popup" onClose={this.onClose}>
        <form id="form" onSubmit={this.addBudget}>
          <span className="title">Create budget</span>
          {createBudgetError && (
            <span className="error">{createBudgetError}</span>
          )}

          <div className="body">
            <div className="block">
              <label className="label" htmlFor="name">
                Name
              </label>
              <div className="input-wrapper">
                <input
                  className="input"
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={this.onChange}
                  min="2019-01-01"
                  max="2099-01-01"
                />
              </div>
            </div>
            <div className="block">
              <label className="label" htmlFor="initalBudget">
                Initial budget
              </label>
              <div className="input-wrapper">
                <input
                  className="input"
                  type="text"
                  id="initalBudget"
                  name="initialBudget"
                  pattern="[0-9]*"
                  defaultValue={this.displayInputNumber(initialBudget)}
                  onInput={this.onInputNumbers}
                />
                <span className="input-hint">hours</span>
              </div>
            </div>
            <div className="block">
              <label className="label" htmlFor="monthlyBudget">
                Monthly budget
              </label>
              <div className="input-wrapper">
                <input
                  className="input"
                  type="text"
                  id="monthlyBudget"
                  pattern="[0-9]*"
                  name="monthlyBudget"
                  defaultValue={this.displayInputNumber(monthlyBudget)}
                  onInput={this.onInputNumbers}
                />
                <span className="input-hint">hours</span>
              </div>
            </div>
            <div className="block">
              <label className="label" htmlFor="createDate">
                Create Date
              </label>
              <div className="input-wrapper">
                <input
                  className="input"
                  type="date"
                  id="createDate"
                  name="createDate"
                  value={createDate === 0 ? "" : createDate}
                  onChange={this.onChange}
                  min="2019-01-01"
                  max="2099-01-01"
                />
              </div>
            </div>
          </div>

          <div className="footer">
            <span className="hint">Budget will create immediately</span>
            <button className="submit" type="submit">
              <img className="img" src="/assets/sc-blue.png" alt="mysc" />
              <span>Create budget</span>
            </button>
          </div>
        </form>
      </Modal>
    );
  }
}

const mapStateToProps = (state: IAppState) => ({
  createBudgetError: state.budgets.createBudgetError
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onClearErrors: () => dispatch(clearBudgetErrors()),
  onCreateBudget: (
    name: string,
    initialBudget: number,
    monthlyBudget: number,
    createDate: Date
  ) =>
    dispatch(createBudgetAction(name, initialBudget, monthlyBudget, createDate))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateBudgetPopup);
