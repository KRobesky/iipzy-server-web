import React from "react";
import Button from "@material-ui/core/Button";
import Spinner from "react-bootstrap/Spinner";
import uuidv4 from "uuid/v4";

import Defs from "iipzy-shared/src/defs";

import cookie from "../utils/cookie";
import ClientPicker from "./clientPicker";
import InfoPopup from "./infoPopup";
import Navigator from "./navigator";
import sentinelAdmin from "../services/sentinelAdmin";
import SpinnerPopup from "./spinnerPopup";

let app = null;

class SentinelAdminWindow extends React.Component {
  constructor(props) {
    super(props);

    app = this;

    this.state = { count: 0 };
  }

  componentDidMount() {
    console.log("SentinelAdminWindow componentDidMount");
    this.getSentinelAdminSettings();
    try {
      SentinelAdminWindow.statusInterval = setInterval(async () => {
        if (!this.inSendSentinelAdminStatusGetRequest) {
          this.inSendSentinelAdminStatusGetRequest = true;
          await getSentinelAdminStatus();
          this.inSendSentinelAdminStatusGetRequest = false;
        }
      }, 1 * 1000);
    } catch (ex) {
      console.log("(Exception) " + ex);
    }
  }

  componentWillUnmount() {
    console.log("SentinelAdminWindow componentWillUnmount");
    clearInterval(SentinelAdminWindow.statusInterval);
    SentinelAdminWindow.statusInterval = null;
    app = null;
  }

  getSentinelAdminSettings() {
    const settings = cookie.get("sentinelAdminSettings");
    if (settings) {
      const { tgtClientToken, action } = settings;
      if (tgtClientToken) SentinelAdminWindow.tgtClientToken = tgtClientToken;
      if (action) SentinelAdminWindow.action = action;
    }
  }

  handleSaveClick(ev) {
    console.log("...SentinelAdminWindow handleSaveClick");
    cookie.set("sentinelAdminSettings", {
      tgtClientToken: SentinelAdminWindow.tgtClientToken,
      action: SentinelAdminWindow.action,
    });
  }

  handleSubmitClick(ev) {
    console.log("...SentinelAdminWindow handleSubmitClick");

    SentinelAdminWindow.submitTimeout = setTimeout(() => {
      if (SentinelAdminWindow.submitTimeout) {
        SentinelAdminWindow.waitForInProgress = false;
        SentinelAdminWindow.status = "timed out";
        this.doRender();
      }
    }, 30 * 1000);

    SentinelAdminWindow.waitForInProgress = true;
    SentinelAdminWindow.status = "starting...";
    this.doRender();

    postSentinelAdmin({
      tgtClientToken: SentinelAdminWindow.tgtClientToken,
      action: SentinelAdminWindow.action,
      actionUuid: uuidv4(),
    });
  }

