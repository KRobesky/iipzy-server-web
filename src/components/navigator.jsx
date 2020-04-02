import React from "react";
import { Redirect, Switch } from "react-router-dom";

import Defs from "iipzy-shared/src/defs";

import eventManager from "../ipc/eventManager";
import InfoPopup from "./infoPopup";

let app = null;

// NB: Navigator does not get constructed on every reference.
class Navigator extends React.Component {
  constructor(props) {
    super(props);

    console.log("Navigator.constructor");

    this.state = {
      linkCount: 0
    };

    app = this;
  }

  componentDidMount() {
    console.log("Navigator.componentDidMount");
  }

  componentWillUnmount() {
    console.log("Navigator.componentWillUnmount");
    app = null;
  }

  handleLinkChange() {
    Navigator.linkChange = true;
    Navigator.linkCount++;

    console.log("Navigator: handleLinkChange: " + Navigator.link);

    this.setState({ linkCount: Navigator.linkCount });
  }

  render() {
    const linkChange = Navigator.linkChange;
    Navigator.linkChange = false;
    const link = Navigator.link;

    console.log("Navigator.render: " + link + ", linkChange = " + linkChange);

    return (
      <div>
        {linkChange && (
          <Switch>
            <Redirect to={link} />
          </Switch>
        )}
      </div>
    );
  }
}

Navigator.link = "";
Navigator.linkCount = 0;
Navigator.linkChange = false;

eventManager.on(Defs.ipcSentinelOnlineStatus, (event, data) => {});

eventManager.on(Defs.ipcLinkTo, (event, data) => {
  console.log("navigator: " + data);

  Navigator.link = data;
  if (app) app.handleLinkChange();
});

export default Navigator;
