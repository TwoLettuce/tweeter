import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { Presenter, View } from "../Presenter";
import { Service } from "../../model/service/Service";

export interface PagedItemView<T> extends View {
  addItems: (newItems: T[]) => void;
}

export abstract class PagedItemPresenter<
  U,
  V extends Service,
> extends Presenter<PagedItemView<U>> {
  private _PAGE_SIZE = 10;
  private userService: UserService = new UserService();
  private _lastItem: U | null = null;
  private _hasMore = true;

  public constructor(view: PagedItemView<U>) {
    super(view);
  }

  protected abstract serviceFactory(): V;

  protected abstract getItemDescription(): string;

  protected abstract getMoreItems(
    authToken: AuthToken,
    alias: string,
  ): Promise<[U[], boolean]>;

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);

      this.hasMore = hasMore;
      this.lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this._view.addItems(newItems);
    }, this.getItemDescription());
  }

  public getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }

  public reset(): void {
    this._hasMore = true;
    this._lastItem = null;
    this.view.addItems([]);
  }

  protected get lastItem(): U | null {
    return this._lastItem;
  }
  protected set lastItem(value: U | null) {
    this._lastItem = value;
  }
  public get hasMore(): boolean {
    return this._hasMore;
  }
  public set hasMore(value: boolean) {
    this._hasMore = value;
  }
  protected get PAGE_SIZE() {
    return this._PAGE_SIZE;
  }
}
