// AI-assisted: see AI-ATTRIBUTION.md
import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const getFolloweesHandler = async (
  request: PagedItemRequest<UserDto>,
): Promise<PagedItemResponse<UserDto>> => {
  const followService = new FollowService();
  const [items, hasMore] = await followService.loadMoreFollowees(
    request.token,
    request.userAlias,
    request.pageSize,
    request.lastItem,
  );
  return {
    success: true,
    message: undefined,
    items: items,
    hasMore: hasMore,
  };
};
