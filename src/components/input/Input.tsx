import React, { Fragment } from "react";
import classnames from "classnames";

import "./Input.scss";

interface IProps {
  placeholder?: string;
  value?: string | number;
  className?: string;
  ref?: string;
  name?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onClick?: React.FormEventHandler<HTMLInputElement>;
  onFocus?: React.FormEventHandler<HTMLInputElement>;
  onBlur?: React.FormEventHandler<HTMLInputElement>;
  autoFocus?: boolean;
  input?: any;
  meta?: any;
  width?: string;
  parentClassName?: string;
  textArea?: boolean;
  borderNone?: boolean;
}

const Input: React.StatelessComponent<IProps> = props => {
  const {
    className = "",
    input = {},
    width,
    meta = {},
    value,
    parentClassName = "",
    textArea,
    borderNone,
    ...inputProps
  } = props;
  const hasError = meta.touched && meta.error;

  return (
    <Fragment>
      {textArea ? (
        <textarea
          className={classnames(
            "plat-input",
            "textarea",
            { error: hasError },
            className
          )}
          value={value}
          {...input}
          {...inputProps}
        />
      ) : (
        <input
          className={classnames("plat-input", className)}
          value={value}
          {...input}
          {...inputProps}
        />
      )}
      {hasError && <span>{meta.error}</span>}
    </Fragment>
  );
};

export default Input;
