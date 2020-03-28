// see: https://www.grainger.xyz/changing-from-cipher-to-cipheriv/
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

//import { log } from "./log";

const algorithm = "aes-256-ctr";
const key = "bite-the-wax-tadpole-hank-jake$$";
const inputEncoding = "utf8"; //b2df428b9929d3ace7c598bbf4e496b2

const outputEncoding = "hex";

export function encrypt(decrypted) {
  //log("encrypt: in = " + decrypted, "cryp", "info");
  const iv = Buffer.from(randomBytes(16));
  const cipher = createCipheriv(algorithm, key, iv);
  let crypted = cipher.update(decrypted, inputEncoding, outputEncoding);
  crypted += cipher.final(outputEncoding);
  const encrypted = `${iv.toString("hex")}:${crypted.toString()}`;
  //log("encrypt: out = " + encrypted, "cryp", "info");
  return encrypted;
}

export function decrypt(encrypted) {
  //log("decrypt: in = " + encrypted, "cryp", "info");
  if (!encrypted || encrypted === "") return "";

  const textParts = encrypted.split(":");

  //extract the IV from the first half of the value
  const IV = Buffer.from(textParts.shift(), outputEncoding);

  //extract the encrypted text without the IV
  const encryptedText = Buffer.from(textParts.join(":"), outputEncoding);

  //decipher the string
  const decipher = createDecipheriv(algorithm, key, IV);
  let decrypted = decipher.update(encryptedText, outputEncoding, inputEncoding);
  decrypted += decipher.final(inputEncoding);
  //log("decrypt: out = " + decrypted.toString(), "cryp", "info");
  return decrypted.toString();
}

export default { encrypt, decrypt };
