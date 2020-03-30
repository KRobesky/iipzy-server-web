import React from "react";
import Spinner from "react-bootstrap/Spinner";

import Defs from "iipzy-shared/src/defs";

import eventManager from "../ipc/eventManager";
import user from "../services/user";
import InfoPopup from "./infoPopup";
//import SpinnerPopup from "./spinnerPopup";
import ValidationPopup from "./validationPopup";
import UserForm from "./userForm";

let app = null;

class AddUserWindow extends UserForm {
  constructor(props) {
    super(props);

    console.log("AddUserWindow.constructor");

    this.state = { count: 0 };

    app = this;
  }

  componentDidMount() {
    console.log("AddUserWindow.componentDidMount");
    // const count = this.state.count + 1;
    // this.setState({ count: count });
    this.doRender();
  }

  componentWillUnmount() {
    console.log("AddUserWindow.componentWillUnmount");
    app = null;
  }

  getUserData() {
    const userData = {
      userName: AddUserWindow.userName,
      emailAddress: AddUserWindow.emailAddress,
      mobilePhoneNo: AddUserWindow.mobilePhoneNo,
      password: AddUserWindow.password,
      password2: AddUserWindow.password2
    };
    return userData;
  }

  setUserData(userData) {
    AddUserWindow.userName = userData.userName;
    AddUserWindow.emailAddress = userData.emailAddress;
    AddUserWindow.mobilePhoneNo = userData.mobilePhoneNo;
    AddUserWindow.password = userData.password;
    AddUserWindow.password2 = userData.password2;
  }

  async handleAddClick(userData) {
    console.log("AddUserWindow.handleAddClick");
    console.log("  userName=" + userData.userName);
    console.log("  mobilePhoneNo=" + userData.mobilePhoneNo);
    console.log("  emailAddress=" + userData.emailAddress);

    // save in globals.
    AddUserWindow.userName = userData.userName;
    AddUserWindow.mobilePhoneNo = userData.mobilePhoneNo;
    AddUserWindow.emailAddress = userData.emailAddress;
    AddUserWindow.password = userData.password;
    AddUserWindow.password2 = userData.password;

    await this.addUser(userData);
  }

  async addUser(userData) {
    console.log("AddUserWindow.addUser");

    AddUserWindow.showSpinner = true;
    this.doRender();

    const { data, status } = await user.addUser(userData);
    if (data.__hadError__) {
      console.log(
        "addUserWindow.handleUserAddResponse: errorMessage = " +
          data.__hadError__.errorMessage +
          ", statusCode = " +
          data.__hadError__.statusCode
      );

      AddUserWindow.infoMessage = data.__hadError__.errorMessage;

      AddUserWindow.showInfoPopup = true;
      AddUserWindow.showSpinner = false;
      AddUserWindow.buttonsEnabled = false;

      this.doRender();

      return;
    }

    AddUserWindow.userId = data.userId;
    console.log("AddUserWindow.addUser: userId = " + AddUserWindow.userId);
    AddUserWindow.showSpinner = false;
    AddUserWindow.showValidationPopup = true;
    AddUserWindow.buttonsEnabled = false;

    this.doRender();
  }

  getInfoMessage() {
    return AddUserWindow.infoMessage;
  }

  handleInfoPopupClick() {
    console.log("AddUserWindow.handleInfoPopupClick");
  }

  hideInfoPopup() {
    AddUserWindow.showInfoPopup = false;
    AddUserWindow.buttonsEnabled = !AddUserWindow.showValidationPopup;
    if (AddUserWindow.isVerified) {
      eventManager.send(Defs.ipcUserAddVerified, {
        userName: AddUserWindow.userName
      });
      AddUserWindow.isVerified = false;
    }
    this.doRender();
  }

  async handleVerifyClick(verificationCode) {
    console.log("AddUserWindow.handleVerifyClick, code" + verificationCode);
    if (verificationCode !== "000000")
      await this.verifyUser({
        userId: AddUserWindow.userId,
        verificationCode: verificationCode
      });
  }

