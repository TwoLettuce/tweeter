// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, AuthTokenDto, FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { IUserDAO } from "../dao/user/IUserDAO";

export class UserService extends Service {
  private userDAO: IUserDAO;
  public constructor() {
    super();
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    this.authenticate(token);
    const user = this.userDAO.getUser(alias);
    return user ?? null;
  }

  public async logout(token: string): Promise<void> {
    this.authenticate(token);
    this.authDAO.deleteAuth(token);
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
