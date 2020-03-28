import Defs from "iipzy-shared/src/defs";

import { log } from "../utils/log";
//import eventManager from "../ipc/eventManager";
import http from "../ipc/httpService";

let serverIPAddress = "address not set";

async function init(serverIPAddress_) {
  log("users.init", "clts", "info");

  serverIPAddress = serverIPAddress_;
}

function final() {}

async function addUser(userData) {
  log("addUser", "user", "info");
  return await http.post("https://" + serverIPAddress + "/api/user", userData);
}

async function deleteUser(userData) {
  log("deleteUser", "user", "info");
  return await http.delete("https://" + serverIPAddress + "/api/user");
}

async function getUser() {
  log("getUser", "user", "info");
  return await http.get("https://" + serverIPAddress + "/api/user");
}

async function newPassword(userData) {
  log("newPassword", "user", "info");
  return await http.post(
    "https://" + serverIPAddress + "/api/user/newpassword",
    userData
  );
}

async function sendPasswordResetCode(userData) {
  log("sendCode", "user", "info");
  return await http.post(
    "https://" + serverIPAddress + "/api/user/sendcode",
    userData
  );
}

async function updateUser(userData) {
  log("updateUser", "user", "info");
  return await http.put(
    "https://" + serverIPAddress + "/api/user/user",
    userData
  );
}

async function verifyUser(reqData) {
  log("verifyUser", "user", "info");
  return await http.put(
    "https://" + serverIPAddress + "/api/user/verify",
    reqData
  );
}

export default {
  init,
  final,
  addUser,
  deleteUser,
  getUser,
  newPassword,
  sendPasswordResetCode,
  updateUser,
  verifyUser
};
