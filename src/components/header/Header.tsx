import React from "react";
import { Link } from "react-router-dom";

import "./Header.scss";

const Header = ({}) => (
  <div className="header-container">
    <Link className="header-items" to="/courses">
      Courses
    </Link>
    <Link className="header-items" to="/courses">
      Teachers
    </Link>
    <Link className="header-items" to="/courses">
      Students
    </Link>
    <Link className="header-items" to="/courses">
      Profile
    </Link>
  </div>
);

export default Header;
