// AI-assisted: see AI-ATTRIBUTION.md
import { StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { IStatusDAO } from "../dao/status/IStatusDAO";

export class StatusService extends Service {
  private statusDAO: IStatusDAO;
  public constructor() {
    super();
  }
  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    await this.authenticate(token);
    await this.statusDAO.postToFeeds(newStatus);
    await this.statusDAO.postToStory(newStatus);
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    await this.authenticate(token);

    return await this.statusDAO.getFeed(userAlias, pageSize, lastItem);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    await this.authenticate(token);

    return await this.statusDAO.getStory(userAlias, pageSize, lastItem);
  }
}
