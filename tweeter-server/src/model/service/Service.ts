import { IAuthDAO } from "../dao/auth/IAuthDAO";
import { IDAOFactory } from "../dao/factory/IDAOFactory";

export abstract class Service {
  private _authDAO: IAuthDAO;
  protected constructor(factory: IDAOFactory) {
    this._authDAO = factory.getAuthDAO();
  }

  protected get authDAO(): IAuthDAO {
    return this._authDAO;
  }

  protected async authenticate(token: string) {
    const authData = await this.authDAO.getAuth(token);
    if (authData == null) {
      throw new Error("unauthorized: Not logged in");
    } else {
      return authData;
    }
  }
}
