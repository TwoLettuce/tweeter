// AI-assisted: see AI-ATTRIBUTION.md
import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { AwsDAOFactory } from "../../model/dao/factory/AwsDAOFactory";

export const getFollowersHandler = async (
  request: PagedItemRequest<UserDto>,
): Promise<PagedItemResponse<UserDto>> => {
  const followService = new FollowService(new AwsDAOFactory());
  const [items, hasMore] = await followService.loadMoreFollowers(
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
