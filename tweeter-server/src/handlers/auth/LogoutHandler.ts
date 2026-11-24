// AI-assisted: see AI-ATTRIBUTION.md
import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AwsDAOFactory } from "../../model/dao/factory/AwsDAOFactory";

export const logoutHandler = async (
  request: LogoutRequest,
): Promise<TweeterResponse> => {
  const userService = new UserService(new AwsDAOFactory());
  await userService.logout(request.token);
  return {
    success: true,
    message: null,
  };
};
