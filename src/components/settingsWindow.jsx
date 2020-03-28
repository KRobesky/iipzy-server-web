import React from "react";
import Button from "@material-ui/core/Button";
import Spinner from "react-bootstrap/Spinner";

import Defs from "iipzy-shared/src/defs";

import eventManager from "../ipc/eventManager";

import InfoPopup from "./infoPopup";
import Input from "./input";
import Navigator from "./navigator";

let app = null;

class SettingsWindow extends React.Component {
  constructor(props) {
    super(props);

    console.log("SettingsWindow.constructor");
    this.state = { count: 0 };

    app = this;
  }

  componentDidMount() {
    console.log("SettingsWindow.componentDidMount");

    eventManager.send(Defs.ipcSentineSettingsGetLogLevelRequest, {});
    eventManager.send(
      Defs.ipcSentineSettingsGetSimulateDroppedPacketsRequest,
      {}
    );
    eventManager.send(Defs.ipcSentineSettingsGetSimulateOfflineRequest, {});

    this.doRender();
  }

  componentWillUnmount() {
    console.log("SettingsWindow.componentWillUnmount");
    app = null;
  }

  getLogLevelDetailedChecked() {
    return SettingsWindow.loglevel === "verbose";
  }

  getSimulateDroppedPacketsChecked() {
    return SettingsWindow.simulateDroppedPackets;
  }

  getSimulateOfflineChecked() {
    return SettingsWindow.simulateOffline;
  }

  getResponseMessage() {
    //return SettingsWindow.responseMessage;
  }

  getInfoMessage() {
    //return SettingsWindow.infoMessage;
  }

  handleInfoPopupClick() {
    console.log("...SettingsWindow.handleInfoPopupClick");
  }

  hideInfoPopup() {
    //SettingsWindow.showInfoPopup = false;
    this.doRender();
  }
  /*
    console.log("...DevicePopup handleWatchChange: " + ev.target.checked);
    DevicePopup.device.watch = ev.target.checked;
*/
  handleLogLevelDetailedClick(ev) {
    console.log(
      "SettingsWindow.handleLogLevelDetailedClick: " + ev.target.checked
    );
    SettingsWindow.loglevel = ev.target.checked ? "verbose" : "info";
    SettingsWindow.inProgress = true;
    eventManager.send(Defs.ipcSentineSettingsSetLogLevelRequest, {
      logLevel: SettingsWindow.loglevel
    });
    this.doRender();
  }

  handleRebootClick(ev) {
    console.log("SettingsWindow handleRebootClick");
    SettingsWindow.inProgress = true;
    eventManager.send(Defs.ipcSentineSettingsRebootApplianceRequest, {});
    this.doRender();
  }

  handleSendLogsClick(ev) {
    console.log("SettingsWindow handleSendLogsClick");
    SettingsWindow.inProgress = true;
    eventManager.send(Defs.ipcSentineSettingsSendLogsRequest, {});
    this.doRender();
  }

  handleSimulateDroppedPacketsClick(ev) {
    console.log(
      "SettingsWindow.handleSimulateDroppedPacketsClick: " + ev.target.checked
    );
    SettingsWindow.simulateDroppedPackets = ev.target.checked;
    SettingsWindow.inProgress = true;
    eventManager.send(Defs.ipcSentineSettingsSetSimulateDroppedPacketsRequest, {
      state: SettingsWindow.simulateDroppedPackets
    });
    this.doRender();
  }

  handleSimulateOfflineClick(ev) {
    console.log(
      "SettingsWindow.handleSimulateOfflineClick: " + ev.target.checked
    );
    SettingsWindow.simulateOffline = ev.target.checked;
    SettingsWindow.inProgress = true;
    eventManager.send(Defs.ipcSentineSettingsSetSimulateOfflineRequest, {
      state: SettingsWindow.simulateOffline
    });
    this.doRender();
  }

  handleResponsePopupClick() {
    console.log("...SettingsWindowhandleInfoPopupClick");
  }

