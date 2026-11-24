// AI-assisted: see AI-ATTRIBUTION.md
import { IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AwsDAOFactory } from "../../model/dao/factory/AwsDAOFactory";

export const getIsFollowerHandler = async (
  request: IsFollowerRequest,
): Promise<IsFollowerResponse> => {
  const followService = new FollowService(new AwsDAOFactory());
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
