import React from "react";

import Navigator from "./navigator";

let app = null;

class DownloadWindow extends React.Component {
  constructor(props) {
    super(props);

    console.log("DownloadWindow.constructor");

    this.state = { count: 0 };

    app = this;
  }

  componentDidMount() {
    console.log("DownloadWindow.componentDidMount");
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  componentWillUnmount() {
    console.log("DownloadWindow.componentWillUnmount");
    app = null;
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  render() {
    console.log("DownloadWindow.render");

    return (
      <div>
        <Navigator />
        <div style={{ marginLeft: 20, textAlign: "left" }}>
          <p style={{ fontSize: "140%" }}>
            Download iipzy Sentinel Rapsberry Pi Image
          </p>
        </div>
        <div
          style={{ marginLeft: 20, textAlign: "left", fontWeight: "normal" }}
        >
          <p>
            You'll need a Raspberry Pi 3 or 4 with 2 GB (or more) of memory and
            a 32 GB Micro SD Memory Card. <br />A Raspberry Pi 4 is needed if
            your Internet Connection speed is greater than 300MB/sec. <br />
            <br />A good choice for a Raspberry Pi 4 kit is{" "}
            <a href="https://www.amazon.com/gp/product/B07XTRFD3Z/ref=ppx_yo_dt_b_asin_title_o04_s00?ie=UTF8&psc=1">
              here
            </a>
            .&nbsp;&nbsp;Some simple assembly is required.
            <br />
            <br />A good choice for a Micro SD Card is{" "}
            <a href="https://www.amazon.com/gp/product/B073JWXGNT/ref=ppx_yo_dt_b_asin_title_o06_s00?ie=UTF8&psc=1">
              here
            </a>
            <br />
            <br />
            Download the Sentinel Raspberry Pi image{" "}
            <a href="https://iipzy.net:8001/api/clientupdate//bacec2a221264e32bdc3aa886e80a1b1">
              here
            </a>
            <br />
            <br />
            I recommend you use balenaEtcher to burn the Sentinel Raspberry Pi
            image to the Micro SD Card.
            <br />
            You can find balanaEtcher{" "}
            <a href="https://www.balena.io/etcher/">here</a>
            <br />
            <br />
            Install the Micro SD Card with the image into the Raspberry
            Pi.&nbsp;&nbsp; Connect the Raspberry Pi to the power
            supply.&nbsp;&nbsp;A little red led, that can be seen from the top,
            will light if power is on.&nbsp;&nbsp;Connect the Raspberry Pi to
            your local network.&nbsp;&nbsp;The Raspberry Pi Sentinel will then
            connect to the iipzy service.&nbsp;&nbsp;Once you have registered
            and logged in, you can connect to the Raspberry Pi Sentinel by
            clicking on <strong>Sentinel</strong> above.
          </p>
        </div>
      </div>
    );
  }
}

export default DownloadWindow;
