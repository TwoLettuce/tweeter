import { ServerFacade } from "../../net/ServerFacade";

export class Service {
  private _server = new ServerFacade();
  protected get server(): ServerFacade {
    return this._server;
  }
}
