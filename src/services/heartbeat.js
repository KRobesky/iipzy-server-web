import Defs from "iipzy-shared/src/defs";

import cookie from "../utils/cookie";
import { log } from "../utils/log";
import eventManager from "../ipc/eventManager";
import http from "../ipc/httpService";

let serverIPAddress = "address not set";

let clientToken = null;

let sentClientLoginNeeded = 0;

let isLoggedIn = false;
let isExiting = false;
let interval = null;

let inHeartbeat = 0;

async function init(serverIPAddress_) {
  log(">>>heartbeat.init", "htbt", "info");

  serverIPAddress = serverIPAddress_;

  clientToken = cookie.get("clientToken");
  log("..clientToken=" + clientToken, "htbt", "info");
  if (clientToken) {
    http.setClientTokenHeader(clientToken);
  }

  interval = setInterval(async () => {
    if (!inHeartbeat) {
      inHeartbeat++;
      try {
        await heartbeat();
      } catch (ex) {
        log("(Exception) heartbeat: " + ex, "htbt", "error");
      }
      inHeartbeat--;
    }
  }, 20 * 1000);

  inHeartbeat++;
  await heartbeat();
  inHeartbeat--;

  log("<<<heartbeat.init", "htbt", "info");
}

function final() {}

function createPseudoLocalIPAddress() {
  let localIPAddress = cookie.get("pseudoLocalIPAddress");
  if (!localIPAddress) {
    const ts = Date.now().toString();
    // from : https://stackoverflow.com/questions/43464519/creating-fake-ip-address-using-javascript
    localIPAddress =
      Math.floor(Math.random() * 255) +
      1 +
      "." +
      (Math.floor(Math.random() * 255) + 0) +
      "." +
      (Math.floor(Math.random() * 255) + 0) +
      "." +
      (Math.floor(Math.random() * 255) + 0);
  }
  cookie.set("pseudoLocalIPAddress", localIPAddress);
  return localIPAddress;
}

async function createClient() {
  const { data, status } = await http.get(
    "https://" + serverIPAddress + "/api/myIPAddress"
  );
  if (status === Defs.httpStatusOk) {
    const { yourIPAddress, timestamp } = data;
    const localIPAddress = createPseudoLocalIPAddress();
    const newClientToken = encodeURI(
      yourIPAddress + ":" + localIPAddress + ":" + timestamp
    );
    log(
      "heartbeat.createClient: newClientToken = " + newClientToken,
      "htbt",
      "info"
    );

    const { status: status2 } = await http.post(
      "https://" + serverIPAddress + "/api/client/client",
      {
        localIPAddress,
        clientType: "web",
        clientToken: newClientToken,
        clientName: "web client"
      }
    );
    if (status2 === Defs.httpStatusOk) {
      clientToken = newClientToken;
      log(
        "heartbeat.createClient: clientToken = " + clientToken,
        "htbt",
        "info"
      );
      // save in cookies.
      cookie.set("clientToken", clientToken);
      // set in http header.
      http.setClientTokenHeader(clientToken);
    }
  }
}

async function heartbeat() {
  log(
    ">>>heartbeat: isLoggedIn =" + isLoggedIn + ", isExiting = " + isExiting,
    "htbt",
    "info"
  );

  if (isExiting) {
    log("<<<heartbeat: exiting", "htbt", "info");
    return;
  }

  if (!clientToken) {
    await createClient();
    if (!clientToken) {
      log("<<<heartbeat: no clientToken", "htbt", "info");
      return;
    }
  }

  //??
  const reqData = {
    // clientType: Defs.clientType_web,
    // clientName: "web client",
    // clientMode: Defs.clientMode_sentinel,
    // localIPAddress
  };

  log(
    "heartbeat: before post - reqData = " + JSON.stringify(reqData, null, 2),
    "htbt",
    "info"
  );

  const { data, status } = await http.post(
    "https://" + serverIPAddress + "/api/client/heartbeat",
    reqData
  );

  log("heartbeat: status = " + status, "htbt", "verbose");

  if (status !== Defs.httpStatusOk) {
    if (status === Defs.httpStatusUnauthorized) {
      await cookie.set("clientToken", null);
      clientToken = null;
    }
  }

  if (data) {
    log(
      "heartbeat: data = " + JSON.stringify(data, null, 2),
      "htbt",
      "verbose"
    );

    const clientToken = data.clientToken;
    isLoggedIn = data.isLoggedIn;

    // if (clientToken) {
    //   // first connection by this client
    //   log("heartbeat: clientToken = " + clientToken, "htbt", "info");
    //   cookie.set("clientToken", clientToken);
    //   // set in http header.
    //   http.setClientTokenHeader(clientToken);
    // }

    if (!isLoggedIn) {
      if (sentClientLoginNeeded === 0) {
        log("heartbeat: login needed", "htbt", "info");
        eventManager.send(Defs.ipcClientLoginNeeded, true);
        // retry after 5 hearbeats of not logged in.
        sentClientLoginNeeded = 5;
      } else {
        sentClientLoginNeeded--;
      }
    } else sentClientLoginNeeded = 0;
  }
  log("<<<heartbeat", "htbt", "info");
}

function handleLoginStatus(event, data) {
  log(
    "heartbeat handleLoginStatus: status = " + data.loginStatus,
    "htbt",
    "info"
  );
  isLoggedIn = data.loginStatus === Defs.loginStatusLoggedIn;
  http.setAuthTokenHeader(data.authToken);
}

eventManager.on(Defs.ipcLoginStatus, handleLoginStatus);

export default { init };
