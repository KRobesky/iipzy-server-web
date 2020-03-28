import React from "react";

import Navigator from "./navigator";

let app = null;

class BlankWindow extends React.Component {
  constructor(props) {
    super(props);

    console.log("BlankWindow.constructor");

    this.state = { count: 0 };

    app = this;
  }

  componentDidMount() {
    console.log("BlankWindow.componentDidMount");
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  componentWillUnmount() {
    console.log("BlankWindow.componentWillUnmount");
    app = null;
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  render() {
    console.log("BlankWindow.render");

    return (
      <div>
        <Navigator />
      </div>
    );
  }
}

export default BlankWindow;
