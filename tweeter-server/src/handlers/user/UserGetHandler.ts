// AI-assisted: see AI-ATTRIBUTION.md
import { UserRequest, UserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const userGetHandler = async (
  request: UserRequest,
): Promise<UserResponse> => {
  const userService = new UserService();
  const user = await userService.getUser(request.token, request.alias);
  return {
    success: true,
    message: null,
    user: user,
  };
};
