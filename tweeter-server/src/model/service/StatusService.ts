// AI-assisted: see AI-ATTRIBUTION.md
import { FakeData, Status, StatusDto } from "tweeter-shared";

export class StatusService {
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    return this.getFakeData(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    return this.getFakeData(lastItem, pageSize);
  }

  private getFakeData(
    lastItem: StatusDto | null,
    pageSize: number,
  ): [StatusDto[], boolean] {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      lastItem ? Status.fromDto(lastItem) : null,
      pageSize,
    );
    return [items.map((item) => item.dto), hasMore];
  }
}
