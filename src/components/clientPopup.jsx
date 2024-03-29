import React from "react";
import Button from "@material-ui/core/Button";

// import Defs from "iipzy-shared/src/defs";

import CloseButton from "./closeButton";
import Navigator from "./navigator";

let app = null;

class VersionTable extends React.Component {
  constructor(props) {
    super(props);
    console.log("VersionTable.constructor");
  }

  /*
    render() {
    const versionInfo = this.props.versionInfo;
    console.log("VersionTable.render: versionInfo = " + JSON.stringify(versionInfo, null, 2));

    return (
      <table id="version-table">
        {versionInfo.map(item => (
          <tr key={item.moduleName}>
            <td>
              {item.moduleName}
            </td>
            <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td>
              {item.moduleUpdateTime}
            </td>
          </tr>
        ))}
      </table>
    );
  }
}
  */

  render() {
    const versionInfo = this.props.versionInfo;
    console.log("VersionTable.render: versionInfo = " + JSON.stringify(versionInfo, null, 2));
    if (!versionInfo) return (<div></div>);

    return (
      <table align="center">
        <tbody>
        {versionInfo.map(item => (
          <tr key={item.moduleName}>
            <td>
              {item.moduleName}
            </td>
            <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td>
              {item.moduleUpdateTime}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    );
  }
}

class ClientPopup extends React.Component {
  constructor(props) {
    super(props);
    app = this;

    this.state = { count: 0 };

    // make a copy
    ClientPopup.client = JSON.parse(JSON.stringify(this.props.getClient()));

    console.log(
      "ClientPopup.constructor - client: " +
        JSON.stringify(ClientPopup.client, null, 2)
    );

    ClientPopup.title = "Client @" + ClientPopup.client.clientToken;

    app = this;
  }

  componentDidMount() {
    console.log("ClientPopup componentDidMount");
  }

  componentWillUnmount() {
    console.log("ClientPopup componentWillUnmount");
    app = null;
  }

  handleCloseClick(ev) {
    console.log("...ClientPopup handleCloseClick");
    this.props.closePopup();
    this.props.onClose(ev);
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  getInfoMessage() {
    return ClientPopup.infoMessage;
  }

  handleCopyClientTokenClick(ev) {
    console.log("...ClientPopup.handleCopyClientTokenClick");
    navigator.clipboard
      .writeText(ClientPopup.client.clientToken)
      .then(() => {
        // Success!
      })
      .catch(err => {
        console.log("Something went wrong", err);
      });
  }

  render() {
    console.log("ClientPopup render");

    const client = ClientPopup.client;
    const clientIsSentinel = client.clientType === "appliance";

    return (
      <div>
        <Navigator />
        <div className="popup">
          <div className="popup_inner_700x540">
            <div>
              <div style={{ marginLeft: 20, textAlign: "left" }}>
                <p style={{ fontSize: "140%" }}>{client.clientName}</p>
              </div>
              <table align="center">
                <tbody>
                  <tr>
                    <td>Name:</td>
                    <td>{client.clientName}</td>
                  </tr>
                  <tr>
                    <td>Client Token:</td>
                    <td>{client.clientToken}</td>
                    <td>&nbsp;&nbsp;</td>
                    <td>
                      <Button
                        type="button"
                        variant="contained"
                        disabled={false}
                        size="small"
                        style={{
                          width: "50px",
                          height: "25px",
                          color: "#0000b0"
                        }}
                        onClick={ev => this.handleCopyClientTokenClick(ev)}
                      >
                        Copy
                      </Button>
                    </td>
                  </tr>
                  {client.clientType ? (
                    <tr>
                      <td>Client Type:</td>
                      <td>{client.clientType === "pc" ? "pc" : "Sentinel"}</td>
                    </tr>
                  ) : null}
                  {client.publicIPAddress ? (
                    <tr>
                      <td>Public Address:</td>
                      <td>{client.publicIPAddress.substring(7)}</td>
                    </tr>
                  ) : null}
                  {client.localIPAddress ? (
                    <tr>
                      <td>Local Address:</td>
                      <td>{client.localIPAddress}</td>
                    </tr>
                  ) : null}
                  {client.userName ? (
                    <tr>
                      <td>User Name:</td>
                      <td>{client.userName}</td>
                    </tr>
                  ) : null}
                  {client.ispName ? (
                    <tr>
                      <td>ISP:</td>
                      <td>{client.ispName}</td>
                    </tr>
                  ) : null}
                  {/*{client.netBiosName ? (
                    <tr>
                      <td>NetBIOS Name:</td>
                      <td>{client.netBiosName}</td>
                    </tr>
                  ) : null}*/}
                  <tr>
                    <td>On Line:</td>
                    <td>{client.isOnLine ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <td>Logged In:</td>
                    <td>{client.isLoggedIn ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <td>Iperf3 Count:</td>
                    <td>{client.iperf3UseCountDaily}</td>
                  </tr>
                  <tr>
                    <td>VersionInfo:</td>
                  </tr>

                </tbody>
              </table>
              {clientIsSentinel && (<div style={{marginLeft: 10}}>
                <VersionTable
                  versionInfo={client.versionInfo}
                />
              </div>)}
            </div>
            <CloseButton onClick={ev => this.handleCloseClick(ev)} />
          </div>
        </div>
      </div>
    );
  }
}

ClientPopup.client = null;
ClientPopup.title = "Client";

export default ClientPopup;
