import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { UserService } from "../../model/service/UserService";
import { Presenter, View } from "../Presenter";

export interface StatusItemView extends View {
  addItems: (newItems: Status[]) => void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
  private _statusService: StatusService;
  private userService: UserService;
  private _lastItem: Status | null = null;
  private _hasMore: boolean = true;

  protected constructor(view: StatusItemView) {
    super(view);
    this._statusService = new StatusService();
    this.userService = new UserService();
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
