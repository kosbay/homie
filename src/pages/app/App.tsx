import React from "react";
import { BrowserRouter } from "react-router-dom";

import Routes from "./Routes";

import "../../styles/global.scss";

const App: React.FunctionComponent = () => {
  const supportsHistory = "pushState" in window.history;

  return (
    <BrowserRouter forceRefresh={!supportsHistory}>
      <Routes />
    </BrowserRouter>
  );
};

export default App;
