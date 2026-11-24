// AI-assisted: see AI-ATTRIBUTION.md
import { IAuthDAO } from "../dao/auth/IAuthDAO";
import { IDAOFactory } from "../dao/factory/IDAOFactory";
import { ApiError } from "../../errors/ApiError";

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
      throw new ApiError("SESSION_EXPIRED");
    } else {
      return authData;
    }
  }
}
