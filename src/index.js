import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import Defs from "iipzy-shared/src/defs";
//import { sleep } from "iipzy-shared/src/utils/utils";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import eventManager from "./ipc/eventManager";

import auth from "./services/auth";
import clients from "./services/clients";
import heartbeat from "./services/heartbeat";
import sentinelAdmin from "./services/sentinelAdmin";
import updater from "./services/updater";
import user from "./services/user";
//import cookie from "./utils/cookie";

const serverIPAddress = "iipzy.net:8002";

async function main() {
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById("root")
  );

  // console.log("-------------window.location-----------");
  // console.log(window.location);
  // console.log("-----------origin-------------");
  // console.log(window.location.origin);

  await heartbeat.init(serverIPAddress);
  const hasCredentials = await auth.init(serverIPAddress);
  console.log("====== AFTER calling auth.init");
  if (!hasCredentials) {
    console.log("===========!hasCredentials");
    eventManager.send(Defs.ipcLinkTo, Defs.urlLogin);
  } else {
    // do login in background.
    auth.login();
  }
  console.log("====== AFTER calling auth.login");
  await clients.init(serverIPAddress);
  console.log("====== AFTER calling clients.init");
  await sentinelAdmin.init(serverIPAddress);
  console.log("====== AFTER calling updater.init");
  await updater.init(serverIPAddress);
  console.log("====== AFTER calling updater.init");
  await user.init(serverIPAddress);
  console.log("====== AFTER calling user.init");
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: http://bit.ly/CRA-PWA
  serviceWorker.unregister();
}

// window.addEventListener("beforeunload", ev => {
//   ev.preventDefault();
//   return (ev.returnValue = "Are you sure you want to close?");
// });

main();
