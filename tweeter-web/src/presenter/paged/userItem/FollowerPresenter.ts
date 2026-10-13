import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";

export class FollowerPresenter extends UserItemPresenter {
  protected async getMoreItems(
    authToken: AuthToken,
    alias: string,
  ): Promise<[User[], boolean]> {
    return await this.serviceFactory().loadMoreFollowers(
      authToken,
      alias,
      this.PAGE_SIZE,
      this.lastItem,
    );
  }
  protected getItemDescription(): string {
    return "load followers";
  }
}
