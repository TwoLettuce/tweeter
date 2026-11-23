import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface IUserDAO {
  getUser(alias: string): Promise<UserDto | null>;
  register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
  ): Promise<[UserDto, AuthTokenDto]>;
}
