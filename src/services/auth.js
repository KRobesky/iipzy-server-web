import Defs from "iipzy-shared/src/defs";

import eventManager from "../ipc/eventManager";
import http from "../ipc/httpService";
import { encrypt, decrypt } from "../utils/cipher";
import cookie from "../utils/cookie";
import { log } from "../utils/log";

let serverIPAddress = "address not set";

async function init(serverIPAddress_) {
  log("auth.init", "auth", "info");

  serverIPAddress = serverIPAddress_;

  const userName = cookie.get("userName");
  log("auth.init: userName=" + userName, "auth", "info");
  if (userName != null) {
    const passwordEncrypted = cookie.get("password");
    if (passwordEncrypted) {
      return true;
    }
  }
  return false;
}

async function sendLogin(credentials) {
  log("sendLogin", "auth", "info");
  return await http.post(
    "https://" + serverIPAddress + "/api/auth/login",
    credentials
  );
}

async function sendLogout() {
  log("sendLogout", "auth", "info");
  return await http.post("https://" + serverIPAddress + "/api/auth/logout");
}

async function login() {
  log("auth.login", "auth", "info");

  cookie.set("clientToken", null);
  http.setClientTokenHeader(null);

  const userName = cookie.get("userName");
  log("userName=" + userName, "auth", "info");
  if (userName != null) {
    const passwordEncrypted = cookie.get("password");
    if (passwordEncrypted != null) {
      const passwordDecrypted = decrypt(passwordEncrypted);
      return await loginAsync(userName, passwordDecrypted);
    }
  }
  return false;
}

async function loginRequest(params) {
  log("submitLoginRequest", "auth", "info");
  const { userName, password } = params;
  return await loginAsync(userName, password);
}

async function logoutRequest(params) {
  log("submitLogoutRequest", "auth", "info");
  const { userName } = params;
  return await logoutAsync(userName);
}

async function loginAsync(userName, passwordDecrypted) {
  log(">>>loginAsync", "auth", "info");

  const { data, status } = await sendLogin({
    userName: userName,
    password: passwordDecrypted,
  });

  log("loginAsync: status = " + status, "auth", "info");
  if (status === Defs.httpStatusOk) {
    log("loginAsync: succeeded", "auth", "info");
    await handleCompletion(
      userName,
      passwordDecrypted,
      data.authToken,
      data.isLoggedIn ? Defs.loginStatusLoggedIn : Defs.loginStatusLoginFailed,
      data.isAdmin
    );
  } else {
    // failed
    log("loginAsync: failed", "auth", "info");
    await handleCompletion(
      userName,
      "",
      "",
      Defs.loginStatusLoginFailed,
      false
    );
  }

  log("<<<loginAsync", "auth", "info");

  return { data, status };
}

async function logoutAsync(userName) {
  log(">>>logoutAsync", "auth", "info");

  const { data, status } = await sendLogout();
  log("logoutAsync: status = " + status, "auth", "info");
  if (status === Defs.httpStatusOk) {
    // succeeded
    log("logoutAsync: succeeded", "auth", "info");
    await handleCompletion(userName, "", "", Defs.loginStatusLoggedOut, false);
  } else {
    // failed
    log("logoutAsync: failed", "auth", "info");
    await handleCompletion(userName, "", "", Defs.loginStatusLoggedOut, false);
  }

  log("<<<logoutAsync", "auth", "info");

  return { data, status };
}

async function handleCompletion(
  userName,
  passwordDecrypted,
  authToken,
  loginStatus,
  isAdmin,
  onUserCommand_
) {
  const onUserCommand = onUserCommand_ === undefined ? true : onUserCommand_;
  log(
    ">>>handleCompletion: userName=" +
      userName +
      ", authToken = " +
      authToken +
      ", loginStatus = " +
      loginStatus +
      ", isAdmin = " +
      isAdmin,
    "auth"
  );

  // set http header.
  http.setAuthTokenHeader(authToken);

  eventManager.send(Defs.ipcLoginStatus, {
    userName: userName,
    password: passwordDecrypted,
    authToken: authToken,
    loginStatus: loginStatus,
    isAdmin: isAdmin,
    onUserCommand,
  });

  log("handleCompletion after sending credentials", "auth", "verbose");

  // save in cookie.
  cookie.set("userName", userName);
  if (
    loginStatus === Defs.loginStatusLoggedIn &&
    authToken &&
    authToken !== ""
  ) {
    cookie.set("password", encrypt(passwordDecrypted));
  } else {
    cookie.set("password", "");
  }

  log("<<<handleCompletion", "auth", "info");
}

async function reLoginAsync() {
  log(">>>reLoginAsync", "auth", "info");

  const userName = cookie.get("userName");
  log("reLoginAsync: userName=" + userName, "auth", "info");
  let loginAttemped = false;
  if (userName != null) {
    const passwordEncrypted = cookie.get("password");
    if (passwordEncrypted != null) {
      const passwordDecrypted = decrypt(passwordEncrypted);
      loginAttemped = true;
      await loginAsync(userName, passwordDecrypted);
    }
  }
  if (!loginAttemped)
    await handleCompletion(
      userName,
      "",
      "",
      Defs.loginStatusLoginFailed,
      false,
      false
    );

  log("<<<reLoginAsync", "auth", "info");
}

function final() {}

export default {
  init,
  final,
  login,
  loginRequest,
  logoutRequest,
  reLoginAsync,
};
