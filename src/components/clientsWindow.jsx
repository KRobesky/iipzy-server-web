import React from "react";

//import Defs from "iipzy-shared/src/defs";

import clients from "../services/clients";
import ClientPopup from "./clientPopup";
import Navigator from "./navigator";

class ClientList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const clients = this.props.clients;
    return (
      <ul>
        {clients &&
          clients.map(item => (
            <li key={item.ipAddress}>
              <div>
                {item.ipAddress} &nbsp;
                {item.displayName}
              </div>
            </li>
          ))}
      </ul>
    );
  }
}

class ClientTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const clients = this.props.clients;
    console.log("ClientTable render");
    console.log(clients);

    return (
      <table id="client-table">
        {clients &&
          clients.map(item => (
            <tr key={item.clientToken}>
              <td
                style={{ cursor: "pointer" }}
                onClick={() => this.props.onClick(item.clientToken)}
              >
                <div style={{ textAlign: "left", marginLeft: 20 }}>
                  {item.clientName}
                </div>
              </td>
              <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td
                style={{ cursor: "pointer" }}
                onClick={() => this.props.onClick(item.clientToken)}
              >
                {item.userName}
              </td>
              <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td
                style={{ cursor: "pointer" }}
                onClick={() => this.props.onClick(item.clientToken)}
              >
                {item.publicIPAddress.substring(7)}
              </td>
              <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td
                style={{ cursor: "pointer" }}
                onClick={() => this.props.onClick(item.clientToken)}
              >
                {item.localIPAddress}
              </td>
              <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td
                style={{ cursor: item.isOnLine ? "pointer" : "default" }}
                onClick={() => this.props.onClick(item.clientToken)}
              >
                {!item.isOnLine ? "off line" : ""}
              </td>
            </tr>
          ))}
      </table>
    );
  }
}

let app = null;

class ClientsWindow extends React.Component {
  constructor(props) {
    super(props);
    console.log("ClientsWindow.constructor");
    this.state = { count: 0 };

    app = this;
  }

  async componentDidMount() {
    console.log("ClientsWindow.componentDidMount");
    getClientsFromDB("");
  }

  componentWillUnmount() {
    console.log("ClientsWindow.componentWillUnmount");
    app = null;
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  handleClientTokenClick(clientToken) {
    console.log("ClientsWindow.clientTokenClick = " + clientToken);
    ClientsWindow.clientToken = clientToken;
    ClientsWindow.showClientPopup = true;
    this.doRender();
  }

  handleClientCloseClick() {
    console.log("ClientsWindow.handleClientCloseClick");
  }

  hideClientPopup() {
    ClientsWindow.showClientPopup = false;
    this.doRender();
  }

  getClient() {
    console.log("ClientsWindow.getClient");
    return ClientsWindow.clientByClientToken.get(ClientsWindow.clientToken);
  }

  render() {
    console.log("ClientsWindow.render");

    const clients = ClientsWindow.clients;
    const showClientPopup = ClientsWindow.showClientPopup;

    return (
      <div>
        <Navigator />
        <div style={{ marginLeft: 20, textAlign: "left" }}>
          <p style={{ fontSize: "140%" }}>Clients</p>
        </div>
        {showClientPopup ? (
          <ClientPopup
            getClient={() => this.getClient()}
            onClose={ev => this.handleClientCloseClick(ev)}
            closePopup={this.hideClientPopup.bind(this)}
          />
        ) : null}
        <div
          style={{
            marginLeft: 20,
            /*             width: "1100px",
            height: "450px", */
            border: "1px solid #ccc",
            font: "14px Courier New",
            fontWeight: "bold",
            /*     overflowX: "scroll", */
            overflowY: "scroll"
          }}
        >
          <ClientTable
            clients={clients}
            onClick={ev => this.handleClientTokenClick(ev)}
          />
        </div>
      </div>
    );
  }
}

ClientsWindow.clients = null;
ClientsWindow.clientByClientToken = new Map();
ClientsWindow.clientToken = "";
ClientsWindow.infoMessage = "";
ClientsWindow.showClientPopup = false;

async function getClientsFromDB(queryString) {
  const { data, status } = await clients.getClients(queryString);
  console.log("ClientsWindow.getClientsFromDB (response): status = " + status);

  if (data.__hadError__) {
    console.log(
      "ClientsWindow.getClientsFromDB: errorMessage = " +
        data.__hadError__.errorMessage +
        ", statusCode = " +
        data.__hadError__.statusCode
    );

    ClientsWindow.infoMessage = data.__hadError__.errorMessage;

    if (app) app.doRender();

    return;
  }

  ClientsWindow.clients = data;
  ClientsWindow.clientByClientToken = new Map();
  for (let i = 0; i < ClientsWindow.clients.length; i++) {
    const client = ClientsWindow.clients[i];
    ClientsWindow.clientByClientToken.set(client.clientToken, client);
  }

  if (app) app.doRender();
}

export default ClientsWindow;
