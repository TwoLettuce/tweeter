// AI-assisted: see AI-ATTRIBUTION.md
import { API_ERROR_MESSAGES } from "tweeter-shared";
import type { ApiErrorCode, ApiErrorResponse } from "tweeter-shared";

export class ApiClientError extends Error {
  public constructor(public readonly code: ApiErrorCode) {
    super(API_ERROR_MESSAGES[code]);
    this.name = "ApiClientError";
  }
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const response = value as Partial<ApiErrorResponse>;
  return (
    response.success === false &&
    typeof response.code === "string" &&
    Object.hasOwn(API_ERROR_MESSAGES, response.code) &&
    typeof response.message === "string"
  );
}
