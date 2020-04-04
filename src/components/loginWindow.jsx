import React from "react";
//import Joi from "joi-browser";
import Button from "@material-ui/core/Button";

import Defs from "iipzy-shared/src/defs";

import eventManager from "../ipc/eventManager";
import auth from "../services/auth";
import InfoPopup from "./infoPopup";
import Input from "./input";
import Navigator from "./navigator";
import SpinnerPopup from "./spinnerPopup";

let app = null;

class LoginWindow extends React.Component {
  constructor(props) {
    super(props);

    console.log("LoginWindow.constructor");

    this.state = { count: 0 };

    app = this;
  }

  componentDidMount() {
    console.log("LoginWindow.componentDidMount");
    this.doRender();
  }

  componentWillUnmount() {
    console.log("LoginWindow.componentWillUnmount");
    app = null;
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  getUserName() {
    return LoginWindow.userName;
  }

  getPassword() {
    return LoginWindow.password;
  }

  getInfoMessage() {
    return LoginWindow.infoMessage;
  }

  getSubmitButtonEnabled() {
    return (
      LoginWindow.buttonsEnabled &&
      (LoginWindow.isLoggedIn ||
        (LoginWindow.userName.length >= 5 && LoginWindow.password.length >= 5))
    );
  }

  handleInfoPopupClick() {
    console.log("LoginWindow.handleInfoPopupClick");
  }

  hideInfoPopup() {
    LoginWindow.showInfoPopup = false;
    LoginWindow.buttonsEnabled = true;
    this.doRender();
  }

  //handleChange = ({ currentTarget: input }) => {
  handleChange(ev) {
    const name = ev.target.name;
    const value = ev.target.value;
    console.log("LoginWindow.handleChange: " + name + " = " + value);
    switch (name) {
      case "userName": {
        LoginWindow.userName = value;
        break;
      }
      case "password": {
        LoginWindow.password = value;
        break;
      }
    }

    this.doRender();
  }

  handleSubmitClick(ev, title) {
    console.log("LoginWindow.handleSubmitClick");

    LoginWindow.buttonsEnabled = false;
    LoginWindow.title = title;
    this.doRender();
    if (!LoginWindow.isLoggedIn) {
      loginRequest({
        userName: LoginWindow.userName,
        password: LoginWindow.password,
      });
    } else {
      logoutRequest({
        userName: LoginWindow.userName,
        authToken: LoginWindow.authToken,
      });
    }
  }

  render() {
    console.log("loginWindow render");

    const isLoggedIn = LoginWindow.isLoggedIn;
    const showInfoPopup = LoginWindow.showInfoPopup;
    const showSpinner = LoginWindow.showSpinner;
    const title_ = LoginWindow.title;

    return (
      <div>
        <Navigator />
        {showInfoPopup ? (
          <InfoPopup
            title={title_}
            getInfoMessage={() => this.getInfoMessage()}
            onSubmit={(ev) => this.handleInfoPopupClick(ev)}
            closePopup={this.hideInfoPopup.bind(this)}
          />
        ) : null}
        {!isLoggedIn && (
          <div style={{ marginLeft: 20, textAlign: "left" }}>
            <p style={{ fontSize: "140%" }}>Log in @ iipzy.com</p>
          </div>
        )}
        {isLoggedIn && (
          <div style={{ marginLeft: 20, textAlign: "left" }}>
            <p style={{ fontSize: "140%" }}>Log out @ iipzy.com</p>
          </div>
        )}
        {!showInfoPopup && (
          <Input
            type="text"
            autofocus={true}
            disabled={isLoggedIn}
            name="userName"
            value={this.getUserName()}
            label="User Name"
            onChange={(ev) => this.handleChange(ev)}
            error=""
          />
        )}
        {!showInfoPopup && !isLoggedIn && (
          <Input
            type="password"
            autofocus={false}
            hidden={isLoggedIn}
            disabled={isLoggedIn}
            name="password"
            value={this.getPassword()}
            label="Password"
            onChange={(ev) => this.handleChange(ev)}
            error=""
          />
        )}
        {!showInfoPopup && !isLoggedIn && (
          <div style={{ textAlign: "center" }}>
            <Button
              type="button"
              variant="contained"
              disabled={!this.getSubmitButtonEnabled()}
              style={{
                width: "130px",
                color: "#0000b0",
              }}
              /* autoFocus */
              onClick={(ev) => this.handleSubmitClick(ev, "Log in")}
            >
              Login
            </Button>
          </div>
        )}
        {!showInfoPopup && isLoggedIn && (
          <div style={{ textAlign: "center" }}>
            <Button
              type="button"
              variant="contained"
              disabled={!this.getSubmitButtonEnabled()}
              style={{
                width: "130px",
                color: "#0000b0",
              }}
              /* autoFocus */
              onClick={(ev) => this.handleSubmitClick(ev, "Log out")}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    );
  }
}

LoginWindow.authToken = "";
LoginWindow.buttonsEnabled = true;
LoginWindow.infoMessage = "";
LoginWindow.isLoggedIn = false;
LoginWindow.password = "";
LoginWindow.showInfoPopup = false;
LoginWindow.showSpinner = false;
LoginWindow.title = "";
LoginWindow.userName = "";

async function loginRequest(params) {
  LoginWindow.showSpinner = true;
  if (app) app.doRender();

  const { data } = await auth.loginRequest(params);
  console.log(
    "LoginWindow.loginRequest (response): data = " +
      JSON.stringify(data, null, 2)
  );
  if (data.__hadError__) {
    LoginWindow.infoMessage = data.__hadError__.errorMessage;
    LoginWindow.showInfoPopup = true;
  } else {
    LoginWindow.infoMessage = "Successfully logged in";
    LoginWindow.showInfoPopup = false;
  }
  LoginWindow.buttonsEnabled = true;
  LoginWindow.showSpinner = false;
  if (app) app.doRender();
}

async function logoutRequest(params) {
  LoginWindow.showSpinner = true;
  if (app) app.doRender();

  const { data } = await auth.logoutRequest(params);
  console.log(
    "LoginWindow.logoutRequest (response): data = " +
      JSON.stringify(data, null, 2)
  );
  if (data.__hadError__) {
    LoginWindow.infoMessage = data.__hadError__.errorMessage;
  } else {
    LoginWindow.infoMessage = "Successfully logged out";
  }
  LoginWindow.password = "";
  LoginWindow.showInfoPopup = true;
  LoginWindow.showSpinner = false;
  if (app) app.doRender();
}

const handleLoginStatus = (event, data) => {
  const { userName, authToken, loginStatus } = data;

  console.log(
    "LoginWindow.handleLoginStatus: userName=" +
      userName +
      ", loginStatus = " +
      loginStatus +
      ", authToken = " +
      authToken
  );
  LoginWindow.userName = !userName ? "" : userName;
  LoginWindow.authToken = authToken;
  LoginWindow.isLoggedIn = loginStatus === Defs.loginStatusLoggedIn;

  if (app) app.doRender();
};

const handleUserAddVerified = (event, data) => {
  LoginWindow.userName = data.userName;
  if (app != null) app.doRender();
};

eventManager.on(Defs.ipcLoginStatus, handleLoginStatus);
eventManager.on(Defs.ipcUserAddVerified, handleUserAddVerified);

export default LoginWindow;
