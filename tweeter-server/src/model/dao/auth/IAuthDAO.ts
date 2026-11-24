import { AuthTokenDto } from "tweeter-shared";
import { AuthDataDto } from "../../domain/AuthData";

export interface IAuthDAO {
  getAuth(token: string): Promise<AuthDataDto | null>;
  createAuth(alias: string): Promise<AuthTokenDto>;
  deleteAuth(token: string): Promise<void>;
}
