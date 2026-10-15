import { useEffect, useRef, useState } from "react";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHook";
import { useUserInfoActions } from "../userInfo/UserInfoActionsHook";
import { useParams } from "react-router-dom";
import {
  PagedItemPresenter,
  PagedItemView,
} from "../../presenter/paged/PagedItemPresenter";
import { User } from "tweeter-shared";
import InfiniteScroll from "react-infinite-scroll-component";
import { Service } from "../../model/service/Service";

interface Props<T> {
  featureUrl: string;
  presenterFactory: (
    listener: PagedItemView<T>,
  ) => PagedItemPresenter<T, Service>;
  itemComponentFactory: (item: T, featurePath: string) => JSX.Element;
}

function ItemScroller<T>(props: Props<T>): JSX.Element {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<T[]>([]);
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const presenterRef = useRef<PagedItemPresenter<T, Service> | null>(null);
  if (!presenterRef.current) {
    const listener: PagedItemView<T> = {
      addItems: (newItems: T[]) =>
        setItems((previousItems) => [...previousItems, ...newItems]),
      displayErrorMessage: displayErrorMessage,
    };
    presenterRef.current = props.presenterFactory(listener);
  }
  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      presenterRef
        .current!.getUser(authToken!, displayedUserAliasParam!)
        .then((toUser: User | null) => {
          if (toUser) {
            setDisplayedUser(toUser);
          }
        });
    }
  }, [displayedUserAliasParam]);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []);
    presenterRef.current!.reset();
  };

  const loadMoreItems = async () => {
    presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenterRef.current!.hasMore}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            {props.itemComponentFactory(item, props.featureUrl)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default ItemScroller;
