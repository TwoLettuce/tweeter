// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, AuthTokenDto, FakeData, UserDto } from "tweeter-shared";

export class UserService {
  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    const user = FakeData.instance.findUserByAlias(alias);
    return user?.dto ?? null;
  }

  public async logout(token: string): Promise<void> {
    // No token store exists yet. Invalidate the token here when persistence is added.
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    // Preserve the existing FakeData registration behavior until storage is implemented.
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("bad-request: Invalid registration");
    }

    return [user.dto, AuthToken.Generate().dto];
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    // Preserve the existing FakeData login behavior until authentication is implemented.
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("unauthorized: Invalid alias or password");
    }

    return [user.dto, AuthToken.Generate().dto];
  }
}
