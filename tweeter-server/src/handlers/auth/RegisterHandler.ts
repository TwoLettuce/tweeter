// AI-assisted: see AI-ATTRIBUTION.md
import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const registerHandler = async (
  request: RegisterRequest,
): Promise<RegisterResponse> => {
  const userService = new UserService();
  const [user, authToken] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.userImageBytes,
    request.imageFileExtension,
  );
  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken,
  };
};
