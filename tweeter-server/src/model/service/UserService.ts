// AI-assisted: see AI-ATTRIBUTION.md
import { AuthTokenDto, UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { IUserDAO } from "../dao/user/IUserDAO";
import { IUserImageDAO } from "../dao/user/IUserImageDAO";
import { IDAOFactory } from "../dao/factory/IDAOFactory";
import { IPasswordEncryptor } from "../dao/user/IPasswordEncryptor";
import { ApiError } from "../../errors/ApiError";

export class UserService extends Service {
  private userDAO: IUserDAO;
  private userImageDAO: IUserImageDAO;
  private passwordEncryptor: IPasswordEncryptor;

  public constructor(factory: IDAOFactory) {
    super(factory);
    this.userDAO = factory.getUserDAO();
    this.userImageDAO = factory.getUserImageDAO();
    this.passwordEncryptor = factory.getPasswordEncryptor();
  }

  public async getUser(token: string, alias: string): Promise<UserDto | null> {
    await this.authenticate(token);
    const user = await this.userDAO.getUser(alias);
    return user ?? null;
  }

  public async logout(token: string): Promise<void> {
    await this.authenticate(token);
    await this.authDAO.deleteAuth(token);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    if ((await this.userDAO.getUser(alias)) != null) {
      throw new ApiError("ALIAS_TAKEN");
    }

    const user = await this.userDAO.createUser(
      firstName,
      lastName,
      alias,
      password,
    );
    await this.userImageDAO.putUserImage(
      alias,
      userImageBytes,
      imageFileExtension,
    );
    const auth = await this.authDAO.createAuth(alias);

    return [user, auth];
  }

  public async login(
    alias: string,
    password: string,
  ): Promise<[UserDto, AuthTokenDto]> {
    const credentials = await this.userDAO.getUserWithPassword(alias);

    if (
      credentials === null ||
      !(await this.passwordEncryptor.verify(password, credentials.password))
    ) {
      throw new ApiError("INVALID_CREDENTIALS");
    }

    const user = {
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      alias: credentials.alias,
      imageUrl: credentials.imageUrl,
    };

    return [user, await this.authDAO.createAuth(alias)];
  }
}
