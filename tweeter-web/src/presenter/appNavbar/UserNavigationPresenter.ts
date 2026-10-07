import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { NavigateFunction } from "react-router-dom";

export interface UserNavigationView {
  setDisplayedUser: (user: User) => void;
  navigate: NavigateFunction;
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined,
  ) => string;
}
export class UserNavigationPresenter {
  private userService: UserService;
  private view: UserNavigationView;

  public constructor(view: UserNavigationView) {
    this.userService = new UserService();
    this.view = view;
  }

  public async doNavigate(
    event: React.MouseEvent,
    displayedUser: User,
    authToken: AuthToken,
    featurePath: string,
  ) {
    try {
      const alias = this.extractAlias(event.target.toString());

      const toUser = await this.userService.getUser(authToken, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`,
      );
    }
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
