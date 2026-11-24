// AI-assisted: see AI-ATTRIBUTION.md
import bcrypt from "bcryptjs";
import { IPasswordEncryptor } from "./IPasswordEncryptor";

const BCRYPT_ROUNDS = 12;

export class BcryptPasswordEncryptor implements IPasswordEncryptor {
  public hash(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  public verify(password: string, encryptedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, encryptedPassword);
  }
}
