import React from "react";
import Select from "react-select";

// import "./Select.scss";

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
  onKeyDown?: React.ChangeEventHandler<HTMLInputElement>;
  readOnly?: any;
  size?: string;
}

const customStyles = {
  container: styles => ({ ...styles, display: "inline-table", width: "160px" }),
  control: styles => ({ ...styles, height: 34, minHeight: 34 }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      color: "gray",
      height: 30,
      minHeight: 30,
      cursor: "pointer"
    };
  }
};

const SelectInput: React.StatelessComponent<any> = props => {
  const { placeholder = "", ...inputProps } = props;

  return (
    <Select
      {...inputProps}
      styles={{
        ...customStyles,
        ...customStyles.container({ width: "100px" })
      }}
      placeholder={placeholder}
      classNamePrefix="select"
    />
  );
};

export default SelectInput;
