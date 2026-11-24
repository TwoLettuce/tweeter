// AI-assisted: see AI-ATTRIBUTION.md
import { ApiErrorResponse } from "tweeter-shared";
import { ApiError } from "../errors/ApiError";

export function withApiErrorHandling<Request, Response>(
  handler: (request: Request) => Promise<Response>,
): (request: Request) => Promise<Response> {
  return async (request) => {
    try {
      return await handler(request);
    } catch (error) {
      console.error("API request failed", error);

      const apiError =
        error instanceof ApiError ? error : new ApiError("INTERNAL_ERROR");
      const errorResponse: ApiErrorResponse = {
        success: false,
        code: apiError.code,
        message: apiError.message,
      };

      throw new Error(JSON.stringify(errorResponse));
    }
  };
}
