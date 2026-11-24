// AI-assisted: see AI-ATTRIBUTION.md
export const API_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Incorrect alias or password.",
  ALIAS_TAKEN: "That alias is already in use.",
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",
  INVALID_INPUT: "Please check the information you entered and try again.",
  NOT_FOUND: "The requested item could not be found.",
  RELATIONSHIP_CONFLICT: "That follow relationship could not be updated.",
  INTERNAL_ERROR: "Something went wrong. Please try again.",
  NETWORK_ERROR:
    "We couldn't connect to the server. Please check your connection and try again.",
  INVALID_RESPONSE: "We couldn't complete that request. Please try again.",
} as const;

export type ApiErrorCode = keyof typeof API_ERROR_MESSAGES;

export type ServerApiErrorCode = Exclude<
  ApiErrorCode,
  "NETWORK_ERROR" | "INVALID_RESPONSE"
>;

export interface ApiErrorResponse {
  readonly success: false;
  readonly code: ApiErrorCode;
  readonly message: string;
}
