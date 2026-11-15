// AI-assisted: see AI-ATTRIBUTION.md
import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const getIsFollowerHandler = async (
  request: IsFollowerRequest,
): Promise<IsFollowerResponse> => {
  const followService = new FollowService();
  const isFollower = await followService.getIsFollowerStatus(
    request.token,
    request.alias,
    request.selectedAlias,
  );
  return {
    success: true,
    message: null,
    isFollower: isFollower,
  };
};
