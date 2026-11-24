// AI-assisted: see AI-ATTRIBUTION.md
import { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AwsDAOFactory } from "../../model/dao/factory/AwsDAOFactory";
import { withApiErrorHandling } from "../withApiErrorHandling";

export const followHandler = withApiErrorHandling(async (
  request: FollowRequest,
): Promise<FollowResponse> => {
  const followService = new FollowService(new AwsDAOFactory());
  const [followerCount, followeeCount] = await followService.follow(
    request.token,
    request.userToFollow,
  );
  return {
    success: true,
    message: null,
    followerCount: followerCount,
    followeeCount: followeeCount,
  };
});
