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
    eventManager.send(Defs.ipcShowNavBar, "admin");
    this.doRender();
  }

  componentWillUnmount() {
    console.log("AdminNavigatorWindow.componentWillUnmount");
    app = null;
  }

  doRender() {
    this.setState({ count: this.state.count + 1 });
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
