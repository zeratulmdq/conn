import React from "react";

interface PropTypes {
  label: string;
  onCheckedChange: (checked: boolean) => void;
}

interface State {
  checked: boolean;
}

class Checkbox extends React.PureComponent<PropTypes, State> {
  state: State = {
    checked: false,
  };

  handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    this.setState((prevState) => {
      const checked = !prevState.checked;
      this.props.onCheckedChange(checked);
      return {
        checked
      };
    });
  }

  render() {
    return (
      <div style={{height: "auto"}}>
        <label>
          <input
            type="checkbox"
            style={{width: 15, height: 15}}
            onChange={this.handleOnChange}
            defaultChecked={this.state.checked} />
          {this.props.label}
        </label>
      </div>
    );
  }
}

export default Checkbox;