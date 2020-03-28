//import Defs from "iipzy-shared/src/defs";

import http from "../ipc/httpService";
import { log } from "../utils/log";

let serverIPAddress = "address not set";

async function init(serverIPAddress_) {
  log("updater.init", "updt", "info");

  serverIPAddress = serverIPAddress_;
}

function final() {}

async function getUpdaterStatus(tgtClientToken) {
  log(
    "getUpdaterStatus: tgtClientToken = " + tgtClientToken,
    "updt",
    "verbose"
  );

  if (tgtClientToken) {
    return await http.get(
      "https://" +
        serverIPAddress +
        "/api/updater/status?tgtclienttoken=" +
        tgtClientToken
    );
  }

  return {};
}

async function postUpdaterUpdate(params) {
  log("updater.postUpdaterUpdate", "updt", "info");
  const paramsSansUpdateUuid = JSON.parse(JSON.stringify(params));
  delete paramsSansUpdateUuid.updateUuid;
  return await http.post(
    "https://" + serverIPAddress + "/api/updater/update",
    paramsSansUpdateUuid
  );
}

export default {
  init,
  final,
  getUpdaterStatus,
  postUpdaterUpdate
};
