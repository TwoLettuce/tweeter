// AI-assisted: see AI-ATTRIBUTION.md
import { CountRequest, CountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const getFolloweeCountHandler = async (
  request: CountRequest,
): Promise<CountResponse> => {
  const followService = new FollowService();
  const count = await followService.getFolloweeCount(request.token, request.alias);
  return {
    success: true,
    message: null,
    count: count,
  };
};
