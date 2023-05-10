import React from "react";
//import { Redirect, Switch } from "react-router-dom";
import Button from "@material-ui/core/Button";

import Defs from "iipzy-shared/src/defs";

import clients from "../services/clients";
import cipher from "../utils/cipher";
import cookie from "../utils/cookie";
import eventManager from "../ipc/eventManager";
import Navigator from "./navigator";

class SentinelTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const clients = this.props.clients;
    console.log("SentinelTable render");
    console.log(clients);

    return (
      <table id="sentinel-table">
        {clients &&
          clients.map(item => (
            <tr key={item.clientToken}>
              <td
                style={{ cursor: item.isOnLine ? "pointer" : "default" }}
                onClick={() => this.props.onClick(item)}
              >
                <div style={{ textAlign: "left", marginLeft: 20 }}>
                  {item.clientName}
                </div>
              </td>
              <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td
                style={{ cursor: item.isOnLine ? "pointer" : "default" }}
                onClick={() => this.props.onClick(item)}
              >
                {item.localIPAddress}
              </td>
              <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td
                style={{ cursor: item.isOnLine ? "pointer" : "default" }}
                onClick={() => this.props.onClick(item)}
              >
                {!item.isOnLine ? "off line" : ""}
              </td>
              <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td
                style={{ cursor: item.userId ? "pointer" : "default" }}
                onClick={() => this.props.onClick(item)}
              >
                {!item.userId ? "not registered" : ""}
              </td>
              <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td
                style={{ cursor: item.isOnLine ? "pointer" : "default" }}
                onClick={() => this.props.onClick(item)}
              >
                {item.isWiFi ? "wifi" : ""}
              </td>
            </tr>
          ))}
      </table>
    );
  }
}

let app = null;

class SentinelsWindow extends React.Component {
  constructor(props) {
    super(props);
    console.log("SentinelsWindow.constructor");
    this.state = { count: 0 };

    app = this;
  }

  componentDidMount() {
    console.log("SentinelsWindow.componentDidMount");
    getClientsFromDB("localSentinelsOnly=1");
  }

  componentWillUnmount() {
    console.log("SentinelsWindow.componentWillUnmount");
    app = null;
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  handleLocalIPAddressClick(item) {
    console.log(
      "SentinelsWindow.clientTokenClick = " +
        item.localIPAddress + 
        ", isOnLine = "       + item.isOnLine + 
        ", isLocalClient = "  + item.isLocalClient + 
        ", clientToken = "    + item.clientToken + 
        ", clientName = "     + item.clientName
    );

    if (!item.isOnLine) return;

    const params = {
      userName: cookie.get("userName"),
      password: cookie.get("password"),
      clientName: item.clientName,
      from: window.location.origin
    };

    const paramsEncrypted = cipher.encrypt(JSON.stringify(params));
    
    if (item.isLocalClient) {
      window.location.replace(
        "http://" +
          item.localIPAddress +
          ":" + Defs.port_sentinel_web + "?params=" + encodeURI(paramsEncrypted) +
           "&clientToken=" + item.clientToken +
           "&isLocalClient=true"
      ); 
    } else {
       window.location.replace(
        "https://" +
          "iipzy.net" +
          ":" + Defs.port_sentinel_web + "?params=" + encodeURI(paramsEncrypted) +
          "&clientToken=" + item.clientToken +
          "&isLocalClient=false"
      );
    }
  }

  handleLoginClick(ev) {
    console.log("SentinelsWindow.handleLoginClick");
    eventManager.send(Defs.ipcLinkTo, Defs.urlLogin);
  }

  render() {
    console.log("SentinelsWindow.render");

    const clients = SentinelsWindow.clients;
    const isLoggedIn = SentinelsWindow.isLoggedIn;
    const numSentinels = clients ? clients.length : 0;

    if (!clients && isLoggedIn) return <div></div>;

    if (numSentinels === 1) return <div></div>;

    return (
      <div>
        <Navigator />
        <div style={{ marginLeft: 20, textAlign: "left" }}>
          <p style={{ fontSize: "140%" }}>Sentinel</p>
        </div>
        {!isLoggedIn && (
          <div>
            <div style={{ marginLeft: 20, textAlign: "left" }}>
              <p style={{ fontSize: "140%" }}>
                You must be logged in to connect to your iipzy Sentinel
              </p>
              <Button
                type="button"
                variant="contained"
                style={{
                  width: "130px",
                  color: "#0000b0"
                }}
                /* autoFocus */
                onClick={ev => this.handleLoginClick(ev)}
              >
                Login
              </Button>
            </div>
          </div>
        )}
        {isLoggedIn && numSentinels > 1 && (
          <div
            align="center"
            style={{
              /*               marginLeft: 20, */
              width: "600px",
              height: "120px",
              font: "14px Courier New",
              fontWeight: "bold"
            }}
          >
            <SentinelTable
              clients={clients}
              onClick={ev => this.handleLocalIPAddressClick(ev)}
            />
            {/* <TextLines lines={lines} /> */}
          </div>
        )}
        {isLoggedIn && numSentinels === 0 && (
          <div>
            <div style={{ marginLeft: 20, textAlign: "left" }}>
              <p style={{ fontSize: "140%" }}>
                Your network does not have an iipzy Sentinel
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

SentinelsWindow.clients = null;
SentinelsWindow.clientByClientToken = new Map();
SentinelsWindow.clientToken = "";
SentinelsWindow.infoMessage = "";
SentinelsWindow.isLoggedIn = false;

async function getClientsFromDB(queryString) {
  const { data, status } = await clients.getClients(queryString);
  console.log(
    "SentinelsWindow.getClientsFromDB (response): status = " + status
  );

  if (data.__hadError__) {
    console.log(
      "SentinelsWindow.getClientsFromDB: errorMessage = " +
        data.__hadError__.errorMessage +
        ", statusCode = " +
        data.__hadError__.statusCode
    );

    SentinelsWindow.infoMessage = data.__hadError__.errorMessage;

    if (app) app.doRender();

    return;
  }

  SentinelsWindow.clients = data;
  if (SentinelsWindow.clients.length === 1) {
    // go directly to sentinel.
    if (app != null) {
      const item = {
        clientName: SentinelsWindow.clients[0].clientName,
        clientToken: SentinelsWindow.clients[0].clientToken,
        isOnLine: SentinelsWindow.clients[0].isOnLine,
        isLocalClient: SentinelsWindow.clients[0].isLocalClient,
        localIPAddress: SentinelsWindow.clients[0].localIPAddress
      };
      app.handleLocalIPAddressClick(item);
    }
  } else {
    // display sentinels.
    SentinelsWindow.clientByClientToken = new Map();
    for (let i = 0; i < SentinelsWindow.clients.length; i++) {
      const client = SentinelsWindow.clients[i];
      SentinelsWindow.clientByClientToken.set(client.clientToken, client);
    }
    if (app) app.doRender();
  }
}

const handleLoginStatus = (event, data) => {
  const { userName, authToken, password, loginStatus } = data;
  console.log(
    "SentinelsWindow.handleLoginStatus: userName = " +
      userName +
      ", loginStatus = " +
      loginStatus
  );
  SentinelsWindow.isLoggedIn = loginStatus === Defs.loginStatusLoggedIn;
};

eventManager.on(Defs.ipcLoginStatus, handleLoginStatus);

export default SentinelsWindow;
