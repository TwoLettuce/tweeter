import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { NavigateFunction } from "react-router-dom";
import { Presenter, View } from "../Presenter";

export interface UserNavigationView extends View {
  setDisplayedUser: (user: User) => void;
  navigate: NavigateFunction;
}
export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private userService: UserService;

  public constructor(view: UserNavigationView) {
    super(view);
    this.userService = new UserService();
  }

  public async doNavigate(
    event: React.MouseEvent,
    displayedUser: User,
    authToken: AuthToken,
    featurePath: string,
  ) {
    await this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(event.target.toString());

      const toUser = await this.userService.getUser(authToken, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    }, "get user");
  }
  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
