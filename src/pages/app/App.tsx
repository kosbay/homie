import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { ReduxStore } from "reduxFiles/index";
import Routes from "./Routes";

import "../../styles/global.scss";

const App: React.FunctionComponent = () => {
  const supportsHistory = "pushState" in window.history;

  return (
    <Provider store={ReduxStore}>
      <BrowserRouter forceRefresh={!supportsHistory}>
        <Routes />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
