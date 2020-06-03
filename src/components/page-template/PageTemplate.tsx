import React from "react";
import classnames from "classnames";
import { withRouter } from "react-router-dom";

import OfflineWidget from "components/offline-widget/OfflineWidget";

import "./PageTemplate.scss";

interface IProps {
  children: object;
  theme: string;
  location: { pathname: string };
}

class PageTemplate extends React.Component<IProps, any> {
  constructor(props) {
    super(props);
  }

  prev = () => {
    const {
      location: { pathname }
    } = this.props;
    return !(
      pathname === "/" ||
      pathname === "/dashboard" ||
      pathname === "/admin"
    );
  };

  render() {
    const { theme, children } = this.props;

    return (
      <div
        id="page-template"
        className={classnames("page", { "page--prev": this.prev() })}
      >
        <OfflineWidget />
        <div className={classnames("container-wrapper", theme)}>
          <div className="container">{children}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(PageTemplate);
