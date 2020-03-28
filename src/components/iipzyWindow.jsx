import React from "react";

import Defs from "iipzy-shared/src/defs";

import eventManager from "../ipc/eventManager";

import Navigator from "./navigator";

let app = null;

class IipzyWindow extends React.Component {
  constructor(props) {
    super(props);

    console.log("IipzyWindow.constructor");

    this.state = { count: 0 };

    app = this;
  }

  componentDidMount() {
    console.log("IipzyWindow.componentDidMount");
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  componentWillUnmount() {
    console.log("IipzyWindow.componentWillUnmount");
    app = null;
  }

  handleSentinelClick() {
    console.log("IIpzyWindow.handleSentinelClick");
    eventManager.send(Defs.ipcLinkTo, Defs.urlSentinels);
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  render() {
    console.log("IipzyWindow.render");

    return (
      <div>
        <Navigator />
        <div style={{ marginLeft: 20, textAlign: "left" }}>
          <p style={{ fontSize: "140%" }}>Welcome to the iipzy service</p>
        </div>
        <div
          style={{ marginLeft: 20, textAlign: "left", fontWeight: "normal" }}
        >
          <p>
            Click on{" "}
            <button
              class="invisible-button"
              onClick={ev => this.handleSentinelClick(ev)}
            >
              <strong>Sentinel</strong>
            </button>{" "}
            above to connect to your iipzy Sentinel device.
            <br />
            <br />
            From Sentinel, you can view your network latency, results of the
            most recent speed test, and a list of the devices on your network.
          </p>
        </div>
      </div>
    );
  }
}

export default IipzyWindow;
