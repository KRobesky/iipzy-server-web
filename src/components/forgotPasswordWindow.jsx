import React from "react";
import Joi from "joi";
import Button from "@material-ui/core/Button";
//import { Tooltip } from "@material-ui/core/Tooltip";

import Defs from "iipzy-shared/src/defs";

import eventManager from "../ipc/eventManager";
import InfoPopup from "./infoPopup";
import Input from "./input";
import Navigator from "./navigator";
import SpinnerPopup from "./spinnerPopup";
import user from "../services/user";

let app = null;

class ForgotPasswordWindow extends React.Component {
  constructor(props) {
    super(props);

    console.log("ForgotPasswordWindow.constructor");

    this.state = {
      update: false,
      errors: {},
      count: 0,
    };

    this.data = {
      userName: null,
      passwordResetCode: null,
      password: null,
      password2: null,
    };

    app = this;

    this.schema = {
      userName: Joi.string().required().label("User Name").min(5).max(50),
      passwordResetCode: Joi.string()
        .required()
        .label("Password Reset Code")
        .min(6)
        .max(6),
      password: Joi.string().required().label("Password").min(5).max(50),
      password2: Joi.string().required().label("Password Again").min(5).max(50),
    };
  }

  componentDidMount() {
    console.log("forgotPasswordWindow componentDidMount");
    this.data.userName = ForgotPasswordWindow.userName;
    this.data.passwordResetCode = ForgotPasswordWindow.passwordResetCode;
    this.data.password = ForgotPasswordWindow.password;
    this.data.password2 = ForgotPasswordWindow.password2;

    this.doRender();
  }

  componentWillUnmount() {
    console.log("forgotPasswordWindow componentWillUnmount");
    ForgotPasswordWindow.userName = this.data.userName;
    ForgotPasswordWindow.passwordResetCode = this.data.passwordResetCode;
    ForgotPasswordWindow.password = this.data.password;
    ForgotPasswordWindow.password2 = this.data.password2;

    app = null;
  }

  validateProperty(name, value) {
    console.log("...validateProperty: name=" + name + ", value = " + value);
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);

    console.log("...validateProperty - had error = " + error);

