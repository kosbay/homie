import React from "react";

import { addUser } from "../../../data/providers/api";
import { Modal } from "components/index";

interface IState {
  editUserFullName: string;
  userEmail: string;
  error: string;
  showPopup: boolean;
  budgetId: string;
}

interface IProps {
  showPopup: boolean;
  hidePopup: (user: any) => void;
  budgetId: string;
}

class UserPopup extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      editUserFullName: "",
      userEmail: "",
      error: "",
      showPopup: props.showPopup,
      budgetId: props.budgetId
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.showPopup !== prevProps.showPopup) {
      this.setState({
        showPopup: this.props.showPopup
      });
    }
  }

  onInput = e => {
    let value = e.target.validity.valid
      ? e.target.value
      : this.state[e.target.name];

    if (e.target.value === "") {
      value = "";
    }
    this.setState({
      [e.target.name]: value
    });
  };

  private addUser = async e => {
    e.preventDefault();

    const { editUserFullName, userEmail, budgetId } = this.state;

    if (!/^([A-Za-z- ]){2,30}$/.test(editUserFullName)) {
      this.setState({
        error: "Invalid characters in the Name field"
      });
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.([A-Za-z]{2,3})$/.test(userEmail)
    ) {
      this.setState({
        error: "Invalid characters in the Email field"
      });
    } else {
      try {
        const { user } = await addUser({
          fullName: editUserFullName,
          email: userEmail.toLowerCase(),
          budgetId
        });

        this.hiddenPopup(user);
      } catch (error) {
        if (error.response.data.isUserAlreadyExist) {
          this.setState({
            error: "User with this mail already has access to the project"
          });
        }
        console.log(error); // tslint:disable-line
      }
    }
  };

  hiddenPopup = (user = null) => {
    this.setState({
      editUserFullName: "",
      userEmail: "",
      error: ""
    });
    this.props.hidePopup(user);
  };

  render() {
    const { editUserFullName, userEmail, error, showPopup } = this.state;

    return (
      <Modal
        className="popup"
        visible={showPopup}
        onClose={() => this.hiddenPopup(null)}
      >
        <form className="edit-page__edit-form-popup" onSubmit={this.addUser}>
          <span className="edit-page__edit-form-popup-title">
            Invite client
          </span>
          {error && <span className="edit-page__error">{error}</span>}
          <div className="edit-page__edit-popup-block">
            <div className="edit-page__input-block_popup">
              <label className="edit-page__label" htmlFor="editUserFullName">
                Name
              </label>
              <input
                className="edit-page__input edit-page__input_popup"
                type="text"
                id="editUserFullName"
                name="editUserFullName"
                pattern="[A-Za-z- ]*"
                defaultValue={editUserFullName}
                onInput={this.onInput}
              />
            </div>
            <div className="edit-page__input-block_popup">
              <label className="edit-page__label" htmlFor="userEmail">
                Email address
              </label>
              <input
                className="edit-page__input edit-page__input_popup"
                type="text"
                id="userEmail"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2, 3}$"
                name="userEmail"
                defaultValue={userEmail}
                onInput={this.onInput}
              />
            </div>
          </div>
          <div className="edit-page__edit-popup-footer">
            <span className="edit-page__popup-hint">
              New users will receive an email with a generated password and
              instructions
            </span>
            <input
              className="edit-page__submit_popup"
              type="submit"
              defaultValue="Sent invite"
            />
          </div>
        </form>
      </Modal>
    );
  }
}

export default UserPopup;
