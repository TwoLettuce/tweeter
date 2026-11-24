// AI-assisted: see AI-ATTRIBUTION.md
export interface IPasswordEncryptor {
  hash(password: string): Promise<string>;
  verify(password: string, encryptedPassword: string): Promise<boolean>;
}
