import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { FollowService } from "../../model/service/FollowService";
import { Presenter, View } from "../Presenter";

export interface UserItemView extends View {
  addItems: (newItems: User[]) => void;
}

export abstract class UserItemPresenter extends Presenter<UserItemView> {
  private _followService: FollowService;
  private userService: UserService;
  private _lastItem: User | null = null;
  private _hasMoreItems = true;

  protected constructor(view: UserItemView) {
    super(view);
    this._followService = new FollowService();
    this.userService = new UserService();
  }

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return this.userService.getUser(authToken, alias);
  }

  abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;

  public reset(): void {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  protected get followService(): FollowService {
    return this._followService;
  }
  protected get lastItem() {
    return this._lastItem;
  }
  protected set lastItem(value: User | null) {
    this._lastItem = value;
  }
  public get _view(): UserItemView {
    return this._view;
  }
  public set _view(value: UserItemView) {
    this._view = value;
  }
  public get hasMoreItems() {
    return this._hasMoreItems;
  }
  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }
}
