import { AuthTokenDto } from "tweeter-shared";

export interface IAuthDAO {
  getAuth(token: string): Promise<void>;
  createAuth(alias: string): Promise<AuthTokenDto>;
  deleteAuth(token: string): Promise<void>;
}
