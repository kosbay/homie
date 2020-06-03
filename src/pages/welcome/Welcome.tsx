import React from "react";

import "./Welcome.scss";

class Welcome extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div className="login-page-container page">
        Welcome to Home works Platform
      </div>
    );
  }
}

export default Welcome;
