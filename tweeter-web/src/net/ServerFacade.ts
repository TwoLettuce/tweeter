// AI-assisted: see AI-ATTRIBUTION.md
import {
  AuthToken,
  CountRequest,
  CountResponse,
  FollowRequest,
  UnfollowRequest,
  FollowResponse,
  PostStatusRequest,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  TweeterRequest,
  TweeterResponse,
  RegisterRequest,
  RegisterResponse,
  PagedItemRequest,
  PagedItemResponse,
  Status,
  StatusDto,
  User,
  UserDto,
  UserRequest,
  UserResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";
import { ApiClientError, isApiErrorResponse } from "./ApiClientError";

export class ServerFacade {
  private clientCommunicator: ClientCommunicator;

  public constructor() {
    this.clientCommunicator = new ClientCommunicator(
      "https://yhfxfip4o4.execute-api.us-east-2.amazonaws.com/prod",
    );
  }

  public async postStatus(req: PostStatusRequest): Promise<void> {
    await this.post<PostStatusRequest, TweeterResponse>(req, "/status");
  }

  public async follow(
    req: FollowRequest,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const res = await this.post<FollowRequest, FollowResponse>(req, "/follow");
    return [res.followerCount, res.followeeCount];
  }

  public async unfollow(
    req: UnfollowRequest,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const res = await this.post<UnfollowRequest, FollowResponse>(
      req,
      "/unfollow",
    );
    return [res.followerCount, res.followeeCount];
  }

  public async getFolloweeCount(req: CountRequest): Promise<number> {
    const res = await this.post<CountRequest, CountResponse>(
      req,
      `/followeecount/${encodeURIComponent(req.alias)}`,
    );
    return res.count;
  }

  public async getFollowerCount(req: CountRequest): Promise<number> {
    const res = await this.post<CountRequest, CountResponse>(
      req,
      `/followercount/${encodeURIComponent(req.alias)}`,
    );
    return res.count;
  }

  public async getIsFollowerStatus(req: IsFollowerRequest): Promise<boolean> {
    const res = await this.post<IsFollowerRequest, IsFollowerResponse>(
      req,
      `/isfollower/${encodeURIComponent(req.followerAlias)}/${encodeURIComponent(req.followeeAlias)}`,
    );
    return res.isFollower;
  }

  public async getUser(req: UserRequest): Promise<User | null> {
    const res = await this.post<UserRequest, UserResponse>(
      req,
      `/user/${encodeURIComponent(req.alias)}`,
    );
    return res.user === null ? null : User.fromDto(res.user);
  }

  public async login(req: LoginRequest): Promise<[User, AuthToken]> {
    const res = await this.post<LoginRequest, LoginResponse>(req, "/login");
    return this.getAuthenticatedUser(res);
  }

  public async register(req: RegisterRequest): Promise<[User, AuthToken]> {
    const res = await this.post<RegisterRequest, RegisterResponse>(
      req,
      "/register",
    );
    return this.getAuthenticatedUser(res);
  }

  public async logout(req: LogoutRequest): Promise<void> {
    await this.post<LogoutRequest, TweeterResponse>(req, "/logout");
  }

  public loadMoreFollowees(
    req: PagedItemRequest<UserDto>,
  ): Promise<[User[], boolean]> {
    return this.loadPage(req, "followees", User.fromDto);
  }

  public loadMoreFollowers(
    req: PagedItemRequest<UserDto>,
  ): Promise<[User[], boolean]> {
    return this.loadPage(req, "followers", User.fromDto);
  }

  public loadMoreFeedItems(
    req: PagedItemRequest<StatusDto>,
  ): Promise<[Status[], boolean]> {
    return this.loadPage(req, "feed", Status.fromDto);
  }

  public loadMoreStoryItems(
    req: PagedItemRequest<StatusDto>,
  ): Promise<[Status[], boolean]> {
    return this.loadPage(req, "story", Status.fromDto);
  }

  private async post<REQ extends TweeterRequest, RES extends TweeterResponse>(
    req: REQ,
    endpoint: string,
  ): Promise<RES> {
    const res = await this.clientCommunicator.doPost<REQ, RES>(req, endpoint);
    if (!res.success) {
      if (isApiErrorResponse(res)) {
        throw new ApiClientError(res.code);
      }
      throw new ApiClientError("INTERNAL_ERROR");
    }
    return res;
  }

  private async loadPage<DTO, ITEM>(
    req: PagedItemRequest<DTO>,
    resource: "followees" | "followers" | "feed" | "story",
    fromDto: (dto: DTO) => ITEM,
  ): Promise<[ITEM[], boolean]> {
    const res = await this.post<PagedItemRequest<DTO>, PagedItemResponse<DTO>>(
      req,
      `/${resource}/${encodeURIComponent(req.userAlias)}`,
    );

    if (res.items === null) {
      throw new ApiClientError("INVALID_RESPONSE");
    }

    return [res.items.map(fromDto), res.hasMore];
  }

  private getAuthenticatedUser(
    res: LoginResponse | RegisterResponse,
  ): [User, AuthToken] {
    if (res.user == null || res.authToken == null) {
      throw new ApiClientError("INVALID_RESPONSE");
    }
    return [User.fromDto(res.user), AuthToken.fromDto(res.authToken)];
  }
}
