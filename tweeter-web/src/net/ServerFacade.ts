// AI-assisted: see AI-ATTRIBUTION.md
import {
  AuthToken,
  CountRequest,
  CountResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
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
export class ServerFacade {
  private clientCommunicator: ClientCommunicator;
  public constructor() {
    this.clientCommunicator = new ClientCommunicator(
      "https://yhfxfip4o4.execute-api.us-east-2.amazonaws.com/prod",
    );
  }

  public async getFolloweeCount(req: CountRequest): Promise<number> {
    const res = await this.clientCommunicator.doPost<CountRequest, CountResponse>(
      req,
      `/followeecount/${encodeURIComponent(req.alias)}`,
    );

    if (!res.success) {
      throw new Error(res.message ?? "Failed to get followee count");
    }

    return res.count;
  }

  public async getFollowerCount(req: CountRequest): Promise<number> {
    const res = await this.clientCommunicator.doPost<CountRequest, CountResponse>(
      req,
      `/followercount/${encodeURIComponent(req.alias)}`,
    );

    if (!res.success) {
      throw new Error(res.message ?? "Failed to get follower count");
    }

    return res.count;
  }

  public async getIsFollowerStatus(req: IsFollowerRequest): Promise<boolean> {
    const res = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      IsFollowerResponse
    >(
      req,
      `/isfollower/${encodeURIComponent(req.alias)}/${encodeURIComponent(req.selectedAlias)}`,
    );

    if (!res.success) {
      throw new Error(res.message ?? "Failed to get follower status");
    }

    return res.isFollower;
  }

  public async getUser(req: UserRequest): Promise<User | null> {
    const res = await this.clientCommunicator.doPost<UserRequest, UserResponse>(
      req,
      `/user/${encodeURIComponent(req.alias)}`,
    );

    if (!res.success) {
      throw new Error(res.message ?? "Failed to get user");
    }

    return res.user === null ? null : User.fromDto(res.user);
  }

  public async login(req: LoginRequest): Promise<[User, AuthToken]> {
    const res = await this.clientCommunicator.doPost<LoginRequest, LoginResponse>(
      req,
      "/login",
    );

    if (!res.success) {
      throw new Error(res.message ?? "Failed to log in");
    }

    if (res.user == null || res.authToken == null) {
      throw new Error("Login response is missing the user or auth token");
    }

    return [User.fromDto(res.user), AuthToken.fromDto(res.authToken)];
  }

  public async register(req: RegisterRequest): Promise<[User, AuthToken]> {
    const res = await this.clientCommunicator.doPost<
      RegisterRequest,
      RegisterResponse
    >(req, "/register");

    if (!res.success) {
      throw new Error(res.message ?? "Failed to register");
    }

    if (res.user == null || res.authToken == null) {
      throw new Error("Register response is missing the user or auth token");
    }

    return [User.fromDto(res.user), AuthToken.fromDto(res.authToken)];
  }

  public async logout(req: LogoutRequest): Promise<void> {
    const res = await this.clientCommunicator.doPost<LogoutRequest, TweeterResponse>(
      req,
      "/logout",
    );

    if (!res.success) {
      throw new Error(res.message ?? "Failed to log out");
    }
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
