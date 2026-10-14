import { User } from "tweeter-shared";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "../AuthenticationPresenter";

export interface LoginView extends AuthenticationView {}
export class LoginPresenter extends AuthenticationPresenter<LoginView> {
  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string,
  ) {
    await this.doAuthenticationOperation(
      async () => {
        const [user, authToken] = await this.userService.login(alias, password);
        return [user, authToken, rememberMe];
      },
      (user: User) => {
        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate(`/feed/${user.alias}`);
        }
      },
      "log user in",
    );
  }
}
