import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { NavigateFunction } from "react-router-dom";
import { MessageView, Presenter } from "../Presenter";

export interface UserInfoView extends MessageView {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFollower: React.Dispatch<React.SetStateAction<boolean>>;
  setFolloweeCount: React.Dispatch<React.SetStateAction<number>>;
  setFollowerCount: React.Dispatch<React.SetStateAction<number>>;
  setDisplayedUser: (user: User) => void;
  navigate: NavigateFunction;
}
export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.followService = new FollowService();
  }

  public switchToLoggedInUser(currentUser: User, pathname: string) {
    this.view.setDisplayedUser(currentUser!);
    this.view.navigate(`${this.getBaseUrl(pathname)}/${currentUser.alias}`);
  }

  private getBaseUrl(pathname: string): string {
    const segments = pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.followService.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!,
          ),
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.followService.getFolloweeCount(authToken, displayedUser),
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.followService.getFollowerCount(authToken, displayedUser),
      );
    }, "get followers count");
  }

  private async doFollowOperation(
    displayedUser: User,
    authToken: AuthToken,
    followOperation: (
      authToken: AuthToken,
      user: User,
    ) => Promise<[number, number]>,
    description: string,
    nowFollowing: boolean,
  ) {
    let followMessage = "";
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      followMessage = this.view.displayInfoMessage(
        `${description}ing ${displayedUser!.name}...`,
        0,
      );

      const [followerCount, followeeCount] = await followOperation(
        authToken!,
        displayedUser!,
      );

      this.view.setIsFollower(nowFollowing);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, `${description} user`);
    this.view.deleteMessage(followMessage);
    this.view.setIsLoading(false);
  }

  public async followDisplayedUser(
    displayedUser: User,
    authToken: AuthToken,
  ): Promise<void> {
    await this.doFollowOperation(
      displayedUser,
      authToken,
      async (authToken: AuthToken, user: User) =>
        await this.followService.follow(authToken, user),
      "follow",
      true,
    );
  }

  public async unfollowDisplayedUser(
    displayedUser: User,
    authToken: AuthToken,
  ): Promise<void> {
    await this.doFollowOperation(
      displayedUser,
      authToken,
      async (authToken: AuthToken, user: User) =>
        await this.followService.unfollow(authToken, user),
      "unfollow",
      false,
    );
  }
}
