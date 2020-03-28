import Defs from "iipzy-shared/src/defs";

import eventManager from "../ipc/eventManager";
import http from "../ipc/httpService";

let sentinelIPAddress = "address not set";

function init(sentinelIPAddress_) {
  console.log("settings.init: sentinelIPAddress = " + sentinelIPAddress_);
  sentinelIPAddress = sentinelIPAddress_;
}

async function handleGetLogLevel(channel, data_) {
  console.log("settings.handleGetLogLevel");
  const { data, status } = await http.get(
    "http://" + sentinelIPAddress + "/api/settings/loglevel"
  );
  if (status === Defs.httpStatusOk)
    eventManager.send(Defs.ipcSentineSettingsGetLogLevelResponse, data);
}

async function handleSetLogLevel(channel, data_) {
  console.log("settings.handleSetLogLevel: data = " + JSON.stringify(data_));

  const { data, status } = await http.post(
    "http://" + sentinelIPAddress + "/api/settings/loglevel",
    data_
  );
  if (status === Defs.httpStatusOk) {
    console.log("settings.handleSetLogLevel - sending event");
    eventManager.send(Defs.ipcSentineSettingsSetLogLevelResponse, data);
  }
}

async function handleGetSimulateDroppedPackets(channel, data_) {
  console.log("settings.handleGetSimulateDroppedPackets");
  const { data, status } = await http.get(
    "http://" + sentinelIPAddress + "/api/settings/simulateDroppedPackets"
  );
  if (status === Defs.httpStatusOk)
    eventManager.send(
      Defs.ipcSentineSettingsGetSimulateDroppedPacketsResponse,
      data
    );
}

async function handleSetSimulateDroppedPackets(channel, data_) {
  console.log("settings.handleSetSimulateDroppedPackets");
  const { data, status } = await http.post(
    "http://" + sentinelIPAddress + "/api/settings/simulateDroppedPackets",
    data_
  );
  if (status === Defs.httpStatusOk)
    eventManager.send(
      Defs.ipcSentineSettingsSetSimulateDroppedPacketsResponse,
      data
    );
}

async function handleGetSimulateOffline(channel, data_) {
  console.log("settings.handleGetSimulateOffline");
  const { data, status } = await http.get(
    "http://" + sentinelIPAddress + "/api/settings/simulateOffline"
  );
  if (status === Defs.httpStatusOk)
    eventManager.send(Defs.ipcSentineSettingsGetSimulateOfflineResponse, data);
}

async function handleSetSimulateOffline(channel, data_) {
  console.log("settings.handleSetSimulateOffline");
  const { data, status } = await http.post(
    "http://" + sentinelIPAddress + "/api/settings/simulateOffline",
    data_
  );
  if (status === Defs.httpStatusOk)
    eventManager.send(Defs.ipcSentineSettingsSetSimulateOfflineResponse, data);
}

async function handleRebootAppliance(channel, data_) {
  console.log("settings.handleRebootAppliance");

  const { data, status } = await http.post(
    "http://" + sentinelIPAddress + "/api/settings/rebootAppliance"
  );
  if (status === Defs.httpStatusOk)
    eventManager.send(Defs.ipcSentineSettingsRebootApplianceResponse, data);
}

async function handleSendLogs(channel, data_) {
  console.log("settings.handleSendLogs");

  const { data, status } = await http.post(
    "http://" + sentinelIPAddress + "/api/settings/sendlogs",
    {}
  );
  if (status === Defs.httpStatusOk)
    eventManager.send(Defs.ipcSentineSettingsSendLogsResponse, data);
}

eventManager.on(Defs.ipcSentineSettingsGetLogLevelRequest, handleGetLogLevel);
eventManager.on(Defs.ipcSentineSettingsSetLogLevelRequest, handleSetLogLevel);
eventManager.on(
  Defs.ipcSentineSettingsGetSimulateDroppedPacketsRequest,
  handleGetSimulateDroppedPackets
);
eventManager.on(
  Defs.ipcSentineSettingsSetSimulateDroppedPacketsRequest,
  handleSetSimulateDroppedPackets
);
eventManager.on(
  Defs.ipcSentineSettingsGetSimulateOfflineRequest,
  handleGetSimulateOffline
);
eventManager.on(
  Defs.ipcSentineSettingsSetSimulateOfflineRequest,
  handleSetSimulateOffline
);
eventManager.on(
  Defs.ipcSentineSettingsRebootApplianceRequest,
  handleRebootAppliance
);
eventManager.on(Defs.ipcSentineSettingsSendLogsRequest, handleSendLogs);

export default { init };
