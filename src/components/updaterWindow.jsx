import React from "react";
import Button from "@material-ui/core/Button";
import Spinner from "react-bootstrap/Spinner";
import uuidv4 from "uuid/v4";

import Defs from "iipzy-shared/src/defs";

import cookie from "../utils/cookie";
import ClientPicker from "./clientPicker";
import InfoPopup from "./infoPopup";
import Navigator from "./navigator";
import SpinnerPopup from "./spinnerPopup";
import updater from "../services/updater";

let app = null;

class UpdaterWindow extends React.Component {
  constructor(props) {
    super(props);

    console.log("UpdaterWindow.constructor");

    app = this;

    this.state = { count: 0 };

    this.inSendUpdaterStatusGetRequest = false;
  }

  componentDidMount() {
    console.log("UpdaterWindow.componentDidMount");
    this.getUpdaterSettings();
    try {
      UpdaterWindow.statusInterval = setInterval(async () => {
        if (!this.inSendUpdaterStatusGetRequest) {
          this.inSendUpdaterStatusGetRequest = true;
          await getUpdaterStatus();
          this.inSendUpdaterStatusGetRequest = false;
        }
      }, 1 * 1000);
    } catch (ex) {
      console.log("(Exception) " + ex);
    }
  }

  componentWillUnmount() {
    console.log("UpdaterWindow.componentWillUnmount");
    clearInterval(UpdaterWindow.statusInterval);
    UpdaterWindow.statusInterval = null;
    app = null;
  }

  handleSaveClick(ev) {
    console.log("...UpdaterWindow handleSaveClick");
    cookie.set("updaterSettings", {
      tgtClientToken: UpdaterWindow.tgtClientToken,
      updateType: UpdaterWindow.updateType,
    });
  }

  handleSubmitClick(ev) {
    console.log("...UpdaterWindow handleSubmitClick");

    UpdaterWindow.submitTimeout = setTimeout(() => {
      if (UpdaterWindow.submitTimeout) {
        UpdaterWindow.waitForInProgress = false;
        UpdaterWindow.status = "timed out";
        this.doRender();
      }
    }, 30 * 1000);

    UpdaterWindow.waitForInProgress = true;
    UpdaterWindow.status = "contacting server...";
    this.doRender();

    cookie.set("updaterSettings", {
      tgtClientToken: UpdaterWindow.tgtClientToken,
      updateType: UpdaterWindow.updateType,
    });

    postUpdaterUpdate({
      tgtClientToken: UpdaterWindow.tgtClientToken,
      updateType: UpdaterWindow.updateType,
      updateUuid: uuidv4(),
    });
  }

  getUpdaterSettings() {
    const settings = cookie.get("updaterSettings");
    if (settings) {
      const { tgtClientToken, updateType } = settings;
      if (tgtClientToken) UpdaterWindow.tgtClientToken = tgtClientToken;
      if (updateType) UpdaterWindow.updateType = updateType;
      if (app != null) app.doRender();
    }
  }

