// AI-assisted: see AI-ATTRIBUTION.md
import { UserRequest, UserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AwsDAOFactory } from "../../model/dao/factory/AwsDAOFactory";
import { withApiErrorHandling } from "../withApiErrorHandling";

export const getUserHandler = withApiErrorHandling(async (
  request: UserRequest,
): Promise<UserResponse> => {
  const userService = new UserService(new AwsDAOFactory());
  const user = await userService.getUser(request.token, request.alias);
  return {
    success: true,
    message: null,
    user: user,
  };
});
