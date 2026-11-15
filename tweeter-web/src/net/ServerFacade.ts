// AI-assisted: see AI-ATTRIBUTION.md
import {
  PagedItemRequest,
  PagedItemResponse,
  Status,
  StatusDto,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";
export class ServerFacade {
  private clientCommunicator: ClientCommunicator;
  public constructor() {
    this.clientCommunicator = new ClientCommunicator(
      "https://yhfxfip4o4.execute-api.us-east-2.amazonaws.com/prod",
    );
  }

  public async loadMoreFollowees(
    req: PagedItemRequest<UserDto>,
  ): Promise<[User[], boolean]> {
    const res = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(req, `/followees/${encodeURIComponent(req.userAlias)}`);

    if (!res.success) {
      throw new Error(res.message ?? "Failed to load followees");
    }

    if (res.items === null) {
      throw new Error("Followees response is missing items");
    }

    return [res.items.map((dto) => User.fromDto(dto)), res.hasMore];
  }

  public async loadMoreFollowers(
    req: PagedItemRequest<UserDto>,
  ): Promise<[User[], boolean]> {
    const res = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(req, `/followers/${encodeURIComponent(req.userAlias)}`);

    if (!res.success) {
      throw new Error(res.message ?? "Failed to load followers");
    }

    if (res.items === null) {
      throw new Error("Followers response is missing items");
    }

    return [res.items.map((dto) => User.fromDto(dto)), res.hasMore];
  }

  public async loadMoreFeedItems(
    req: PagedItemRequest<StatusDto>,
  ): Promise<[Status[], boolean]> {
    const res = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDto>,
      PagedItemResponse<StatusDto>
    >(req, `/feed/${encodeURIComponent(req.userAlias)}`);

    if (!res.success) {
      throw new Error(res.message ?? "Failed to load feed");
    }

    if (res.items === null) {
      throw new Error("Feed response is missing items");
    }

    return [res.items.map((dto) => Status.fromDto(dto)), res.hasMore];
  }

  public async loadMoreStoryItems(
    req: PagedItemRequest<StatusDto>,
  ): Promise<[Status[], boolean]> {
    const res = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDto>,
      PagedItemResponse<StatusDto>
    >(req, `/story/${encodeURIComponent(req.userAlias)}`);

    if (!res.success) {
      throw new Error(res.message ?? "Failed to load story");
    }

    if (res.items === null) {
      throw new Error("Story response is missing items");
    }

    return [res.items.map((dto) => Status.fromDto(dto)), res.hasMore];
  }
}
