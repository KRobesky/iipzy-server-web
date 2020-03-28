import Defs from "iipzy-shared/src/defs";

import { log } from "../utils/log";
import http from "../ipc/httpService";

let serverIPAddress = "address not set";

async function init(serverIPAddress_) {
  log("clients.init", "clts", "info");

  serverIPAddress = serverIPAddress_;
}

function final() {}

async function getClients(queryString) {
  log("getClients", "clts", "info");
  let url = "https://" + serverIPAddress + "/api/client";
  if (queryString) url += "?" + queryString;
  return await http.get(url);
}

export default {
  init,
  final,
  getClients
};
