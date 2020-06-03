import React from "react";
import InputMask from "react-input-mask";

interface IProps {
  className?: string;
  onChange: (any) => any;
  id?: string;
  name: string;
  value: string;
  mask?: string;
  [x: string]: any;
}

interface IState {
  mask: string;
}

class InputPhone extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      mask: ""
    };
  }

  handleChange = e => {
    const { value, onChange } = this.props;

    if (!value) {
      this.setState({
        mask: ""
      });
    }

    if (value && value.startsWith("+3")) {
      this.setState({
        mask: "?99 99 999 9999"
      });
    }

    if (value && value.startsWith("0")) {
      this.setState({
        mask: "9 99 999 9999"
      });
    }

    onChange(e);
  };

  render() {
    const { className = "", onChange, id, name, value, ...props } = this.props;
    const { mask } = this.state;

    return (
      <InputMask
        className={className}
        id={id}
        name={name}
        value={value}
        onChange={this.handleChange}
        mask={mask}
        formatChars={{ "9": "[0-9]", "?": "[+]" }}
        maskChar={null}
        autoFocus={true}
        {...props}
      />
    );
  }
}

export default InputPhone;
