import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
  protected async getMoreItems(
    authToken: AuthToken,
    alias: string,
  ): Promise<[User[], boolean]> {
    return this.serviceFactory().loadMoreFollowees(
      authToken,
      alias,
      this.PAGE_SIZE,
      this.lastItem,
    );
  }
  protected getItemDescription(): string {
    return "load followees";
  }
}
