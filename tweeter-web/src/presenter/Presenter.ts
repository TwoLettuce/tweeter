// AI-assisted: see AI-ATTRIBUTION.md
import { API_ERROR_MESSAGES } from "tweeter-shared";
import { ApiClientError } from "../net/ApiClientError";

export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string | undefined,
  ) => string;
  deleteMessage: (messageID: string) => void;
}
export abstract class Presenter<T extends View> {
  _view: T;

  protected constructor(view: T) {
    this._view = view;
  }

  protected async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string,
  ) {
    try {
      await operation();
    } catch (error) {
      this._view.displayErrorMessage(this.getUserFacingErrorMessage(error));
    }
  }

  protected getUserFacingErrorMessage(error: unknown): string {
    return error instanceof ApiClientError
      ? error.message
      : API_ERROR_MESSAGES.INTERNAL_ERROR;
  }

  public get view() {
    return this._view;
  }
  public set view(value: T) {
    this._view = value;
  }
}
