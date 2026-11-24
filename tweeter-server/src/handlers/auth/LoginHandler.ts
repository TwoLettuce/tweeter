// AI-assisted: see AI-ATTRIBUTION.md
import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AwsDAOFactory } from "../../model/dao/factory/AwsDAOFactory";

export const loginHandler = async (
  request: LoginRequest,
): Promise<LoginResponse> => {
  const userService = new UserService(new AwsDAOFactory());
  const [user, authToken] = await userService.login(request.alias, request.password);
  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken,
  };
};
