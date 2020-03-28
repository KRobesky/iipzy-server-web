import React from "react";

import Defs from "iipzy-shared/src/defs";

import eventManager from "../ipc/eventManager";
import Navigator from "./navigator";

let app = null;

class HomeNavigatorWindow extends React.Component {
  constructor(props) {
    super(props);

    console.log("HomeNavigatorWindow.constructor");

    this.state = { count: 0 };

    app = this;
  }

  componentDidMount() {
    console.log("HomeNavigatorWindow.componentDidMount");
    const count = this.state.count + 1;
    this.setState({ count: count });

    eventManager.send(Defs.ipcShowNavBar, "home");
    eventManager.send(Defs.ipcLinkTo, Defs.urlIipzy);
  }

  componentWillUnmount() {
    console.log("HomeNavigatorWindow.componentWillUnmount");
    app = null;
  }

  doRender() {
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  render() {
    console.log("HomeNavigatorWindow.render");

    return (
      <div>
        <Navigator />
      </div>
    );
  }
}

export default HomeNavigatorWindow;