  handleUpdateTypeChange(ev) {
    console.log("...UpdaterWindow handleUpdateTypeChange: " + ev.target.value);
    UpdaterWindow.updateType = ev.target.value;
    this.doRender();
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  getClientToken() {
    return UpdaterWindow.tgtClientToken;
  }

  getDisabled() {
    return UpdaterWindow.waitForInProgress || UpdaterWindow.inProgress;
  }

  getEnableSave() {
    return true;
  }

  getEnableSubmit() {
    if (UpdaterWindow.tgtClientToken.length < 16) return false;

    if (UpdaterWindow.inProgress) {
      UpdaterWindow.waitForInProgress = false;
      if (UpdaterWindow.submitTimeout) {
        clearTimeout(UpdaterWindow.submitTimeout);
        UpdaterWindow.submitTimeout = null;
      }
    }
    return !UpdaterWindow.waitForInProgress && !UpdaterWindow.inProgress;
  }

  getInfoMessage() {
    return UpdaterWindow.infoMessage;
  }

  handleClientPick(ev) {
    console.log("UpdaterWindow.handleClientPick: " + ev);
    UpdaterWindow.tgtClientToken = ev;
  }

  handleInfoPopupClick(ev) {
    console.log("UpdaterWindow.handleInfoPopupClick");
  }

  hideInfoPopup() {
    UpdaterWindow.showInfoPopup = false;
    this.doRender();
  }

  render() {
    console.log("UpdaterWindow render");

    const updateType = UpdaterWindow.updateType;
    const disabledWhileUpdating =
      UpdaterWindow.waitForInProgress || UpdaterWindow.inProgress;
    const updateStatus = UpdaterWindow.status;
    const showSpinner = disabledWhileUpdating;

    const showInfoPopup = UpdaterWindow.showInfoPopup;

    return (
      <div>
        <Navigator />
        {showSpinner && <SpinnerPopup />}
        {showInfoPopup && (
          <InfoPopup
            title={"Sentinel Update"}
            getInfoMessage={() => this.getInfoMessage()}
            onSubmit={(ev) => this.handleInfoPopupClick(ev)}
            closePopup={this.hideInfoPopup.bind(this)}
          />
        )}
        {!showInfoPopup && (
          <div>
            <div style={{ marginLeft: 20, textAlign: "left" }}>
              <p style={{ fontSize: "140%" }}>Update Sentinel</p>
            </div>
            <div style={{ marginLeft: "20px" }}>
              <table align="left">
                <tbody>
                  <tr>
                    <td>&nbsp;</td>
                  </tr>

                  <tr>
                    <td>Client:</td>
                    <td>
                      <ClientPicker
                        onPick={(ev) => this.handleClientPick(ev)}
                        getDisabled={this.getDisabled}
                        getSelectedClientToken={this.getClientToken}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Update Type:&nbsp;</td>
                    <table align="left">
                      <tbody>
                        <tr>
                          <input
                            type="radio"
                            name="update-type"
                            value="iipzy-pi"
                            checked={updateType === "iipzy-pi"}
                            disabled={disabledWhileUpdating}
                            onChange={(ev) => this.handleUpdateTypeChange(ev)}
                          />
                          &nbsp;Sentinel&nbsp;
                        </tr>
                        <tr>
                          <input
                            type="radio"
                            name="update-type"
                            value="iipzy-sentinel-admin"
                            checked={updateType === "iipzy-sentinel-admin"}
                            disabled={disabledWhileUpdating}
                            onChange={(ev) => this.handleUpdateTypeChange(ev)}
                          />
                          &nbsp;Sentinel Admin&nbsp;
                        </tr>
                        <tr>
                          <input
                            type="radio"
                            name="update-type"
                            value="iipzy-sentinel-web"
                            checked={updateType === "iipzy-sentinel-web"}
                            disabled={disabledWhileUpdating}
                            onChange={(ev) => this.handleUpdateTypeChange(ev)}
                          />
                          &nbsp;Sentinel Web&nbsp;
                        </tr>
                        <tr>
                          <input
                            type="radio"
                            name="update-type"
                            value="iipzy-updater"
                            checked={updateType === "iipzy-updater"}
                            disabled={disabledWhileUpdating}
                            onChange={(ev) => this.handleUpdateTypeChange(ev)}
                          />
                          &nbsp;Updater
                        </tr>
                      </tbody>
                    </table>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                    <td>
                      <Button
                        type="button"
                        variant="contained"
                        disabled={!this.getEnableSave()}
                        style={{
                          marginLeft: "100px",
                          width: "130px",
                          color: "#0000b0",
                        }}
                        autoFocus
                        onClick={(ev) => this.handleSaveClick(ev)}
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="contained"
                        disabled={!this.getEnableSubmit()}
                        style={{
                          marginLeft: "50px",
                          width: "130px",
                          color: "#0000b0",
                        }}
                        autoFocus
                        onClick={(ev) => this.handleSubmitClick(ev)}
                      >
                        Submit
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>
                      <hr width="770%" height="20" border="none"></hr>
                    </td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td>Status:</td>
                    <td>
                      <input
                        type="text"
                        name="update-status-text"
                        size="40"
                        value={updateStatus}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }
}

UpdaterWindow.infoMessage = "";
UpdaterWindow.inProgress = false;
UpdaterWindow.showInfoPopup = false;
UpdaterWindow.submitTimeout = null;
UpdaterWindow.status = "done";
UpdaterWindow.statusInterval = null;
UpdaterWindow.tgtClientToken = "";
UpdaterWindow.updateType = "iipzy-pi";
UpdaterWindow.waitForInProgress = false;

async function getUpdaterStatus() {
  const { data, status } = await updater.getUpdaterStatus(
    UpdaterWindow.tgtClientToken
  );

  if (status && status === Defs.httpStatusOk) {
    const updateStatus = data.updateStatus;

    console.log(
      "UpdaterWindow.getUpdaterStatus: status = " +
        JSON.stringify(updateStatus, null, 2)
    );

    UpdaterWindow.inProgress = updateStatus.inProgress;
    if (!UpdaterWindow.waitForInProgress)
      UpdaterWindow.status = updateStatus.step;

    if (updateStatus.failed) {
      UpdaterWindow.status = "failed";
      UpdaterWindow.waitForInProgress = false;
      if (UpdaterWindow.submitTimeout) {
        clearTimeout(UpdaterWindow.submitTimeout);
        UpdaterWindow.submitTimeout = null;
      }
    }
  }
  if (app) app.doRender();
}

async function postUpdaterUpdate(params) {
  const { data, status } = await updater.postUpdaterUpdate(params);
  console.log(
    "UpdaterWindow.postUpdaterUpdate: response = " +
      JSON.stringify(data, null, 2)
  );

  if (data.__hadError__) {
    console.log(
      "UpdaterWindow.postUpdaterUpdate: errorMessage = " +
        data.__hadError__.errorMessage +
        ", statusCode = " +
        data.__hadError__.statusCode
    );

    UpdaterWindow.infoMessage = data.__hadError__.errorMessage;
    UpdaterWindow.showInfoPopup = true;
    UpdaterWindow.buttonsEnabled = false;
    UpdaterWindow.status = "failed";

    UpdaterWindow.waitForInProgress = false;
    UpdaterWindow.inProgress = false;
    if (UpdaterWindow.submitTimeout) {
      clearTimeout(UpdaterWindow.submitTimeout);
      UpdaterWindow.submitTimeout = null;
    }
  }

  if (app) app.doRender();
}

export default UpdaterWindow;
