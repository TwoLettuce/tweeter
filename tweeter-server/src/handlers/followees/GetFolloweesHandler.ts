// AI-assisted: see AI-ATTRIBUTION.md
import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AwsDAOFactory } from "../../model/dao/factory/AwsDAOFactory";
import { withApiErrorHandling } from "../withApiErrorHandling";

export const getFolloweesHandler = withApiErrorHandling(async (
  request: PagedItemRequest<UserDto>,
): Promise<PagedItemResponse<UserDto>> => {
  const followService = new FollowService(new AwsDAOFactory());
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
});
