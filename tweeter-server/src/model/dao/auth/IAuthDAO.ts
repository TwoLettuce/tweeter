import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface IAuthDAO {
  login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]>;
  logout(token: string): Promise<void>;
}
