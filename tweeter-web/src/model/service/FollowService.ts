// AI-assisted: see AI-ATTRIBUTION.md
import {
  AuthToken,
  CountRequest,
  FollowRequest,
  UnfollowRequest,
  IsFollowerRequest,
  PagedItemRequest,
  User,
  UserDto,
} from "tweeter-shared";
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
    const req: IsFollowerRequest = {
      token: authToken.token,
      alias: user.alias,
      selectedAlias: selectedUser.alias,
    };
    return await this.server.getIsFollowerStatus(req);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    const req: CountRequest = {
      token: authToken.token,
      alias: user.alias,
    };
    return await this.server.getFolloweeCount(req);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    const req: CountRequest = {
      token: authToken.token,
      alias: user.alias,
    };
    return await this.server.getFollowerCount(req);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const req: FollowRequest = {
      token: authToken.token,
      userToFollow: userToFollow.dto,
    };
    return await this.server.follow(req);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const req: UnfollowRequest = {
      token: authToken.token,
      userToUnfollow: userToUnfollow.dto,
    };
    return await this.server.unfollow(req);
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
