import React from "react";
import ReactLoaderSpinner from "react-loader-spinner";

import "./Button.scss";

interface IProps {
  children?: any;
  className?: string;
  isLoading?: boolean;
  [x: string]: any;
}

export default ({ className = "", isLoading, children, ...props }: IProps) => (
  <button id="button" className={className} {...props}>
    {isLoading ? (
      <ReactLoaderSpinner
        className="loader"
        type="TailSpin"
        color="#ffffff"
        height={18}
        width={18}
      />
    ) : (
      children
    )}
  </button>
);
