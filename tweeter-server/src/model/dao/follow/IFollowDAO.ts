// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "tweeter-shared";

export interface IFollowDAO {
  getFollowees(
    alias: string,
    pageSize: number,
    lastFollowee: UserDto | null,
  ): Promise<[UserDto[], boolean]>;
  getFollowers(
    alias: string,
    pageSize: number,
    lastFollower: UserDto | null,
  ): Promise<[UserDto[], boolean]>;
  /** True when followerAlias follows followeeAlias. */
  isFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
  getFollowerCount(alias: string): Promise<number>;
  getFolloweeCount(alias: string): Promise<number>;
  /** Returns the target user's [followerCount, followeeCount] after the change. */
  follow(follower: UserDto, userToFollow: UserDto): Promise<[number, number]>;
  unfollow(
    follower: UserDto,
    userToUnfollow: UserDto,
  ): Promise<[number, number]>;
}
