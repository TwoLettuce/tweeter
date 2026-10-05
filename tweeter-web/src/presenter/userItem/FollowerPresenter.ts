import { AuthToken } from "tweeter-shared";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { FollowService } from "../../model/service/FollowService";
import { PAGE_SIZE } from "./FolloweePresenter";

export class FollowerPresenter extends UserItemPresenter {
  public constructor(view: UserItemView) {
    super(view);
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this.followService.loadMoreFollowers(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem,
      );

      this.hasMoreItems = hasMore;
      this.lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load followees because of exception: ${error}`,
      );
    }
  }
}
