import React from "react";

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

    return (
      <div>
        <Navigator />
        <div style={{ marginLeft: 20, textAlign: "left" }}>
          <p style={{ fontSize: "140%" }}>About iipzy</p>
        </div>
      </div>
    );
  }
}

export default AboutWindow;
