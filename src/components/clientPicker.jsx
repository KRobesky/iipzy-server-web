import React from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
//import { ThemeProvider } from "@material-ui/core";

//import Defs from "iipzy-shared/src/defs";

import clients from "../services/clients";

let app = null;

class ClientPicker extends React.Component {
  constructor(props) {
    super(props);

    console.log("ClientPicker.constructor");

    app = this;

    this.state = { count: 0 };
  }

  async componentDidMount() {
    console.log("ClientPicker.componentDidMount");
    //await this.getClientsFromDB("sentinelsOnly=1");
    getClientsFromDB("sentinelsOnly=1");
    //ClientPicker.selectedClientToken = this.props.getSelectedClientToken();
  }

  componentWillUnmount() {
    console.log("ClientPicker.componentWillUnmount");
    app = null;
  }

  getClients() {
    console.log("ClientPicker.getClients");
    return ClientPicker.clientsFiltered;
  }

  getDisabled() {
    return this.props.getDisabled();
  }

  getSelectedClient() {
    console.log(
      "clientPicker.getSelectedClient: " + ClientPicker.selectedClient
    );
    return ClientPicker.selectedClient;
  }

  // async getClientsFromDB(queryString) {
  //   const { data, status } = await clients.getClients(queryString);
  //   console.log("ClientPicker.getClientsFromDB (response): status = " + status);

  //   if (data.__hadError__) {
  //     console.log(
  //       "ClientPicker.handleClientsGetResponse: errorMessage = " +
  //         data.__hadError__.errorMessage +
  //         ", statusCode = " +
  //         data.__hadError__.statusCode
  //     );

  //     //   ClientPicker.infoMessage = data.__hadError__.errorMessage;

  //     //   if (app != null) app.doRender();

  //     return;
  //   }

  //   if (data) {
  //     ClientPicker.clientsFiltered = [];
  //     ClientPicker.clientTokenByEntryString = new Map();
  //     ClientPicker.entryStringByClientToken = new Map();

  //     for (let i = 0; i < data.length; i++) {
  //       const {
  //         clientName,
  //         clientType,
  //         clientToken,
  //         publicIPAddress,
  //         localIPAddress,
  //         isOnLine
  //       } = data[i];
  //       if (clientType === "appliance") {
  //         const entryString =
  //           clientName +
  //           "  " +
  //           publicIPAddress +
  //           "  " +
  //           localIPAddress +
  //           (isOnLine ? "" : "  - offline");
  //         ClientPicker.clientsFiltered.push(entryString);
  //         this.clientTokenByEntryString.set(entryString, clientToken);
  //         ClientPicker.entryStringByClientToken.set(clientToken, entryString);
  //       }
  //     }

  //     if (ClientPicker.selectedClientToken) {
  //       ClientPicker.selectedClient = ClientPicker.entryStringByClientToken.get(
  //         ClientPicker.selectedClientToken
  //       );
  //     }
  //   }

  //   this.doRender();
  // }

  handleSelect(ev) {
    ClientPicker.selectedClient = ev.value;
    console.log("clientPicker.handleSelect: " + ClientPicker.selectedClient);
    this.props.onPick(
      this.clientTokenByEntryString.get(ClientPicker.selectedClient)
    );
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  render() {
    console.log("ClientPicker.render");

    return (
      <div>
        <Dropdown
          disabled={this.getDisabled()}
          options={this.getClients()}
          onChange={ev => this.handleSelect(ev)}
          value={this.getSelectedClient()}
          placeholder="-------------------- Select a client ---------------------"
        />
      </div>
    );
  }
}

ClientPicker.clientsFiltered = [];
ClientPicker.clientTokenByEntryString = new Map();
ClientPicker.entryStringByClientToken = new Map();
ClientPicker.selectedClient = "";
ClientPicker.selectedClientToken = "";

async function getClientsFromDB(queryString) {
  const { data, status } = await clients.getClients(queryString);
  console.log("ClientPicker.getClientsFromDB (response): status = " + status);

  if (data.__hadError__) {
    console.log(
      "ClientPicker.handleClientsGetResponse: errorMessage = " +
        data.__hadError__.errorMessage +
        ", statusCode = " +
        data.__hadError__.statusCode
    );

    //   ClientPicker.infoMessage = data.__hadError__.errorMessage;

    //   if (app != null) app.doRender();

    return;
  }

  if (data) {
    ClientPicker.clientsFiltered = [];
    ClientPicker.clientTokenByEntryString = new Map();
    ClientPicker.entryStringByClientToken = new Map();

    for (let i = 0; i < data.length; i++) {
      const {
        clientName,
        clientType,
        clientToken,
        publicIPAddress,
        localIPAddress,
        isOnLine
      } = data[i];
      if (clientType === "appliance") {
        const entryString =
          clientName +
          "  " +
          publicIPAddress +
          "  " +
          localIPAddress +
          (isOnLine ? "" : "  - offline");
        ClientPicker.clientsFiltered.push(entryString);
        this.clientTokenByEntryString.set(entryString, clientToken);
        ClientPicker.entryStringByClientToken.set(clientToken, entryString);
      }
    }

    if (ClientPicker.selectedClientToken) {
      ClientPicker.selectedClient = ClientPicker.entryStringByClientToken.get(
        ClientPicker.selectedClientToken
      );
    }
  }

  if (app)
    ClientPicker.selectedClientToken = app.props.getSelectedClientToken();

  if (app) app.doRender();
}

export default ClientPicker;
