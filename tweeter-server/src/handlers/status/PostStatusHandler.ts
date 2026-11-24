// AI-assisted: see AI-ATTRIBUTION.md
import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { AwsDAOFactory } from "../../model/dao/factory/AwsDAOFactory";

export const postStatusHandler = async (
  request: PostStatusRequest,
): Promise<TweeterResponse> => {
  const statusService = new StatusService(new AwsDAOFactory());
  await statusService.postStatus(request.token, request.newStatus);
  return {
    success: true,
    message: null,
  };
};