  handleActionChange(ev) {
    console.log(
      "...SentinelAdminWindow handleActionChange: " + ev.target.value
    );
    SentinelAdminWindow.action = ev.target.value;
    this.doRender();
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  getClientToken() {
    return SentinelAdminWindow.tgtClientToken;
  }

  getDisabled() {
    return (
      SentinelAdminWindow.waitForInProgress || SentinelAdminWindow.inProgress
    );
  }

  getEnableSave() {
    return true;
  }

  getEnableSubmit() {
    if (SentinelAdminWindow.tgtClientToken.length < 16) return false;

    if (SentinelAdminWindow.inProgress) {
      SentinelAdminWindow.waitForInProgress = false;
      if (SentinelAdminWindow.submitTimeout) {
        clearTimeout(SentinelAdminWindow.submitTimeout);
        SentinelAdminWindow.submitTimeout = null;
      }
    }
    return (
      !SentinelAdminWindow.waitForInProgress && !SentinelAdminWindow.inProgress
    );
  }

  getInfoMessage() {
    return SentinelAdminWindow.infoMessage;
  }

  handleClientPick(ev) {
    console.log("SentinelAdminWindow.handleClientPick: " + ev);
    SentinelAdminWindow.tgtClientToken = ev;
  }

  handleInfoPopupClick() {
    console.log("SentinelAdminWindow.handleInfoPopupClick");
  }

  hideInfoPopup() {
    SentinelAdminWindow.showInfoPopup = false;
    this.doRender();
  }

  render() {
    console.log("SentinelAdminWindow render");

    //const tgtClientToken = SentinelAdminWindow.tgtClientToken;
    const action = SentinelAdminWindow.action;
    const disabledWhileInProgress =
      SentinelAdminWindow.waitForInProgress || SentinelAdminWindow.inProgress;
    const activityStatus = SentinelAdminWindow.status;
    const showSpinner = SentinelAdminWindow.inProgress;

    const showInfoPopup = SentinelAdminWindow.showInfoPopup;

    return (
      <div>
        <Navigator />
        {showSpinner && <SpinnerPopup />}
        {showInfoPopup && (
          <InfoPopup
            title={"Sentinel Admin"}
            getInfoMessage={() => this.getInfoMessage()}
            onSubmit={(ev) => this.handleInfoPopupClick(ev)}
            closePopup={this.hideInfoPopup.bind(this)}
          />
        )}
        {!showInfoPopup && (
          <div>
            <div style={{ marginLeft: 20, textAlign: "left" }}>
              <p style={{ fontSize: "140%" }}>Sentinel Administration</p>
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
                    <td>Action:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                    <table align="left">
                      <tbody>
                        <tr>
                          <input
                            type="radio"
                            name="action"
                            value={Defs.adminCmd_sentinel_restartSentinel}
                            checked={
                              action === Defs.adminCmd_sentinel_restartSentinel
                            }
                            disabled={disabledWhileInProgress}
                            onChange={(ev) => this.handleActionChange(ev)}
                          />
                          &nbsp;Restart Sentinel&nbsp;
                        </tr>
                        <tr>
                          <input
                            type="radio"
                            name="action"
                            value={Defs.adminCmd_sentinel_restartSentinelAdmin}
                            checked={
                              action ===
                              Defs.adminCmd_sentinel_restartSentinelAdmin
                            }
                            disabled={disabledWhileInProgress}
                            onChange={(ev) => this.handleActionChange(ev)}
                          />
                          &nbsp;Restart Sentinel Admin&nbsp;
                        </tr>
                        <tr>
                          <input
                            type="radio"
                            name="action"
                            value={Defs.adminCmd_sentinel_restartSentinelWeb}
                            checked={
                              action ===
                              Defs.adminCmd_sentinel_restartSentinelWeb
                            }
                            disabled={disabledWhileInProgress}
                            onChange={(ev) => this.handleActionChange(ev)}
                          />
                          &nbsp;Restart Sentinel Web&nbsp;
                        </tr>
                        <tr>
                          <input
                            type="radio"
                            name="action"
                            value={Defs.adminCmd_sentinel_restartUpdater}
                            checked={
                              action === Defs.adminCmd_sentinel_restartUpdater
                            }
                            disabled={disabledWhileInProgress}
                            onChange={(ev) => this.handleActionChange(ev)}
                          />
                          &nbsp;Restart Updater&nbsp;
                        </tr>
                        <tr>
                          <input
                            type="radio"
                            name="action"
                            value={Defs.adminCmd_sentinel_reboot}
                            checked={action === Defs.adminCmd_sentinel_reboot}
                            disabled={disabledWhileInProgress}
                            onChange={(ev) => this.handleActionChange(ev)}
                          />
                          &nbsp;Reboot&nbsp;
                        </tr>
                        <tr>
                          <input
                            type="radio"
                            name="action"
                            value={Defs.adminCmd_sentinel_sendLogs}
                            checked={action === Defs.adminCmd_sentinel_sendLogs}
                            disabled={disabledWhileInProgress}
                            onChange={(ev) => this.handleActionChange(ev)}
                          />
                          &nbsp;Send Logs
                        </tr>
                        <tr>
                          <input
                            type="radio"
                            name="action"
                            value={Defs.adminCmd_sentinel_setLogLevelDetailed}
                            checked={
                              action ===
                              Defs.adminCmd_sentinel_setLogLevelDetailed
                            }
                            disabled={disabledWhileInProgress}
                            onChange={(ev) => this.handleActionChange(ev)}
                          />
                          &nbsp;Set Log Level = Detailed
                        </tr>
                        <tr>
                          <input
                            type="radio"
                            name="action"
                            value={Defs.adminCmd_sentinel_setLogLevelNormal}
                            checked={
                              action ===
                              Defs.adminCmd_sentinel_setLogLevelNormal
                            }
                            disabled={disabledWhileInProgress}
                            onChange={(ev) => this.handleActionChange(ev)}
                          />
                          &nbsp;Set Log Level = Normal
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
                        /* autoFocus */
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
                        /* autoFocus */
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
                      <hr width="1000%" height="20" border="none"></hr>
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
                        name="activity-status-text"
                        size="40"
                        value={activityStatus}
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

SentinelAdminWindow.action = Defs.adminCmd_sentinel_none;
SentinelAdminWindow.infoMessage = "";
SentinelAdminWindow.inProgress = false;
SentinelAdminWindow.showInfoPopup = false;
SentinelAdminWindow.status = "done";
SentinelAdminWindow.statusInterval = null;
SentinelAdminWindow.submitTimeout = null;
SentinelAdminWindow.tgtClientToken = "";
SentinelAdminWindow.waitForInProgress = false;

async function getSentinelAdminStatus() {
  const { data, status } = await sentinelAdmin.getSentinelAdminStatus(
    SentinelAdminWindow.tgtClientToken
  );

  if (status && status === Defs.httpStatusOk) {
    const adminStatus = data.adminStatus;

    console.log(
      "SentinelAdminWindow.getSentinelAdminStatus: status = " +
        JSON.stringify(adminStatus, null, 2)
    );

    SentinelAdminWindow.inProgress = adminStatus.inProgress;
    if (!SentinelAdminWindow.waitForInProgress)
      SentinelAdminWindow.status = adminStatus.step;

    if (adminStatus.failed) {
      SentinelAdminWindow.status = "failed";
      SentinelAdminWindow.waitForInProgress = false;
      if (SentinelAdminWindow.submitTimeout) {
        clearTimeout(SentinelAdminWindow.submitTimeout);
        SentinelAdminWindow.submitTimeout = null;
      }
    }
  }

  if (app) app.doRender();
}

async function postSentinelAdmin(params) {
  const { data, status } = await sentinelAdmin.postSentinelAdmin(params);
  console.log(
    "SentinelAdminWindow.postSentinelAdmin: response = " +
      JSON.stringify(data, null, 2)
  );

  if (data.__hadError__) {
    console.log(
      "SentinelAdminWindow.postSentinelAdmin: errorMessage = " +
        data.__hadError__.errorMessage +
        ", statusCode = " +
        data.__hadError__.statusCode
    );

    SentinelAdminWindow.infoMessage = data.__hadError__.errorMessage;
    SentinelAdminWindow.showInfoPopup = true;
    SentinelAdminWindow.buttonsEnabled = false;
    SentinelAdminWindow.status = "failed";

    SentinelAdminWindow.waitForInProgress = false;
    SentinelAdminWindow.inProgress = false;
    if (SentinelAdminWindow.submitTimeout) {
      clearTimeout(SentinelAdminWindow.submitTimeout);
      SentinelAdminWindow.submitTimeout = null;
    }
  }

  if (app) app.doRender();
}

export default SentinelAdminWindow;
