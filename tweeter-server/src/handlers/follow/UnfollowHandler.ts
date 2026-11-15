// AI-assisted: see AI-ATTRIBUTION.md
import { UnfollowRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const unfollowHandler = async (
  request: UnfollowRequest,
): Promise<FollowResponse> => {
  const followService = new FollowService();
  const [followerCount, followeeCount] = await followService.unfollow(
    request.token,
    request.userToUnfollow,
  );
  return {
    success: true,
    message: null,
    followerCount: followerCount,
    followeeCount: followeeCount,
  };
};
