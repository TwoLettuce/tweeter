import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  protected async getMoreItems(
    authToken: AuthToken,
    alias: string,
  ): Promise<[Status[], boolean]> {
    return await this.serviceFactory().loadMoreFeedItems(
      authToken,
      alias,
      this.PAGE_SIZE,
      this.lastItem,
    );
  }
  protected getItemDescription(): string {
    return "load feed";
  }
}
