import { IAuthDAO } from "../dao/auth/IAuthDAO";

export abstract class Service {
  private _authDAO: IAuthDAO;

  protected get authDAO(): IAuthDAO {
    return this._authDAO;
  }

  protected async authenticate(token: string) {
    const authData = await this.authDAO.getAuth(token);
    if (authData == null) {
      throw new Error("unauthorized: Not logged in");
    } else {
    }
  }
}
