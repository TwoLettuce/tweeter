import { NavigateFunction } from "react-router-dom";
import { UserService } from "../../../model/service/UserService";
import { User, AuthToken } from "tweeter-shared";

export interface LoginView {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined,
  ) => string;
  navigate: NavigateFunction;
}
export class LoginPresenter {
  private userService: UserService;
  private view: LoginView;

  public constructor(view: LoginView) {
    this.userService = new UserService();
    this.view = view;
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string,
  ) {
    try {
      const [user, authToken] = await this.userService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`,
      );
    } finally {
      setIsLoading(false);
    }
  }
}
