// AI-assisted: see AI-ATTRIBUTION.md
import { CountRequest, CountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AwsDAOFactory } from "../../model/dao/factory/AwsDAOFactory";
import { withApiErrorHandling } from "../withApiErrorHandling";

export const getFolloweeCountHandler = withApiErrorHandling(async (
  request: CountRequest,
): Promise<CountResponse> => {
  const followService = new FollowService(new AwsDAOFactory());
  const count = await followService.getFolloweeCount(request.token, request.alias);
  return {
    success: true,
    message: null,
    count: count,
  };
});
