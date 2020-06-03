import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Redirect, withRouter, RouteComponentProps } from "react-router-dom";

import { logoutAction } from "reduxFiles/users/actions";
import store from "../../data/providers/store";

import "./Header.scss";

interface IProps {
  logout: () => void;
}

class Header extends React.Component<IProps & RouteComponentProps, any> {
  constructor(props: IProps & RouteComponentProps) {
    super(props);

    this.state = {
      redirect: ""
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", () => {
      let menuShadowClass = "shadow-on";
      if (window.scrollY === 0) {
        menuShadowClass = "shadow-off";
      }
      this.setState({ menuShadowClass });
    });
  }

  logout = () => {
    this.setState({ redirect: true });
    this.props.logout();
    store.clearCache();
  };

  render() {
    const { redirect, menuShadowClass } = this.state;

    return (
      <div id="header-wrapper">
        <header id="header" className={menuShadowClass}>
          {redirect && <Redirect to="/welcome" />}
          <div className="logo">
            <img src="/assets/sc-logo.svg" alt="Second Company" />
          </div>
          <span onClick={this.logout} className="sign-off">
            Sign off
          </span>
        </header>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  logout: () => dispatch(logoutAction())
});

export default connect(
  null,
  mapDispatchToProps
)(withRouter(Header));
