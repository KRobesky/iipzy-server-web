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

    // this.device = null;
    // this.title = "Network Device";
    this.clientsFiltered = [];
    this.clientTokenByEntryString = new Map();
    this.entryStringByClientToken = new Map();
    this.selectedClient = "";
    this.selectedClientToken = "";

    this.state = { count: 0 };
  }

  async componentDidMount() {
    console.log("ClientPicker.componentDidMount");
    await this.getClientsFromDB("sentinelsOnly=1");
    this.selectedClientToken = this.props.getSelectedClientToken();
  }

  componentWillUnmount() {
    console.log("ClientPicker.componentWillUnmount");
    //??app = null;
  }

  getClients() {
    console.log("ClientPicker.getClients");
    return this.clientsFiltered;
  }

  getDisabled() {
    return this.props.getDisabled();
  }

  getSelectedClient() {
    console.log("clientPicker.getSelectedClient: " + this.selectedClient);
    return this.selectedClient;
  }

  async getClientsFromDB(queryString) {
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
      this.clientsFiltered = [];
      this.clientTokenByEntryString = new Map();
      this.entryStringByClientToken = new Map();

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
          this.clientsFiltered.push(entryString);
          this.clientTokenByEntryString.set(entryString, clientToken);
          this.entryStringByClientToken.set(clientToken, entryString);
        }
      }

      if (this.selectedClientToken) {
        this.selectedClient = this.entryStringByClientToken.get(
          this.selectedClientToken
        );
      }
    }

    this.doRender();
  }

  handleSelect(ev) {
    this.selectedClient = ev.value;
    console.log("clientPicker.handleSelect: " + this.selectedClient);
    this.props.onPick(this.clientTokenByEntryString.get(this.selectedClient));
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

export default ClientPicker;
