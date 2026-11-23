import { AuthTokenDto } from "tweeter-shared";

export interface IAuthDAO {
  getAuth(token: string): Promise<AuthTokenDto | null>;
  createAuth(alias: string): Promise<AuthTokenDto>;
  deleteAuth(token: string): Promise<void>;
}
