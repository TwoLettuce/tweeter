// AI-assisted: see AI-ATTRIBUTION.md
import { FollowRequest, FollowResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const followHandler = async (
  request: FollowRequest,
): Promise<FollowResponse> => {
  const followService = new FollowService();
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
};
