import { NavigateFunction } from "react-router-dom";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export interface AppNavbarView {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined,
  ) => string;
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined,
  ) => string;
  deleteMessage: (messageID: string) => void;
  clearUserInfo: () => void;
  navigate: NavigateFunction;
}

export class AppNavbarPresenter {
  private view: AppNavbarView;
  private userService: UserService;

  public constructor(view: AppNavbarView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async logOut(authToken: AuthToken) {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.userService.logout(authToken!);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`,
      );
    }
  }
}
