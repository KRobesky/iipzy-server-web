import React from "react";
import Button from "@material-ui/core/Button";

import Defs from "iipzy-shared/src/defs";

import eventManager from "../ipc/eventManager";
import user from "../services/user";
import InfoPopup from "./infoPopup";
import Navigator from "./navigator";
import PasswordPopup from "./passwordPopup";
import UserForm from "./userForm";

let app = null;

class EditUserWindow extends UserForm {
  constructor(props) {
    super(props);

    console.log("EditUserWindow.constructor");

    this.windowTitle = "Update User @ iipzy.com";

    this.userId = 0;

    app = this;
  }

  componentDidMount() {
    console.log("EditUserWindow.componentDidMount");
    EditUserWindow.buttonsEnabled = false;
    EditUserWindow.fieldsEnabled = true;
    EditUserWindow.showPasswordPopup = true;
    EditUserWindow.passwordValidated = false;
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  componentWillUnmount() {
    console.log("EditUserWindow.componentWillUnmount");
    app = null;
  }

  getUserData() {
    const userData = {
      userName: EditUserWindow.userName,
      emailAddress: EditUserWindow.emailAddress,
      mobilePhoneNo: EditUserWindow.mobilePhoneNo,
      password: EditUserWindow.password,
      password2: EditUserWindow.password2
    };
    console.log("EditUserWindow.getUserData: " + JSON.stringify(userData));
    console.log(
      "EditUserWindow.getUserData: emailAddress = " + userData.emailAddress
    );
    return userData;
  }

  setUserData(userData) {
    console.log(
      "EditUserWindow.setUserData: emailAddress = " + userData.emailAddress
    );
    EditUserWindow.userName = userData.userName;
    EditUserWindow.emailAddress = userData.emailAddress;
    EditUserWindow.mobilePhoneNo = userData.mobilePhoneNo;
    EditUserWindow.password = userData.password;
    EditUserWindow.password2 = userData.password2;
  }

  getButtonsEnabled() {
    console.log(
      "EditUserWindow.getButtonsEnabled: " + EditUserWindow.buttonsEnabled
    );
    return EditUserWindow.buttonsEnabled;
  }

  setButtonsEnabled(buttonsEnabled) {
    EditUserWindow.buttonsEnabled = buttonsEnabled;
    console.log(
      "EditUserWindow.setButtonsEnabled: " + EditUserWindow.buttonsEnabled
    );
  }

  getFieldsEnabled() {
    console.log(
      "EditUserWindow.getFieldsEnabled: " + EditUserWindow.fieldsEnabled
    );
    return EditUserWindow.fieldsEnabled;
  }

  setFieldsEnabled(fieldsEnabled) {
    EditUserWindow.fieldsEnabled = fieldsEnabled;
    console.log(
      "EditUserWindow.setFieldsEnabled: " + EditUserWindow.fieldsEnabled
    );
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  async handleUpdateClick(userData) {
    console.log("EditUserWindow.handleUpdateClick");
    console.log("userName=" + userData.userName);
    console.log("mobilePhoneNo=" + userData.mobilePhoneNo);
    console.log("emailAddress=" + userData.emailAddress);

    updateUser(userData);
  }

  async handleDeleteClick(userData) {
    console.log("EditUserWindow handleDeleteClick");
    deleteUser(userData);
  }

  handleLoginClick(ev) {
    console.log("...handleLoginClick");
    eventManager.send(Defs.ipcLinkTo, Defs.urlLogin);
  }

  getInfoMessage() {
    return EditUserWindow.infoMessage;
  }

  handleInfoPopupClick() {
    console.log("...EditUserWindowhandleInfoPopupClick");
  }

  hideInfoPopup() {
    EditUserWindow.showInfoPopup = false;
    EditUserWindow.buttonsEnabled = true;
    EditUserWindow.fieldsEnabled = true;
    this.doRender();
  }

  handlePasswordPopupClick(password) {
    if (password === EditUserWindow.password) {
      console.log("...handlePasswordPopupClick: password match");
      EditUserWindow.passwordValidated = true;
      EditUserWindow.passwordSupplied = true;
    } else if (!password) {
      console.log("...handlePasswordPopupClick: password empty");
      EditUserWindow.passwordValidated = false;
      EditUserWindow.passwordSupplied = false;
    }
  }

  hidePasswordPopup() {
    console.log("...hidePasswordPopup");
    if (EditUserWindow.passwordValidated) {
      EditUserWindow.showPasswordPopup = false;
      EditUserWindow.buttonsEnabled = true;
    } else if (!EditUserWindow.passwordSupplied) {
      EditUserWindow.showPasswordPopup = false;
      EditUserWindow.buttonsEnabled = false;
    }
    EditUserWindow.fieldsEnabled = true;
    this.doRender();
  }

  render() {
    const isLoggedIn = EditUserWindow.isLoggedIn;
    console.log("EditUserWindow.render: isLoggedIn = " + isLoggedIn);

    const showPasswordPopup = EditUserWindow.showPasswordPopup;
    const showInfoPopup = EditUserWindow.showInfoPopup;
    const passwordSupplied = EditUserWindow.passwordSupplied;

    return (
      <div>
        {isLoggedIn && showPasswordPopup ? (
          <PasswordPopup
            onSubmit={ev => this.handlePasswordPopupClick(ev)}
            closePopup={this.hidePasswordPopup.bind(this)}
          />
        ) : null}
        {showInfoPopup ? (
          <InfoPopup
            title={"Edit User"}
            getInfoMessage={() => this.getInfoMessage()}
            onSubmit={ev => this.handleInfoPopupClick(ev)}
            closePopup={this.hideInfoPopup.bind(this)}
          />
        ) : null}
        {!isLoggedIn && !showInfoPopup && (
          <div>
            <Navigator />
            <div style={{ marginLeft: 20, textAlign: "left" }}>
              <p style={{ fontSize: "140%" }}>{this.windowTitle}</p>
            </div>
            <div style={{ marginLeft: 20, textAlign: "left" }}>
              <p style={{ fontSize: "140%" }}>
                You must be logged in to edit your user settings
              </p>
              <Button
                type="button"
                variant="contained"
                style={{
                  width: "130px",
                  color: "#0000b0"
                }}
                autoFocus
                onClick={ev => this.handleLoginClick(ev)}
              >
                Login
              </Button>
            </div>
          </div>
        )}
        {isLoggedIn && !showPasswordPopup && passwordSupplied && (
          <UserForm
            title={this.windowTitle}
            getUserData={this.getUserData}
            setUserData={this.setUserData}
            getButtonsEnabled={this.getButtonsEnabled}
            setButtonsEnabled={this.setButtonsEnabled}
            getFieldsEnabled={this.getFieldsEnabled}
            setFieldsEnabled={this.setFieldsEnabled}
            userNameDisabled={true}
            button1Label={"Update"}
            onSubmit={ev => this.handleUpdateClick(ev)}
            button2Label={"Delete"}
            onSubmit2={ev => this.handleDeleteClick(ev)}
          />
        )}
      </div>
    );
  }
}

EditUserWindow.userName = "";
EditUserWindow.emailAddress = "";
EditUserWindow.mobilePhoneNo = "";
EditUserWindow.password = "";
EditUserWindow.password2 = "";

EditUserWindow.userId = 0;
EditUserWindow.isAdmin = false;
EditUserWindow.isLoggedIn = false;
EditUserWindow.authToken = "";

EditUserWindow.showInfoPopup = false;
EditUserWindow.showPasswordPopup = true;
EditUserWindow.passwordSupplied = false;
EditUserWindow.passwordValidated = false;
EditUserWindow.buttonsEnabled = false;
EditUserWindow.fieldsEnabled = true;

async function deleteUser(userData) {
  const { data, status } = await user.deleteUser(userData);
  if (data.__hadError__) {
    console.log(
      "EditUserWindow.deleteUser: errorMessage = " +
        data.__hadError__.errorMessage +
        ", statusCode = " +
        data.__hadError__.statusCode
    );

    EditUserWindow.infoMessage = data.__hadError__.errorMessage;

    EditUserWindow.showInfoPopup = true;
    EditUserWindow.buttonsEnabled = false;
    EditUserWindow.fieldsEnabled = true;

    if (app) app.doRender();

    return;
  }

  eventManager.send(Defs.ipcSubmitLogout, {
    userName: EditUserWindow.userName,
    authToken: EditUserWindow.authToken
  });

  EditUserWindow.infoMessage = EditUserWindow.userName + " deleted";
  EditUserWindow.showInfoPopup = true;
  EditUserWindow.buttonsEnabled = false;
  EditUserWindow.fieldsEnabled = true;

  EditUserWindow.userId = 0;
  EditUserWindow.userName = "";
  EditUserWindow.emailAddress = "";
  EditUserWindow.mobilePhoneNo = "";
  EditUserWindow.password = "";
  EditUserWindow.password2 = "";
  EditUserWindow.isAdmin = false;
  EditUserWindow.isLoggedIn = false;
  EditUserWindow.authToken = "";

  if (app) app.doRender();
}

async function updateUser(userData) {
  const { data, status } = await user.updateUser(userData);
  if (data.__hadError__) {
    console.log(
      "EditUserWindow.updateUser: errorMessage = " +
        data.__hadError__.errorMessage +
        ", statusCode = " +
        data.__hadError__.statusCode
    );

    EditUserWindow.infoMessage = data.__hadError__.errorMessage;

    EditUserWindow.showInfoPopup = true;
    EditUserWindow.buttonsEnabled = false;
    EditUserWindow.fieldsEnabled = true;

    if (app) app.doRender();

    return;
  }

  EditUserWindow.mobilePhoneNo = userData.mobilePhoneNo;
  EditUserWindow.emailAddress = userData.emailAddress;
  EditUserWindow.password = userData.password;

  EditUserWindow.infoMessage = EditUserWindow.userName + " updated";
  EditUserWindow.showInfoPopup = true;
  EditUserWindow.buttonsEnabled = false;
  EditUserWindow.fieldsEnabled = true;

  if (app) app.doRender();
}

const handleLoginStatus = async (event, data) => {
  const { userName, authToken, password, loginStatus } = data;
  console.log(
    "EditUserWindow.handleLoginStatus: userName = " +
      userName +
      ", loginStatus = " +
      loginStatus
  );
  EditUserWindow.userName = userName;
  // NB: password comes from local storage, not from server DB.
  EditUserWindow.password = password;
  EditUserWindow.password2 = password;
  EditUserWindow.isLoggedIn = loginStatus === Defs.loginStatusLoggedIn;
  EditUserWindow.authToken = authToken;
  if (EditUserWindow.isLoggedIn && !EditUserWindow.emailAddress) {
    await getUser();
  }
};

async function getUser() {
  const { data, status } = await user.getUser();
  console.log(
    "EditUserWindow.handleUserGetResponse: emailAddress = " +
      data.emailAddress +
      ", mph = " +
      data.mobilePhoneNo
  );

  EditUserWindow.userId = data.userId;
  EditUserWindow.emailAddress = data.emailAddress;
  EditUserWindow.mobilePhoneNo = data.mobilePhoneNo;
  EditUserWindow.isAdmin = data.isAdmin;
  if (app) app.doRender();
}

eventManager.on(Defs.ipcLoginStatus, handleLoginStatus);

export default EditUserWindow;
