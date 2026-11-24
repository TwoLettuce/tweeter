// AI-assisted: see AI-ATTRIBUTION.md
import { UnfollowRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AwsDAOFactory } from "../../model/dao/factory/AwsDAOFactory";
import { withApiErrorHandling } from "../withApiErrorHandling";

export const unfollowHandler = withApiErrorHandling(async (
  request: UnfollowRequest,
): Promise<FollowResponse> => {
  const followService = new FollowService(new AwsDAOFactory());
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
});