  async verifyUser(params) {
    AddUserWindow.showSpinner = true;
    this.doRender();

    const { data, status } = await user.verifyUser(params);
    if (data.__hadError__) {
      console.log(
        "AddUserWindow.handleUserVerifyResponse: errorMessage = " +
          data.__hadError__.errorMessage +
          ", statusCode = " +
          data.__hadError__.statusCode
      );

      AddUserWindow.infoMessage = data.__hadError__.errorMessage;

      AddUserWindow.showInfoPopup = true;
      AddUserWindow.buttonsEnabled = false;
      AddUserWindow.showSpinner = false;
      AddUserWindow.showValidationPopup = true;

      this.doRender();

      return;
    }

    console.log(
      "AddUserWindow.handleUserVerifyResponse: isVerified = " + data.isVerified
    );

    AddUserWindow.showValidationPopup = false;

    AddUserWindow.infoMessage = AddUserWindow.userName + " registered";
    AddUserWindow.showInfoPopup = true;
    AddUserWindow.buttonsEnabled = false;
    AddUserWindow.showSpinner = false;
    AddUserWindow.isVerified = true;

    this.doRender();
  }

  hideValidationCodePopup() {
    AddUserWindow.showValidationPopup = false;
    AddUserWindow.buttonsEnabled = true;
    this.doRender();
  }

  getButtonsEnabled() {
    console.log(
      "addUserWindow.getButtonsEnabled: " + AddUserWindow.buttonsEnabled
    );
    return AddUserWindow.buttonsEnabled;
  }

  setButtonsEnabled(buttonsEnabled) {
    AddUserWindow.buttonsEnabled = buttonsEnabled;
    console.log("AddUserWindow.setButtonsEnabled");
  }

  doRender() {
    console.log("AddUserWindow.doRender");
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  render() {
    console.log("AddUserWindow.render");

    const showInfoPopup = AddUserWindow.showInfoPopup;
    const showSpinner = AddUserWindow.showSpinner;
    const showValidationPopup = AddUserWindow.showValidationPopup;

    console.log("AddUserWindow.render: showInfoPopup = " + showInfoPopup);
    console.log("AddUserWindow.render: showSpinner = " + showSpinner);
    console.log(
      "AddUserWindow.render: showValidationPopup = " + showValidationPopup
    );

    const ret = (
      <div>
        {showValidationPopup && (
          <ValidationPopup
            onSubmit={ev => this.handleVerifyClick(ev)}
            closePopup={this.hideValidationCodePopup.bind(this)}
          />
        )}
        {showInfoPopup && (
          <InfoPopup
            title={"Register User"}
            getInfoMessage={() => this.getInfoMessage()}
            onSubmit={ev => this.handleInfoPopupClick(ev)}
            closePopup={this.hideInfoPopup.bind(this)}
          />
        )}
        {/*         {showSpinner && (
          <div>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        )} */}
        <UserForm
          title={"Register User @ iipzy.com"}
          getUserData={this.getUserData}
          setUserData={this.setUserData}
          getButtonsEnabled={this.getButtonsEnabled}
          setButtonsEnabled={this.setButtonsEnabled}
          userNameDisabled={false}
          button1Label={"Register"}
          onSubmit={ev => this.handleAddClick(ev)}
        />
      </div>
    );
    console.log("<<<AddUserWindow.render");
    return ret;
  }
}

AddUserWindow.userName = "";
AddUserWindow.emailAddress = "";
AddUserWindow.mobilePhoneNo = "";
AddUserWindow.password = "";
AddUserWindow.password2 = "";

// NB: if true, we are in the window for first time registration.
AddUserWindow.needRegistration = false;

AddUserWindow.buttonsEnabled = true;

AddUserWindow.showInfoPopup = false;
AddUserWindow.infoMessage = "";
AddUserWindow.showSpinner = false;
AddUserWindow.showValidationPopup = false;

AddUserWindow.userId = 0;
AddUserWindow.isVerified = false;

export default AddUserWindow;
