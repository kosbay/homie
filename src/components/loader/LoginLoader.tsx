import React from "react";

import "./LoginLoader.scss";

const LoginLoader = () => (
  <div id="login-loader-container">
    <div className="progress" />
    <div className="logo-container">
      <img src="/assets/sc-logo-only.svg" alt="SC" />
    </div>
  </div>
);

export default LoginLoader;
