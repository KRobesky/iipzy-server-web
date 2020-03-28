import Defs from "iipzy-shared/src/defs";

import eventManager from "../ipc/eventManager";
import http from "../ipc/httpService";
import cookie from "../utils/cookie";
import { log } from "../utils/log";

let serverIPAddress = "address not set";

async function init(serverIPAddress_) {
  log("sentinelAdmin.init", "sadm", "info");

  serverIPAddress = serverIPAddress_;
}

function final() {}

// async function getSentinelAdminStatus(tgtClientToken) {
//   log(
//     "getSentinelAdminStatus: tgtClientToken = " + tgtClientToken,
//     "sadm",
//     "verbose"
//   );

//   if (tgtClientToken)
//     return await http.get(
//       "https://" +
//         serverIPAddress +
//         "/api/sentineladmin/status?tgtclienttoken=" +
//         tgtClientToken
//     );

//   return {};
// }

// async function postSentinelAdminAction(params) {
//   log(
//     "postSentinelAdminAction: params = " + JSON.stringify(params, null, 2),
//     "sadm",
//     "info"
//   );

//   return await http.post(
//     "https://" + serverIPAddress + "/api/sentineladmin/action",
//     params
//   );
// }

// function getSentinelClientToken() {
//   let sentinelClientToken = cookie.get("sentinelClientToken");
//   return sentinelClientToken;
// }

// function handleSentinelAdminGetRequest(event, data) {
//   log("sentinelAdmin.handleSentinelAdminGetRequest", "sadm", "info");
//   let settings = cookie.get("sentinelAdminSettings");
//   eventManager.send(Defs.ipcSentinelAdminGetResponse, settings);
// }

// async function handleSentinelAdminPutRequest(event, settings) {
//   log(
//     "sentinelAdmin.handleSentinelAdminPutRequest: settings = " +
//       JSON.stringify(settings),
//     "sadm",
//     "info"
//   );
//   cookie.set("sentinelAdminSettings1", settings);
//   eventManager.send(Defs.ipcSentinelAdminPutResponse, {});
// }

// async function handleSentinelAdminActionPostRequest(event, settings) {
//   log(
//     "sentinelAdmin.handleSentinelAdminActionPostRequest: settings = " +
//       JSON.stringify(settings),
//     "sadm",
//     "info"
//   );
//   //console.log(settings);
//   const settingsSansActionUuid = JSON.parse(JSON.stringify(settings));
//   delete settingsSansActionUuid.actionUuid;
//   cookie.set("sentinelAdminSettings", settingsSansActionUuid);
//   const { data, status } = await postSentinelAdminAction(settings);
//   if (status !== Defs.httpStatusOk)
//     log(
//       "(Error) sentinelAdmin.handleSentinelAdminActionPostRequest: status = " +
//         status,
//       "sadm",
//       "verbose"
//     );

//   log(
//     "sentinelAdmin.handleSentinelAdminActionPostRequest: data = " +
//       JSON.stringify(data),
//     "sadm",
//     "info"
//   );
//   //if (data)
//   eventManager.send(Defs.ipcSentinelAdminActionPostResponse, data);
// }

// async function handleSentinelAdminStatusGetRequest(event, piClientToken) {
//   log("sentinelAdmin.handleSentinelAdminStatusGetRequest", "sadm", "verbose");
//   if (piClientToken) {
//     const { data, status } = await getSentinelAdminStatus(piClientToken);
//     log(
//       "sentinelAdmin.handleSentinelAdminStatusGetRequest: data = " +
//         JSON.stringify(data, null, 2),
//       "sadm",
//       "verbose"
//     );
//     eventManager.send(Defs.ipcSentinelAdminStatusGetResponse, data.adminStatus);
//   }
// }

async function getSentinelAdminStatus(tgtClientToken) {
  log("sentinelAdmin.getSentinelAdminStatus", "sadm", "verbose");
  if (tgtClientToken) {
    return await http.get(
      "https://" +
        serverIPAddress +
        "/api/sentineladmin/status?tgtclienttoken=" +
        tgtClientToken
    );
  }

  return {};
}

async function postSentinelAdmin(params) {
  log("updater.postSentinelAdmin", "updt", "info");
  const paramsSansActionUuid = JSON.parse(JSON.stringify(params));
  delete paramsSansActionUuid.actionUuid;
  return await http.post(
    "https://" + serverIPAddress + "/api/sentineladmin/action",
    paramsSansActionUuid
  );
}

// eventManager.on(Defs.ipcSentinelAdminGetRequest, handleSentinelAdminGetRequest);
// eventManager.on(Defs.ipcSentinelAdminPutRequest, handleSentinelAdminPutRequest);
/* eventManager.on(
  Defs.ipcSentinelAdminActionPostRequest,
  handleSentinelAdminActionPostRequest
); */
// eventManager.on(
//   Defs.ipcSentinelAdminStatusGetRequest,
//   handleSentinelAdminStatusGetRequest
// );

export default {
  init,
  final,
  getSentinelAdminStatus,
  postSentinelAdmin
};
