import {
  FakeData,
  PagedUserItemRequest,
  PagedUserItemResponse,
} from "tweeter-shared";

export const followeesGetHandler = async (
  request: PagedUserItemRequest,
): Promise<PagedUserItemResponse> => {
  return FakeData.instance.getPageOfUsers(
    request.lastItem,
    request.pageSize,
    request.userAlias,
  );
};
