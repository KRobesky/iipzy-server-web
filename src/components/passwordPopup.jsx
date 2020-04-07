import React from "react";
//import Joi from "joi-browser";
//import Form from "iipzy-client-shared/src/common/form";
import Button from "@material-ui/core/Button";

import CloseButton from "./closeButton";
import Input from "./input";
import Navigator from "./navigator";

let app = null;

class PasswordPopup extends React.Component {
  constructor(props) {
    super(props);

    console.log("PasswordPopup.constructor");

    this.state = { password: "" };

    app = this;
  }

  getPassword() {
    return this.state.password;
  }

  handleChange(ev) {
    const name = ev.target.name;
    const value = ev.target.value;

    console.log("PasswordPopup.name=" + name + ", value=" + this.state[name]);

    // const errors = { ...this.state.errors };
    // const errorMessage = this.validateProperty(input);
    // if (errorMessage) errors[input.name] = errorMessage;
    // else delete errors[input.name];

    // const data = { ...this.state.data };
    // data[input.name] = input.value;
    // this.setState({ data, errors });

    this.setState({ [name]: value });
  }

  handleCloseClick(ev) {
    console.log("PasswordPopup.handleCloseClick");

    this.props.onSubmit("");
    this.props.closePopup();
    // NB: I know this is a no-no.
    this.state.password = "";
  }

  async handleSubmitClick(ev) {
    // console.log("...Popup handleSubmitClick");

    this.props.onSubmit(this.state.password);
    this.props.closePopup();
    // NB: I know this is a no-no.
    this.state.password = "";
  }

  isValidInput() {
    //?? TODO
    return true;
  }

  render() {
    console.log("PasswordPopup render");

    return (
      <div>
        <Navigator />
        <div className="popup">
          <div className="popup_inner">
            <div style={{ marginLeft: 20, textAlign: "left" }}>
              <p style={{ fontSize: "140%" }}>Enter Password</p>
            </div>
            <form>
              <Input
                type="password"
                autofocus={true}
                disabled={false}
                name="password"
                value={this.getPassword()}
                label="Password"
                onChange={(ev) => this.handleChange(ev)}
                error=""
                porportionalWidth={true}
              />
              <h1>{this.props.text}</h1>
              <div style={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!this.isValidInput()}
                  style={{
                    width: "130px",
                    color: "#0000b0",
                  }}
                  /*  autoFocus */
                  onClick={(ev) => this.handleSubmitClick(ev)}
                >
                  Submit
                </Button>
              </div>
              <CloseButton onClick={(ev) => this.handleCloseClick(ev)} />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default PasswordPopup;
