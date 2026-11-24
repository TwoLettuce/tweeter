// AI-assisted: see AI-ATTRIBUTION.md
import {
  API_ERROR_MESSAGES,
  ServerApiErrorCode,
} from "tweeter-shared";

export class ApiError extends Error {
  public constructor(public readonly code: ServerApiErrorCode) {
    super(API_ERROR_MESSAGES[code]);
    this.name = "ApiError";
  }
}
