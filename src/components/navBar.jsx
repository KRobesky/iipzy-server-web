import React from "react";
import { Link, NavLink } from "react-router-dom";

import Defs from "iipzy-shared/src/defs";

import eventManager from "../ipc/eventManager";

let app = null;

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    console.log("NavBar.constructor");

    this.state = { count: 0 };

    app = this;
  }

  doRender() {
    console.log("NavBar.doRender");
    const count = this.state.count + 1;
    this.setState({ count: count });
  }

  handleClick = e => {};

  render() {
    const isAdmin = NavBar.isAdmin;
    const loggedIn = NavBar.loggedIn;
    const navbarName = NavBar.navbarName;

    console.log("NavBar.render: = " + navbarName);

    return (
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light"
        style="z-index:6000;"
      >
        {navbarName === "home" && (
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <NavLink
                className="nav-item nav-link"
                onClick={this.handleClick}
                to={Defs.urlIipzy}
              >
                iipzy
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                onClick={this.handleClick}
                to={Defs.urlSentinels}
              >
                Sentinel
              </NavLink>
              {!loggedIn && (
                <NavLink
                  className="nav-item nav-link"
                  onClick={this.handleClick}
                  to={Defs.urlLogin}
                >
                  Log In
                </NavLink>
              )}
              {loggedIn && (
                <NavLink
                  className="nav-item nav-link"
                  onClick={this.handleClick}
                  to={Defs.urlLogin}
                >
                  Log Out
                </NavLink>
              )}
              <NavLink
                className="nav-item nav-link"
                onClick={this.handleClick}
                to={Defs.urlEditUser}
              >
                Edit User
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                onClick={this.handleClick}
                to={Defs.urlForgotPassword}
              >
                Forgot Password
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                onClick={this.handleClick}
                to={Defs.urlAddUser}
              >
                Register
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                onClick={this.handleClick}
                to={Defs.urlAbout}
              >
                About
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                onClick={this.handleClick}
                to={Defs.urlDownload}
              >
                Download
              </NavLink>
              {isAdmin && (
                <NavLink
                  className="nav-item nav-link"
                  onClick={this.handleClick}
                  to={Defs.urlAdministration}
                >
                  Administration
                </NavLink>
              )}
            </div>
          </div>
        )}
        {navbarName === "admin" && (
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <NavLink
                className="nav-item nav-link"
                onClick={this.handleClick}
                to={Defs.urlClients}
              >
                Clients
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                onClick={this.handleClick}
                to={Defs.urlSentinelAdmin}
              >
                Admin
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                onClick={this.handleClick}
                to={Defs.urlUpdater}
              >
                Update
              </NavLink>
              <NavLink
                className="nav-item nav-link"
                onClick={this.handleClick}
                to={Defs.urlHome}
              >
                Home
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    );
  }
}

NavBar.isAdmin = false;
NavBar.loggedIn = false;
NavBar.navbarName = "home";

const handleShowNavBar = (event, data) => {
  console.log("NavBar.handleShowNavBar: " + data);
  NavBar.navbarName = data;
  if (app != null) app.doRender();
};

const handleLoginStatus = (event, data) => {
  const { isAdmin, loginStatus } = data;
  NavBar.isAdmin = isAdmin;
  NavBar.loggedIn = loginStatus === Defs.loginStatusLoggedIn;
  if (app != null) app.doRender();
};

eventManager.on(Defs.ipcLoginStatus, handleLoginStatus);
eventManager.on(Defs.ipcShowNavBar, handleShowNavBar);

export default NavBar;
