import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
//import { ToastContainer } from "react-toastify";

import Defs from "iipzy-shared/src/defs";

import eventManager from "./ipc/eventManager";

import NavBar from "./components/navBar";
//import logo from "./logo.svg";
import "./App.css";

import AboutWindow from "./components/aboutWindow";
import AddUserWindow from "./components/addUserWindow";
import AdminNavigatorWindow from "./components/adminNavigatorWindow";
import BlankWindow from "./components/blankWindow";
import ClientsWindow from "./components/clientsWindow";
import DownloadWindow from "./components/downloadWindow";
import EditUserWindow from "./components/editUserWindow";
import ForgotPasswordWindow from "./components/forgotPasswordWindow";
import HomeNavigatorWindow from "./components/homeNavigatorWindow";
import IipzyWindow from "./components/iipzyWindow";
import LoginWindow from "./components/loginWindow";
import SentinelAdminWindow from "./components/sentinelAdminWindow";
import SentinelsWindow from "./components/sentinelsWindow";
import UpdaterWindow from "./components/updaterWindow";

let app = null;

class App extends Component {
  constructor(props) {
    super(props);

    console.log("App.constructor");

    this.state = { count: 0, data: null };

    app = this;
  }

  componentDidMount() {
    console.log("App.componentDidMount");
    // Call our fetch function below once the exact component mounts
    // this.callBackendAPI()
    //   .then(res => this.setState({ data: res.express }))
    //   .catch(err => console.log(err));
  }
  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch("/express_backend");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  doRender() {
    console.log("App.doRender");
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  render() {
    const loggedIn = App.loggedIn;
    const navbarName = App.navbarName;

    return (
      <React.Fragment>
        {/* <ToastContainer /> */}
        <BrowserRouter>
          {/*   <NavBar user={this.state.user} /> */}
          <NavBar />
          {/* <main className="container"> */}
          <Switch>
            <Route path={Defs.urlAbout} exact component={AboutWindow} />
            <Route path={Defs.urlAddUser} exact component={AddUserWindow} />
            <Route
              path={Defs.urlAdministration}
              exact
              component={AdminNavigatorWindow}
            />
            <Route path={Defs.urlBlank} exact component={BlankWindow} />
            <Route path={Defs.urlClients} exact component={ClientsWindow} />
            <Route path={Defs.urlDownload} exact component={DownloadWindow} />
            <Route path={Defs.urlEditUser} exact component={EditUserWindow} />
            <Route
              path={Defs.urlForgotPassword}
              exact
              component={ForgotPasswordWindow}
            />
            <Route path={Defs.urlHome} exact component={HomeNavigatorWindow} />
            <Route path={Defs.urlIipzy} exact component={IipzyWindow} />
            <Route path={Defs.urlLogin} exact component={LoginWindow} />
            <Route
              path={Defs.urlSentinelAdmin}
              exact
              component={SentinelAdminWindow}
            />
            <Route path={Defs.urlSentinels} exact component={SentinelsWindow} />
            <Route path={Defs.urlUpdater} exact component={UpdaterWindow} />
            <Redirect to={Defs.urlBlank} />}
          </Switch>
          {/* </main> */}
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

App.loggedIn = false;
App.navbarName = "home";
App.props = null;

const handleShowNavBar = (event, data) => {
  console.log("App.handleShowNavBar: " + data);
  App.navbarName = data;
  if (App.navbarName === "admin") {
    eventManager.send(Defs.ipcLinkTo, Defs.urlClients);
  }
  if (app != null) app.doRender();
};

const handleLoginStatus = (event, data) => {
  console.log("App.handleLoginStatus");
  const { loginStatus, onUserCommand } = data;

  App.loggedIn = loginStatus === Defs.loginStatusLoggedIn;

  if (App.navbarName === "home") {
    if (App.loggedIn) {
      eventManager.send(Defs.ipcLinkTo, Defs.urlIipzy);
    } else {
      eventManager.send(Defs.ipcLinkTo, Defs.urlLogin);
    }
  }
};

// NB: handleUserAddRequired and handleUserAddVerified are used to force a first time user to
//      register then login.
// const handleUserAddRequired = (event, settings) => {
//   App.userAddRequired = true;
//   eventManager.send(
//     Defs.ipcConsoleLog,
//     "App handleUserAddRequired: userAddRequired = " + App.userAddRequired
//   );
//   if (app != null) app.doRender();
// };

// const handleUserAddVerified = (event, settings) => {
//   App.userAddRequired = false;
//   App.forceLogin = true;
//   eventManager.send(Defs.ipcConsoleLog, "App handleUserAddVerified");
//   if (app != null) app.doRender();
// };

eventManager.on(Defs.ipcLoginStatus, handleLoginStatus);
eventManager.on(Defs.ipcShowNavBar, handleShowNavBar);
// eventManager.on(Defs.ipcUserAddRequired, handleUserAddRequired);
// eventManager.on(Defs.ipcUserAddVerified, handleUserAddVerified);

export default App;
