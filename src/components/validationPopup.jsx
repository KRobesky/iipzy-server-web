import React from "react";
//import Joi from "joi-browser";
//import Form from "iipzy-client-shared/src/common/form";
import Button from "@material-ui/core/Button";
//import Button from "@material-ui/core/Button").Button;

import CloseButton from "./closeButton";
import Input from "./input";
import Navigator from "./navigator";

//let app = null;

class ValidationPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { code: "" };

    console.log("ValidationPopup.constructor");

    //app = this;
  }

  getCode() {
    return this.state.code;
  }

  handleChange(ev) {
    const name = ev.target.name;
    const value = ev.target.value;

    console.log(
      "ValidationPopup.handleChange: name = " +
        name +
        ", value = " +
        this.state[name]
    );

    this.setState({ [name]: value });
  }

  async handleSubmitClick(ev) {
    console.log("ValidationPopup.handleSubmitClick");
    console.log("code=" + this.state.code);

    this.props.closePopup();
    this.props.onSubmit(this.state.code);
  }

  async handleCancelClick(ev) {
    console.log("ValidationPopup.handleCancelClick");

    this.props.closePopup();
    this.props.onSubmit("000000");
  }

  isValidInput() {
    //?? TODO
    return true;
  }

  render() {
    console.log("ValidationPopup.render");

    return (
      <div>
        <Navigator />
        <div className="popup">
          <div className="popup_inner">
            <div style={{ marginLeft: 20, textAlign: "left" }}>
              <p style={{ fontSize: "140%" }}>Enter Validation Code</p>
            </div>
            <Input
              type="text"
              autofocus={true}
              disabled={false}
              name="code"
              value={this.getCode()}
              label="Code"
              onChange={ev => this.handleChange(ev)}
              error=""
            />
            <h1>{this.props.text}</h1>
            <div style={{ textAlign: "center" }}>
              <Button
                type="button"
                variant="contained"
                disabled={!this.isValidInput()}
                style={{
                  width: "130px",
                  color: "#0000b0"
                }}
                autoFocus
                onClick={ev => this.handleSubmitClick(ev)}
              >
                Submit
              </Button>
            </div>
            <CloseButton onClick={ev => this.handleCancelClick(ev)} />
          </div>
        </div>
      </div>
    );
  }
}

export default ValidationPopup;