    return error ? error.details[0].message : null;
  }

  validate() {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.data, this.schema, options);
    if (!error) return null;

    console.log("...validate - had error");

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  }

  handleChange(ev) {
    const name = ev.target.name;
    const value = ev.target.value;
    console.log("name=" + name + ", value=" + this.data[name]);
    const errors = this.state.errors;
    const errorMessage = this.validateProperty(name, value);
    if (errorMessage) errors[name] = errorMessage;
    else delete errors[name];
    const data = this.data;
    data[name] = value;
    this.setState({ data, errors });
  }

  handleClearClck(ev) {
    ForgotPasswordWindow.userName = "";
    ForgotPasswordWindow.passwordResetCode = "";
    ForgotPasswordWindow.password = "";
    ForgotPasswordWindow.password2 = "";

    ForgotPasswordWindow.showGetCodeResponsePopup = false;
    ForgotPasswordWindow.getCodeResponseMessage = "";

    ForgotPasswordWindow.showSubmitResponsePopup = false;
    ForgotPasswordWindow.getSubmitResponseMessage = "";

    ForgotPasswordWindow.inputsEnabled = true;
    ForgotPasswordWindow.buttonsEnabled = true;
    ForgotPasswordWindow.submitButtonEnabled = false;

    ForgotPasswordWindow.codeSent = false;

    this.componentDidMount();
  }

  handleGetCodeClick(ev) {
    console.log("...ForgotPasswordWindow handleGetCodeClick");
    console.log("userName=" + this.data.userName);
    // ev.preventDefault();
    // const errors = this.validate();
    // if (errors)
    //   console.log("...handleGetCodeClick: errors = " + Object.values(errors));
    // this.setState({ errors: errors || {} });
    // if (errors) return;
    // this.props.setButtonsEnabled(false);

    sendPasswordResetCode({ userName: this.data.userName });
  }

  handlePassword2Change(ev) {
    const name = ev.target.name;
    const value = ev.target.value;

    console.log("name=" + name + ", value=" + this.data[name]);

    if (this.data.password !== value) {
      const errors = this.state.errors;
      errors[name] = "passwords don't match";

      const data = this.data;
      data[name] = value;

      this.setState({ data, errors });

      return;
    }

    return this.handleChange(ev);
  }

  handleSubmitClick(ev) {
    console.log("...ForgotPasswordWindow handleSubmitClick");
    console.log("userName=" + this.data.userName);
    console.log("masswordResetCode=" + this.data.passwordResetCode);

    ev.preventDefault();
    const errors = this.validate();
    if (errors)
      console.log("...handleSubmitClick: errors = " + Object.values(errors));
    this.setState({ errors: errors || {} });
    if (errors) return;

    updatePassword({
      userName: this.data.userName,
      passwordResetCode: this.data.passwordResetCode,
      password: this.data.password,
    });
  }

  isValidInput() {
    return (
      this.isValidUserName() &&
      this.isValidPasswordResetCode() &&
      this.isValidPassword() &&
      this.data.password === this.data.password2
    );
  }

  isValidUserName() {
    return this.data.userName != null && this.data.userName.length > 5;
  }

  codeSent() {
    return ForgotPasswordWindow.codeSent;
  }

  isValidPasswordResetCode() {
    return (
      this.data.passwordResetCode != null &&
      this.data.passwordResetCode.length === 6
    );
  }

  isValidPassword() {
    return this.data.password != null && this.data.password.length > 5;
  }

  renderInput(
    name,
    label,
    type = "text",
    autofocus = false,
    disabled = false,
    onChange = null
  ) {
    const { errors } = this.state;
    const data = this.data;

    console.log(
      "ForgotPasswordWindow.renderInput: name=" + name + ", value=" + data[name]
    );

    const onChange_ = this.handleChange;

    return (
      <Input
        type={type}
        name={name}
        label={label}
        value={data[name]}
        error={errors[name]}
        autofocus={autofocus}
        disabled={disabled}
        onChange={onChange}
      />
    );
  }

  getResponseMessage() {
    return ForgotPasswordWindow.responseMessage;
  }

  handleResponsePopupClick() {
    console.log("...ForgotPasswordWindowhandleInfoPopupClick");
  }

  hideResponsePopup() {
    ForgotPasswordWindow.showResponsePopup = false;
    ForgotPasswordWindow.buttonsEnabled = true;
    this.doRender();
  }

  doRender(name, value) {
    if (name && value) this.data[name] = value;

    this.setState({ count: this.state.count + 1 });
  }

  render() {
    console.log("forgotPasswordWindow.render");

    const inputsEnabled = ForgotPasswordWindow.inputsEnabled;
    const buttonsEnabled = ForgotPasswordWindow.buttonsEnabled;
    const showResponsePopup = ForgotPasswordWindow.showResponsePopup;
    const showSpinner = ForgotPasswordWindow.showSpinner;
    const submitButtonEnabled = ForgotPasswordWindow.submitButtonEnabled;

    return (
      <div>
        <Navigator />
        {showSpinner && <SpinnerPopup />}
        {showResponsePopup && (
          <InfoPopup
            title={"Forgot Password"}
            getInfoMessage={() => this.getResponseMessage()}
            onSubmit={(ev) => this.handleResponsePopupClick(ev)}
            closePopup={this.hideResponsePopup.bind(this)}
          />
        )}
        <div style={{ marginLeft: 20, textAlign: "left" }}>
          <p style={{ fontSize: "140%" }}>Forgot Password</p>
        </div>
        <div style={{ textAlign: "left", fontWeight: "normal" }}>
          <p>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Enter your User
            Name then click the "Get Code" button below.
            <br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. A Password
            Reset Code will be sent to the user's email address.
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. Enter the code
            and the new password (twice), then click the "Submit" button.
          </p>
        </div>
        {this.renderInput(
          "userName",
          "User Name",
          "text",
          true,
          !inputsEnabled || this.codeSent(),
          (ev) => this.handleChange(ev)
        )}
        {this.renderInput(
          "passwordResetCode",
          "Password Reset Code",
          "text",
          false,
          !inputsEnabled || !this.isValidUserName() || !this.codeSent(),
          (ev) => this.handleChange(ev)
        )}
        {this.renderInput(
          "password",
          "Password",
          "password",
          false,
          !inputsEnabled || !this.isValidPasswordResetCode(),
          (ev) => this.handleChange(ev)
        )}
        {this.renderInput(
          "password2",
          "Password Again",
          "password",
          false,
          !inputsEnabled || !this.isValidPassword(),
          (ev) => this.handlePassword2Change(ev)
        )}
        <table align="center">
          <tbody>
            <tr>
              <td>
                <div style={{ textAlign: "center" }}>
                  <Button
                    type="button"
                    variant="contained"
                    disabled={
                      !buttonsEnabled ||
                      !this.isValidUserName() ||
                      this.isValidPasswordResetCode()
                    }
                    style={{
                      width: "130px",
                      color: "#0000b0",
                    }}
                    /* autoFocus */
                    onClick={(ev) => this.handleGetCodeClick(ev)}
                  >
                    Get Code
                  </Button>
                </div>
              </td>
              <td>
                <div
                  style={{
                    textAlign: "center",
                    marginLeft: 40,
                    marginRight: 40,
                  }}
                >
                  <Button
                    type="button"
                    variant="contained"
                    disabled={
                      !buttonsEnabled ||
                      !this.isValidInput() ||
                      !submitButtonEnabled
                    }
                    style={{
                      width: "130px",
                      color: "#0000b0",
                    }}
                    /* autoFocus */
                    onClick={(ev) => this.handleSubmitClick(ev)}
                  >
                    Submit
                  </Button>
                </div>
              </td>
              <td>
                <div style={{ textAlign: "center" }}>
                  <Button
                    type="button"
                    variant="contained"
                    disabled={!buttonsEnabled}
                    style={{
                      width: "130px",
                      color: "#0000b0",
                    }}
                    /* autoFocus */
                    onClick={(ev) => this.handleClearClck(ev)}
                  >
                    Clear
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

ForgotPasswordWindow.userName = "";
ForgotPasswordWindow.passwordResetCode = "";
ForgotPasswordWindow.password = "";
ForgotPasswordWindow.password2 = "";

ForgotPasswordWindow.showResponsePopup = false;
ForgotPasswordWindow.responseMessage = "";

ForgotPasswordWindow.buttonsEnabled = true;
ForgotPasswordWindow.inputsEnabled = true;
ForgotPasswordWindow.submitButtonEnabled = false;
ForgotPasswordWindow.showSpinner = false;

ForgotPasswordWindow.codeSent = false;

async function sendPasswordResetCode(params) {
  ForgotPasswordWindow.buttonsEnabled = false;
  ForgotPasswordWindow.showSpinner = true;
  if (app) app.doRender();

  const { data, status } = await user.sendPasswordResetCode(params);
  if (data.__hadError__) {
    console.log(
      "ForgotPasswordWindow.getResetCode: errorMessage = " +
        data.__hadError__.errorMessage +
        ", statusCode = " +
        data.__hadError__.statusCode
    );

    ForgotPasswordWindow.responseMessage = data.__hadError__.errorMessage;
  } else {
    ForgotPasswordWindow.responseMessage =
      "Password Reset Code has been sent to user " +
      ForgotPasswordWindow.userName;
    ForgotPasswordWindow.codeSent = true;
    ForgotPasswordWindow.submitButtonEnabled = true;
  }

  ForgotPasswordWindow.buttonsEnabled = true;
  ForgotPasswordWindow.showResponsePopup = true;
  ForgotPasswordWindow.showSpinner = false;

  if (app) app.doRender();
}

async function updatePassword(params) {
  ForgotPasswordWindow.buttonsEnabled = false;
  ForgotPasswordWindow.showSpinner = true;
  if (app) app.doRender();

  const { data, status } = await user.newPassword(params);
  if (data.__hadError__) {
    console.log(
      "ForgotPasswordWindow.updatePassword: errorMessage = " +
        data.__hadError__.errorMessage +
        ", statusCode = " +
        data.__hadError__.statusCode
    );

    ForgotPasswordWindow.responseMessage = data.__hadError__.errorMessage;
  } else {
    ForgotPasswordWindow.responseMessage =
      "Password has been changed for user " + ForgotPasswordWindow.userName;
    ForgotPasswordWindow.inputsEnabled = false;
    ForgotPasswordWindow.submitButtonEnabled = false;
  }

  ForgotPasswordWindow.buttonsEnabled = true;
  ForgotPasswordWindow.showResponsePopup = true;
  ForgotPasswordWindow.showSpinner = false;

  if (app) app.doRender();
}

const handleLoginStatus = (event, data) => {
  const { userName } = data;

  console.log("ForgotPasswordWindow.handleLoginStatus: userName " + userName);

  ForgotPasswordWindow.userName = userName;

  if (app != null) app.doRender("userName", userName);
};

eventManager.on(Defs.ipcLoginStatus, handleLoginStatus);

export default ForgotPasswordWindow;
