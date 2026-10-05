import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { UserService } from "../../model/service/UserService";

const PAGE_SIZE = 10;

export interface StatusItemView {
  addItems: (newItems: Status[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter {
  private _statusService: StatusService;
  private userService: UserService;
  private _view: StatusItemView;
  private _lastItem: Status | null = null;
  private _hasMore: boolean = true;

  protected constructor(view: StatusItemView) {
    this._statusService = new StatusService();
    this.userService = new UserService();
    this._view = view;
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;

  public getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }

  public reset(): void {
    this._hasMore = true;
    this._lastItem = null;
    this.view.addItems([]);
  }

  public get statusService(): StatusService {
    return this._statusService;
  }
  public get view(): StatusItemView {
    return this._view;
  }
  public set view(value: StatusItemView) {
    this._view = value;
  }
  public get lastItem(): Status | null {
    return this._lastItem;
  }
  public set lastItem(value: Status | null) {
    this._lastItem = value;
  }
  public get hasMore(): boolean {
    return this._hasMore;
  }
  public set hasMore(value: boolean) {
    this._hasMore = value;
  }
}
