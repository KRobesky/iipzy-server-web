import React from "react";

import Defs from "iipzy-shared/src/defs";

import Navigator from "./navigator";

let app = null;

class AboutWindow extends React.Component {
  constructor(props) {
    super(props);

    console.log("AboutWindow.constructor");

    this.state = { count: 0 };

    app = this;
  }

  componentDidMount() {
    console.log("AboutWindow.componentDidMount");
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  componentWillUnmount() {
    console.log("AboutWindow.componentWillUnmount");
    app = null;
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  render() {
    console.log("AboutWindow.render");

    const downloadPath = ".." + Defs.urlDownload;

    return (
      <div>
        <Navigator />
        <div style={{ marginLeft: 20, textAlign: "left" }}>
          <p style={{ fontSize: "140%" }}>About iipzy</p>
          <p>
            The iipzy service monitors your internet connection for reliability
            and speed.
          </p>
          <p>
            An iipzy device on your local network talks to the iipzy service in
            the cloud. The iipzy device is a Raspberry Pi computer, running
            linux and iipzy software. Click <b>Download</b> above for how to set
            up a Raspberry Pi.
          </p>
          <p>
            The iipzy device sends a heartbeat to the iipzy service every 20
            seconds. If the service fails to receive a heartbeat for one minute,
            the service assumes your internet connection is down. You will be
            notified by a text message and email of this. When the heartbeat is
            again received, you will be notified that the connection is up.
          </p>
          <p>
            The iipzy device sends a ping to a known internet server every 5
            seconds. You can view the ping latency on a graph so that you can
            see latency variations over time. The ping history is kept for 30
            days. Iipzy will notify you by email if one or more pings are
            dropped.
          </p>
          <p>
            The iipzy device runs a speed test once a day, at about 1 am. You
            can also run the speed test on demand. You can view the history of
            the speed tests to see if your throughput is changing.
          </p>
          <p>
            Iipzy keeps track of devices on your network. You can view info
            about the devices, such as name, ip address, and capabilities. Iipzy
            will notify you via email if a new device connects to your network
            or if a device hasn't connected for 30 days. You can optionally
            monitor a device so that you will be notified by email if it goes
            offline or comes online.
          </p>
        </div>
      </div>
    );
  }
}

export default AboutWindow;
