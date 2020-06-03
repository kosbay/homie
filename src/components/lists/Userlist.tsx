import React from "react";
import moment from "moment";

import UserPopup from "./user-popup/UserPopup";
import UserEditPopup from "./user-popup/UserEditPopup";
import { Modal } from "components/index";
import { IBudget } from "reduxFiles/budgets/types";
import { IUser } from "reduxFiles/users/types";

import "./Userlist.scss";

interface IProps {
  budget: IBudget;
}

interface IEditableUser extends IUser {
  isEdit: boolean;
}

interface IState {
  users: IEditableUser[];
  editUserFullName: string;
  editUserEmail: string;
  editUserFullNameError: boolean;
  editUserEmailError: boolean;
  showPopup: boolean;
  editUserPhoneNumber: string;
  error: string;
  editItem: boolean;
  showEditPopup: boolean;
  editingUser: any;
}

class UserList extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    const {
      budget: { budgetUsers }
    } = props;
    this.state = {
      users: budgetUsers ? budgetUsers : [],
      editUserFullName: "",
      editUserEmail: "",
      editUserPhoneNumber: "",
      editUserFullNameError: false,
      editUserEmailError: false,
      showPopup: false,
      error: "",
      editItem: false,
      showEditPopup: false,
      editingUser: null
    };
  }

  componentDidUpdate(prevProps: IProps) {
    const { budget } = this.props;
    if (budget !== prevProps.budget) {
      if (budget.budgetUsers) {
        this.setState({
          users: budget.budgetUsers.map(user => {
            return { ...user, isEdit: false };
          })
        });
      }
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

  getDateFormat = (date: Date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  private onEdit = id => {
    const { users } = this.state;
    const editUserIndex = users.findIndex(({ _id }) => _id === id);

    users[editUserIndex].isEdit = true;

    this.setState({
      editingUser: users[editUserIndex]
    });
    this.openEditPopup();
  };

  openPopup = () => {
    this.setState({
      showPopup: true
    });
  };

  hidePopup = (user = null) => {
    if (user === null) {
      this.setState({
        showPopup: false
      });
    } else {
      const { users } = this.state;
      users.push(user!);
      this.setState({
        users,
        showPopup: false
      });
    }
  };

  handleUsersChanged = user => {
    const { users } = this.state;
    const { _id: id, fullName, email, phoneNumber, notificationType } = user;
    const editUserIndex = users.findIndex(({ _id }) => _id === id);

    users[editUserIndex].isEdit = false;
    users[editUserIndex].fullName = fullName;
    users[editUserIndex].email = email;
    users[editUserIndex].phoneNumber = phoneNumber;
    users[editUserIndex].notificationType = notificationType;

    this.setState({
      users
    });
  };

  handleUserDeleted = email => {
    let { users } = this.state;

    users = users.filter(({ email: userEmail }) => userEmail !== email);

    this.setState({
      users
    });
  };

  openEditPopup = () => {
    this.setState({
      showEditPopup: true
    });
  };

  hideEditPopup = () => {
    this.setState({
      showEditPopup: false
    });
  };

  onCloseErrorModal = () => {
    this.setState({
      error: ""
    });
  };

  render() {
    const { users, showPopup, error, editingUser, showEditPopup } = this.state;
    const { budget } = this.props;

    return (
      <div className="userlist__container">
        <Modal
          className="popup"
          visible={Boolean(error)}
          onClose={this.onCloseErrorModal}
          height={100}
          width={300}
        >
          <div className="user-edit-error">{error}</div>
        </Modal>
        <h2 className="block-title">User accounts</h2>
        <table className={`userlist-table`}>
          <thead className="userlist__header">
            <tr className="userlist__row">
              <td className="userlist__cell userlist__cell_head userlist__cell_first">
                Name
              </td>
              <td className="userlist__cell userlist__cell_head">E-mail</td>
              <td className="userlist__cell userlist__cell_head">
                Phone number
              </td>
              <td className="userlist__cell userlist__cell_head">Last login</td>
              <td className="userlist__cell userlist__cell_head" />
            </tr>
          </thead>
          <tbody className="userlist__body">
            {users.map(({ fullName, email, _id, lastLogin, phoneNumber }) => {
              return (
                <tr className="userlist__row" key={_id}>
                  <td className="userlist__cell userlist__cell_first userlist__cell_bold">
                    <span>{fullName}</span>
                  </td>
                  <td className="userlist__cell">
                    <span>{email}</span>
                  </td>
                  <td className="userlist__cell">
                    <span>{phoneNumber}</span>
                  </td>
                  <td className="userlist__cell">
                    <span>
                      {lastLogin
                        ? this.getDateFormat(lastLogin)
                        : "Not logged in yet"}
                    </span>
                  </td>
                  <td className="userlist__cell userlist__cell_last">
                    <i
                      onClick={() => this.onEdit(_id)}
                      className="material-icons userlist__pen-icon unselectable clickable"
                    >
                      edit
                    </i>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="userlist__footer">
            <tr className="userlist__footer-container" onClick={this.openPopup}>
              <td className="userlist__footer-td">
                <i className="material-icons">add</i>
                <span className="userlist__footer-text">Add user</span>
              </td>
            </tr>
          </tfoot>
        </table>
        <UserPopup
          showPopup={showPopup}
          hidePopup={this.hidePopup}
          budgetId={budget._id}
        />
        {showEditPopup && (
          <UserEditPopup
            showPopup={showEditPopup}
            hidePopup={this.hideEditPopup}
            user={editingUser}
            budgetId={budget._id}
            handleUsersChanged={this.handleUsersChanged}
            handleUserDeleted={this.handleUserDeleted}
          />
        )}
      </div>
    );
  }
}

export default UserList;
