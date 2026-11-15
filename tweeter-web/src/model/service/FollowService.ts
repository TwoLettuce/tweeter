// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, FakeData, PagedItemRequest, User, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService extends Service {
  public async loadMoreFollowees(
    token: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollowee: User | null,
  ): Promise<[User[], boolean]> {
    const req: PagedItemRequest<UserDto> = {
      token: token.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastFollowee?.dto ?? null,
    };
    return await this.server.loadMoreFollowees(req);
  }

  public async loadMoreFollowers(
    token: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollower: User | null,
  ): Promise<[User[], boolean]> {
    const req: PagedItemRequest<UserDto> = {
      token: token.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastFollower?.dto ?? null,
    };
    return await this.server.loadMoreFollowers(req);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User,
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(
      authToken,
      userToUnfollow,
    );
    const followeeCount = await this.getFolloweeCount(
      authToken,
      userToUnfollow,
    );

    return [followerCount, followeeCount];
  }

  private getDomainObject(dto: UserDto | null) {
    return dto != null
      ? new User(dto.firstName, dto.lastName, dto.alias, dto.imageUrl)
      : null;
  }

  private getDto(user: User): UserDto {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      alias: user.alias,
      imageUrl: user.imageUrl,
    };
  }
}
