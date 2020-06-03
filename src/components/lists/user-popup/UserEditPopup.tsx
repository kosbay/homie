import React from "react";

import { Modal, InputPhone } from "components/index";
import { updateUser, removeUserFromBudget } from "../../../data/providers/api";

interface IState {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  error: string;
  showPopup: boolean;
  budgetId: string;
  notifyPhone: boolean;
  notifyEmail: boolean;
  isClient: boolean;
}

interface IProps {
  showPopup: boolean;
  hidePopup: () => void;
  budgetId: string;
  user: any;
  handleUsersChanged: (any) => void;
  handleUserDeleted: (string) => void;
}

class UserEditPopup extends React.Component<IProps, IState> {
  notifyPhoneRef: HTMLInputElement;
  constructor(props) {
    super(props);

    this.state = {
      _id: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      error: "",
      showPopup: this.props.showPopup,
      budgetId: this.props.budgetId,
      notifyPhone: false,
      notifyEmail: false,
      isClient: false
    };
  }

  componentDidMount() {
    const { user = {} } = this.props;

    if (user) {
      const {
        fullName,
        phoneNumber,
        email,
        notificationType,
        _id,
        isClient
      } = user;
      let notifyEmail = false;
      let notifyPhone = false;

      switch (notificationType) {
        case "email":
          notifyEmail = true;
          break;
        case "phone":
          notifyPhone = true;
          break;
        case "both":
          notifyEmail = true;
          notifyPhone = true;
          break;
        default:
          notifyEmail = true;
      }

      this.setState({
        _id,
        fullName,
        phoneNumber,
        email,
        notifyEmail,
        notifyPhone,
        isClient
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.showPopup !== prevProps.showPopup) {
      this.setState({
        showPopup: this.props.showPopup
      });
    }
  }

  handleChange = e => {
    let value = e.target.validity.valid
      ? e.target.value
      : this.state[e.target.name];

    if (e.target.value === "") {
      value = "";
    }

    this.setState({
      [e.target.name]: value
    });
    if (e.target.name === "phoneNumber") {
      this.notifyPhoneRef.checked = true;
      this.setState({
        notifyPhone: true,
        phoneNumber: value.replace(/\s/g, "").trim()
      });
    }
  };

  onToggleChange = () => {
    this.setState({
      notifyPhone: !this.state.notifyPhone
    });
  };

  onToggleNotifyEmailChange = () => {
    this.setState({
      notifyEmail: !this.state.notifyEmail
    });
  };

  onToggleIsClient = () => {
    this.setState({
      isClient: !this.state.isClient
    });
  };

  handleUpdateUser = async e => {
    e.preventDefault();

    const {
      _id,
      fullName,
      email,
      phoneNumber,
      notifyPhone,
      notifyEmail,
      isClient
    } = this.state;
    const { budgetId, handleUsersChanged, hidePopup } = this.props;

    if (!/^([A-Za-z- ]){2,30}$/.test(fullName)) {
      this.setState({
        error: "Invalid characters in the Name field"
      });
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.([A-Za-z]{2,3})$/.test(email)
    ) {
      this.setState({
        error: "Invalid characters in the Email field"
      });
    } else {
      try {
        const { status, message, user } = await updateUser({
          id: _id,
          fullName,
          email,
          phoneNumber,
          notifyPhone,
          notifyEmail,
          budgetId,
          isClient
        });
        if (status === 200) {
          this.setState({
            showPopup: false
          });
          handleUsersChanged(user);
          hidePopup();
        }
        if (status === 400) {
          this.setState({
            error: message
          });
        }
      } catch (error) {
        console.log(error); // tslint:disable-line
        hidePopup();
      }
    }
  };

  handleDeleteUser = async () => {
    const { email } = this.state;
    const { budgetId, hidePopup, handleUserDeleted } = this.props;

    try {
      await removeUserFromBudget({ email, budgetId });
    } catch (error) {
      console.log(error); // tslint:disable-line
    }
    this.setState({
      showPopup: false
    });
    handleUserDeleted(email);
    hidePopup();
  };

  hiddenPopup = (user = null) => {
    this.setState({
      fullName: "",
      email: "",
      error: ""
    });
    this.props.hidePopup();
  };

  render() {
    const {
      fullName,
      email,
      error,
      showPopup,
      phoneNumber,
      notifyPhone,
      notifyEmail,
      isClient
    } = this.state;

    return (
      <Modal
        className="popup"
        visible={showPopup}
        onClose={() => this.hiddenPopup(null)}
        height={432}
      >
        <form
          className="edit-page__edit-form-popup"
          onSubmit={this.handleUpdateUser}
        >
          <span className="edit-page__edit-form-popup-title">
            Edit client information
          </span>
          {error && <span className="edit-page__error">{error}</span>}
          <div className="edit-page__edit-popup-block">
            <div className="edit-page__input-block_popup">
              <label className="edit-page__label" htmlFor="fullName">
                Name
              </label>
              <input
                className="edit-page__input edit-page__input_popup"
                type="text"
                id="fullName"
                name="fullName"
                pattern="[A-Za-z- ]*"
                defaultValue={fullName}
                onChange={this.handleChange}
              />
            </div>
            <div className="edit-page__input-block_popup">
              <label className="edit-page__label" htmlFor="email">
                Email address
              </label>
              <input
                className="edit-page__input edit-page__input_popup"
                type="text"
                id="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2, 3}$"
                name="email"
                defaultValue={email}
                onChange={this.handleChange}
              />
            </div>
            <div className="edit-page__input-block_popup">
              <label className="edit-page__label" htmlFor="phoneNumber">
                Phone number
              </label>
              <InputPhone
                className="edit-page__input edit-page__input_popup"
                id="phoneNumber"
                name="phoneNumber"
                value={phoneNumber}
                onChange={this.handleChange}
              />
            </div>
            <div className="edit-page__input-block_popup edit-checkbox">
              <label className="edit-page__label" htmlFor="phoneNumber">
                Client
              </label>
              <input
                className="edit-page__input edit-page__input_popup"
                type="checkbox"
                id="isClient"
                name="isClient"
                checked={isClient}
                onChange={this.onToggleIsClient}
              />
            </div>
            <div className="edit-page__input-block_popup edit-checkbox">
              <label className="edit-page__label" htmlFor="phoneNumber">
                Notify by Phone number
              </label>
              <input
                className="edit-page__input edit-page__input_popup"
                type="checkbox"
                id="notifyPhone"
                name="notifyPhone"
                ref={ref => (this.notifyPhoneRef = ref as HTMLInputElement)}
                checked={notifyPhone}
                disabled={!phoneNumber}
                onChange={this.onToggleChange}
              />
            </div>
            <div className="edit-page__input-block_popup edit-checkbox">
              <label className="edit-page__label" htmlFor="editNotifyEmail">
                Notify by Email
              </label>
              <input
                className="edit-page__input edit-page__input_popup"
                type="checkbox"
                id="notifyEmail"
                name="notifyEmail"
                checked={notifyEmail}
                disabled={!email}
                onChange={this.onToggleNotifyEmailChange}
              />
            </div>
          </div>
          <div className="edit-page__edit-popup-footer">
            <span className="edit-page__popup-hint">
              New users will receive an email with a generated password and
              instructions
            </span>
            <input
              className="edit-page__delete_user_button"
              type="button"
              defaultValue="Delete user"
              onClick={this.handleDeleteUser}
            />
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

export default UserEditPopup;
