import Defs from "iipzy-shared/src/defs";

import { log } from "../utils/log";
import http from "../ipc/httpService";

let originHref = "";
let serverIPAddress = "address not set";
let useRemoteWeb = false;

async function init(serverIPAddress_, useRemoteWeb_, originHref_) {
  log("clients.init", "clts", "info");

  serverIPAddress = serverIPAddress_;
  useRemoteWeb = useRemoteWeb_;
  originHref = originHref_;
}

function final() {}

async function getClients(queryString) {
  log("getClients", "clts", "info");
  let url = "https://" + serverIPAddress + "/api/client";
  if (queryString) url += "?" + queryString;
  return await http.get(url);
}


function getOriginHref() {
  return originHref;
}

function getUseRemoteWeb() {
  return useRemoteWeb;
}


export default {
  init,
  final,
  getClients,
  getOriginHref,
  getUseRemoteWeb
};
