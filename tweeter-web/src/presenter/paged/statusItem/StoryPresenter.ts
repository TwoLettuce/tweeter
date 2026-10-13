import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PagedItemView } from "../PagedItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
  protected async getMoreItems(
    authToken: AuthToken,
    alias: string,
  ): Promise<[Status[], boolean]> {
    return await this.serviceFactory().loadMoreStoryItems(
      authToken,
      alias,
      this.PAGE_SIZE,
      this.lastItem,
    );
  }
  protected getItemDescription(): string {
    return "load story";
  }
}
