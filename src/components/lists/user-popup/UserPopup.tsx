import React from "react";

import { Modal, InputPhone } from "components/index";
import { addUser } from "../../../data/providers/api";

interface IState {
  editUserFullName: string;
  userEmail: string;
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
  hidePopup: (user: any) => void;
  budgetId: string;
}

class UserPopup extends React.Component<IProps, IState> {
  notifyPhoneRef: HTMLInputElement;
  constructor(props) {
    super(props);

    this.state = {
      editUserFullName: "",
      userEmail: "",
      phoneNumber: "",
      error: "",
      showPopup: this.props.showPopup,
      budgetId: this.props.budgetId,
      notifyPhone: false,
      notifyEmail: false,
      isClient: false
    };
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

  private addUser = async e => {
    e.preventDefault();

    const {
      editUserFullName,
      userEmail,
      budgetId,
      phoneNumber,
      notifyPhone,
      notifyEmail,
      isClient
    } = this.state;

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
          budgetId,
          phoneNumber,
          notifyPhone,
          notifyEmail,
          isClient
        });

        this.hiddenPopup(user);
      } catch (error) {
        if (error.response.data.isUserAlreadyExist) {
          this.setState({
            error: "User with this mail already has access to the project"
          });
        }
        if (error.response.data.isPhoneNumberExist) {
          this.setState({
            error: "This phone number already in use on other User"
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
    const {
      editUserFullName,
      userEmail,
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
                onChange={this.handleChange}
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
              <label className="edit-page__label" htmlFor="editUserFullName">
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
              <label className="edit-page__label" htmlFor="editUserFullName">
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
                disabled={!userEmail}
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
