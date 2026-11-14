// AI-assisted: see AI-ATTRIBUTION.md
import {
  AuthToken,
  PagedItemRequest,
  PagedItemResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";
export class ServerFacade {
  private clientCommunicator: ClientCommunicator;
  public constructor() {
    this.clientCommunicator = new ClientCommunicator(
      "https://yhfxfip4o4.execute-api.us-east-2.amazonaws.com/prod",
    );
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    const req: PagedItemRequest<UserDto> = {
      token: token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto,
    };
    const res = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(req, `/followees/${encodeURIComponent(userAlias)}`);

    if (!res.success) {
      throw new Error(res.message ?? "Failed to load followees");
    }

    if (res.items === null) {
      throw new Error("Followees response is missing items");
    }

    return [res.items.map((dto) => User.fromDto(dto)), res.hasMore];
  }
}
