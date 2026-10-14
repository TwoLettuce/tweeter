import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "../Presenter";
import { UserService } from "../../model/service/UserService";

export interface AuthenticationView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  navigate: NavigateFunction;
}

export abstract class AuthenticationPresenter<
  T extends AuthenticationView,
> extends Presenter<T> {
  private _userService: UserService;

  public constructor(view: T) {
    super(view);
    this._userService = new UserService();
  }

  protected async doAuthenticationOperation(
    authFunction: () => Promise<[User, AuthToken, boolean]>,
    navigationFunction: (user: User) => void,
    operationDescription: string,
  ) {
    try {
      const [user, authToken, rememberMe] = await authFunction();
      this.view.updateUserInfo(user, user, authToken, rememberMe);
      navigationFunction(user);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`,
      );
    }
  }

  protected get userService() {
    return this._userService;
  }
}
