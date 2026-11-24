// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { IFollowDAO } from "../dao/follow/IFollowDAO";
import { IUserDAO } from "../dao/user/IUserDAO";
import { IDAOFactory } from "../dao/factory/IDAOFactory";

export class FollowService extends Service {
  private followDAO: IFollowDAO;
  private userDAO: IUserDAO;
  public constructor(factory: IDAOFactory) {
    super();
    this.followDAO = factory.getFollowDAO();
    this.userDAO = factory.getUserDAO();
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastFollowee: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    await this.authenticate(token);

    return await this.followDAO.getFollowees(userAlias, pageSize, lastFollowee);
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastFollower: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    await this.authenticate(token);

    return await this.followDAO.getFollowers(userAlias, pageSize, lastFollower);
  }

  public async getIsFollowerStatus(
    token: string,
    alias: string,
    selectedAlias: string,
  ): Promise<boolean> {
    await this.authenticate(token);

    const selectedUser = await this.userDAO.getUser(selectedAlias);
    if (selectedUser == null) {
      throw new Error("bad-request: selected alias does not exist");
    }

    const followers = (await this.followDAO.getFollowers(alias, 0, null))[0];
    return followers.includes(selectedUser);
  }

  public async getFolloweeCount(token: string, alias: string): Promise<number> {
    await this.authenticate(token);

    return (await this.followDAO.getFollowees(alias, 0, null))[0].length;
  }

  public async getFollowerCount(token: string, alias: string): Promise<number> {
    await this.authenticate(token);

    return (await this.followDAO.getFollowers(alias, 0, null))[0].length;
  }

  public async follow(
    token: string,
    userToFollow: UserDto,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const authData = await this.authenticate(token);
    const follower = await this.userDAO.getUser(authData.alias);
    await this.followDAO.follow(follower!, userToFollow);

    const followerCount = await this.getFollowerCount(
      token,
      userToFollow.alias,
    );
    const followeeCount = await this.getFolloweeCount(
      token,
      userToFollow.alias,
    );

    return [followerCount, followeeCount];
  }

  public async unfollow(
    token: string,
    userToUnfollow: UserDto,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const authData = await this.authenticate(token);
    const follower = await this.userDAO.getUser(authData.alias);
    await this.followDAO.unfollow(follower!, userToUnfollow);

    const followerCount = await this.getFollowerCount(
      token,
      userToUnfollow.alias,
    );
    const followeeCount = await this.getFolloweeCount(
      token,
      userToUnfollow.alias,
    );

    return [followerCount, followeeCount];
  }
}
