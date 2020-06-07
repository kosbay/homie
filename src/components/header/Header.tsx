import React from "react";
import { Link, NavLink } from "react-router-dom";

import "./Header.scss";

const Header = ({}) => (
  <div className="header-container">
    <NavLink
      activeClassName="header-active"
      className="header-items"
      to="/courses"
    >
      Courses
    </NavLink>
    <NavLink
      activeClassName="header-active"
      className="header-items"
      to="/teachers"
    >
      Teachers
    </NavLink>
    <NavLink
      activeClassName="header-active"
      className="header-items"
      to="/students"
    >
      Students
    </NavLink>
    <NavLink
      activeClassName="header-active"
      className="header-items"
      to="/profile"
    >
      Profile
    </NavLink>
    <NavLink
      activeClassName="header-active"
      className="header-items"
      to="/index"
    >
      Welcome
    </NavLink>
  </div>
);

export default Header;
