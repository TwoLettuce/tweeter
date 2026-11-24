// AI-assisted: see AI-ATTRIBUTION.md
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const COST = 16384;

function deriveKey(password: string, salt: string, cost: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, KEY_LENGTH, { N: cost }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = await deriveKey(password, salt, COST);
  return `scrypt$${COST}$${salt}$${key.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [algorithm, costValue, salt, expectedHex] = storedHash.split("$");
  if (
    algorithm !== "scrypt" ||
    Number(costValue) !== COST ||
    !salt ||
    !/^[0-9a-f]+$/i.test(expectedHex ?? "")
  ) {
    return false;
  }

  const expected = Buffer.from(expectedHex, "hex");
  const actual = await deriveKey(password, salt, Number(costValue));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
