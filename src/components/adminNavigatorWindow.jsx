import React from "react";

import Defs from "iipzy-shared/src/defs";

import eventManager from "../ipc/eventManager";
import Navigator from "./navigator";

let app = null;

class AdminNavigatorWindow extends React.Component {
  constructor(props) {
    super(props);

    console.log("AdminNavigatorWindow.constructor");

    this.state = { count: 0 };

    app = this;
  }

  componentDidMount() {
    console.log("AdminNavigatorWindow.componentDidMount");
    const count = this.state.count + 1;
    this.setState({ count: count });

    eventManager.send(Defs.ipcShowNavBar, "admin");
  }

  componentWillUnmount() {
    console.log("AdminNavigatorWindow.componentWillUnmount");
    app = null;
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  render() {
    console.log("AdminNavigatorWindow.render");

    return (
      <div>
        <Navigator />
      </div>
    );
  }
}

export default AdminNavigatorWindow;
