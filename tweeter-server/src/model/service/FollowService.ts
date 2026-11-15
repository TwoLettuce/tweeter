// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastFollowee: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    return this.getFakeData(lastFollowee, pageSize, userAlias);
  }

  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string,
  ): Promise<[UserDto[], boolean]> {
    const [users, hasMore] = FakeData.instance.getPageOfUsers(
      lastItem ? User.fromDto(lastItem) : null,
      pageSize,
      userAlias,
    );
    return [users.map((user) => user.dto), hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastFollower: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastFollower, pageSize, userAlias);
  }

  public async getIsFollowerStatus(
    token: string,
    alias: string,
    selectedAlias: string,
  ): Promise<boolean> {
    // Replace FakeData with a lookup of the relationship between these aliases.
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    token: string,
    alias: string,
  ): Promise<number> {
    // Replace FakeData with a stored followee count when persistence is added.
    return FakeData.instance.getFolloweeCount(alias);
  }

  public async getFollowerCount(
    token: string,
    alias: string,
  ): Promise<number> {
    // Replace FakeData with a stored follower count when persistence is added.
    return FakeData.instance.getFollowerCount(alias);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(
      authToken.token,
      userToFollow.alias,
    );
    const followeeCount = await this.getFolloweeCount(
      authToken.token,
      userToFollow.alias,
    );

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
      authToken.token,
      userToUnfollow.alias,
    );
    const followeeCount = await this.getFolloweeCount(
      authToken.token,
      userToUnfollow.alias,
    );

    return [followerCount, followeeCount];
  }
}
