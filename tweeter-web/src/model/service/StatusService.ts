// AI-assisted: see AI-ATTRIBUTION.md
import {
  AuthToken,
  Status,
  StatusDto,
  PagedItemRequest,
  PostStatusRequest,
} from "tweeter-shared";
import { Service } from "./Service";

export class StatusService extends Service {
  public async postStatus(
    authToken: AuthToken,
    newStatus: Status,
  ): Promise<void> {
    const req: PostStatusRequest = {
      token: authToken.token,
      newStatus: newStatus.dto,
    };
    await this.server.postStatus(req);
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    const req: PagedItemRequest<StatusDto> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    return await this.server.loadMoreFeedItems(req);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    const req: PagedItemRequest<StatusDto> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    return await this.server.loadMoreStoryItems(req);
  }
}
