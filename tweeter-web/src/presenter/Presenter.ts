export interface View {
  displayErrorMessage: (message: string) => void;
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
      this._view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`,
      );
    }
  }

  public get view() {
    return this._view;
  }
  public set view(value: T) {
    this._view = value;
  }
}
