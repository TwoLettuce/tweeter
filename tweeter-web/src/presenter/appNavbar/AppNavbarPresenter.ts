import { NavigateFunction } from "react-router-dom";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { Presenter, MessageView } from "../Presenter";

export interface AppNavbarView extends MessageView {
  clearUserInfo: () => void;
  navigate: NavigateFunction;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private _userService: UserService;

  public constructor(view: AppNavbarView) {
    super(view);
    this._userService = new UserService();
  }

  public async logOut(authToken: AuthToken) {
    await this.doFailureReportingOperation(async () => {
      const loggingOutToastId = this.view.displayInfoMessage(
        "Logging Out...",
        0,
      );
      await this.userService.logout(authToken!);
      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "log user out");
  }

  public get userService() {
    return this._userService;
  }
}
