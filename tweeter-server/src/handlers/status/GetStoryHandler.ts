// AI-assisted: see AI-ATTRIBUTION.md
import { PagedItemRequest, PagedItemResponse, StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { AwsDAOFactory } from "../../model/dao/factory/AwsDAOFactory";
import { withApiErrorHandling } from "../withApiErrorHandling";

export const getStoryHandler = withApiErrorHandling(async (
  request: PagedItemRequest<StatusDto>,
): Promise<PagedItemResponse<StatusDto>> => {
  const statusService = new StatusService(new AwsDAOFactory());
  const [items, hasMore] = await statusService.loadMoreStoryItems(
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