  hideResponsePopup() {
    SettingsWindow.showResponsePopup = false;
    SettingsWindow.buttonsEnabled = true;
    this.doRender();
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  render() {
    console.log("SettingsWindow.render");

    const activityStatus = "";
    const disabledWhileUpdating = SettingsWindow.inProgress;
    const showSpinner = false; // SettingsWindow.inProgress;

    const showResponsePopup = SettingsWindow.showResponsePopup;

    return (
      <div>
        <Navigator />
        <div style={{ marginLeft: 20, textAlign: "left" }}>
          <p style={{ fontSize: "140%" }}>Sentinel Settings</p>
        </div>
        {showResponsePopup ? (
          <InfoPopup
            title={"Sentinel Settings"}
            getInfoMessage={() => this.getResponseMessage()}
            onSubmit={ev => this.handleResponsePopupClick(ev)}
            closePopup={this.hideResponsePopup.bind(this)}
          />
        ) : null}
        {!showResponsePopup ? (
          <div style={{ marginLeft: "20px" }}>
            <table align="left">
              <tbody>
                <tr>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  {/*                     <td>Action:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td> */}
                  <table align="left">
                    <tbody>
                      <tr>
                        <input
                          type="checkbox"
                          name="action-log-level-detailed"
                          checked={this.getLogLevelDetailedChecked()}
                          disabled={disabledWhileUpdating}
                          onChange={ev => this.handleLogLevelDetailedClick(ev)}
                        />
                        &nbsp;Log Level Detailed&nbsp;&nbsp;
                      </tr>
                      <tr>
                        <input
                          type="checkbox"
                          name="action-simulate-dropped-packets"
                          checked={this.getSimulateDroppedPacketsChecked()}
                          disabled={disabledWhileUpdating}
                          onChange={ev =>
                            this.handleSimulateDroppedPacketsClick(ev)
                          }
                        />
                        &nbsp;Simulate Dropped Packets&nbsp;&nbsp;
                      </tr>
                      <tr>
                        <input
                          type="checkbox"
                          name="action-simulate-offline"
                          checked={this.getSimulateOfflineChecked()}
                          disabled={disabledWhileUpdating}
                          onChange={ev => this.handleSimulateOfflineClick(ev)}
                        />
                        &nbsp;Simulate Offline&nbsp;&nbsp;
                      </tr>
                      <tr>&nbsp;</tr>
                      <tr>
                        <Button
                          type="button"
                          variant="contained"
                          disabled={disabledWhileUpdating}
                          style={{
                            width: "130px",
                            color: "#0000b0"
                          }}
                          onClick={ev => this.handleSendLogsClick(ev)}
                        >
                          Send Logs
                        </Button>
                      </tr>
                      <tr>&nbsp;</tr>
                      <tr>
                        <Button
                          type="button"
                          variant="contained"
                          disabled={disabledWhileUpdating}
                          style={{
                            width: "130px",
                            color: "#0000b0"
                          }}
                          onClick={ev => this.handleRebootClick(ev)}
                        >
                          Reboot
                        </Button>
                      </tr>
                    </tbody>
                  </table>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
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
                  {showSpinner ? (
                    <td>
                      <div style={{ marginLeft: "-60px" }}>
                        <Spinner animation="border" role="status">
                          <span className="sr-only">Loading...</span>
                        </Spinner>
                      </div>
                    </td>
                  ) : null}
                </tr>
                <tr>
                  <td>&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    );
  }
}

SettingsWindow.loglevel = "info";
SettingsWindow.simulateDroppedPackets = false;
SettingsWindow.simulateOffline = false;

SettingsWindow.inProgress = false;
SettingsWindow.showResponsePopup = false;
SettingsWindow.buttonsEnabled = true;
SettingsWindow.responseMessage = "";

const handleSentinelSettingsGetLogLevelResponse = (event, data) => {
  SettingsWindow.loglevel = data.logLevel;
  if (app != null) app.doRender();
};

const handleSentinelSettingsGetSimulateDroppedPacketsResponse = (
  event,
  data
) => {
  SettingsWindow.simulateDroppedPackets = data.state;
  if (app != null) app.doRender();
};

const handleSentinelSettingsGetSimulateOfflineResponse = (event, data) => {
  SettingsWindow.simulateOffline = data.state;
  if (app != null) app.doRender();
};

const handleSentinelSettingsSetLogLevelResponse = (event, data) => {
  //?? TODO handle errors.
  SettingsWindow.inProgress = false;
  if (app != null) app.doRender();
};

const handleSentinelSettingsSetSimulateDroppedPacketsResponse = (
  event,
  data
) => {
  //?? TODO handle errors.
  SettingsWindow.inProgress = false;
  if (app != null) app.doRender();
};

const handleSentinelSettingsSetSimulateOfflineResponse = (event, data) => {
  //?? TODO handle errors.
  SettingsWindow.inProgress = false;
  if (app != null) app.doRender();
};

const handleSentinelSettingsRebootApplianceResponse = (event, data) => {
  //?? TODO handle errors.
  SettingsWindow.inProgress = false;
  if (app != null) app.doRender();
};

const handleSentinelSettingsSendLogsResponse = (event, data) => {
  //?? TODO handle errors.
  SettingsWindow.inProgress = false;
  if (app != null) app.doRender();
};

eventManager.on(
  Defs.ipcSentineSettingsGetLogLevelResponse,
  handleSentinelSettingsGetLogLevelResponse
);
eventManager.on(
  Defs.ipcSentineSettingsGetSimulateDroppedPacketsResponse,
  handleSentinelSettingsGetSimulateDroppedPacketsResponse
);
eventManager.on(
  Defs.ipcSentineSettingsGetSimulateOfflineResponse,
  handleSentinelSettingsGetSimulateOfflineResponse
);
eventManager.on(
  Defs.ipcSentineSettingsSetLogLevelResponse,
  handleSentinelSettingsSetLogLevelResponse
);
eventManager.on(
  Defs.ipcSentineSettingsSetSimulateDroppedPacketsResponse,
  handleSentinelSettingsSetSimulateDroppedPacketsResponse
);
eventManager.on(
  Defs.ipcSentineSettingsSetSimulateOfflineResponse,
  handleSentinelSettingsSetSimulateOfflineResponse
);
eventManager.on(
  Defs.ipcSentineSettingsRebootApplianceResponse,
  handleSentinelSettingsRebootApplianceResponse
);
eventManager.on(
  Defs.ipcSentineSettingsSendLogsResponse,
  handleSentinelSettingsSendLogsResponse
);

export default SettingsWindow;
