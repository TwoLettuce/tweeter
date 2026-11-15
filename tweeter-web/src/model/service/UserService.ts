// AI-assisted: see AI-ATTRIBUTION.md
import { Buffer } from "buffer";
import {
  AuthToken,
  User,
  FakeData,
  LoginRequest,
  LogoutRequest,
  RegisterRequest,
} from "tweeter-shared";
import { Service } from "./Service";

export class UserService extends Service {
  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const req: RegisterRequest = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: imageStringBase64,
      imageFileExtension: imageFileExtension,
    };
    return await this.server.register(req);
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[User, AuthToken]> {
    const req: LoginRequest = {
      alias: alias,
      password: password,
    };
    return await this.server.login(req);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const req: LogoutRequest = {
      token: authToken.token,
    };
    await this.server.logout(req);
  }
}
