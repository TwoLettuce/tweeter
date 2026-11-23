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
    lastFollowee: UserDto | null,
  ): Promise<[UserDto[], boolean]>;
  follow(follower: UserDto, userToFollow: UserDto): Promise<[number, number]>;
  unfollow(
    follower: UserDto,
    userToUnfollow: UserDto,
  ): Promise<[number, number]>;
}
