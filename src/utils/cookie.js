import Cookies from "js-cookie";

import { log } from "./log";

//const cookieName = "iipzy-server-web";

function get(key) {
  const val = Cookies.get(key);
  log("cookie.get: key = " + key + ", val = " + val, "cook", "info");
  return val;
}

function set(key, val) {
  log("cookie.set: key = " + key + ", val = " + val, "cook", "info");
  return Cookies.set(key, val);
}

export default { get, set };
