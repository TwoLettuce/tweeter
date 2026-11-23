import { StatusDto } from "tweeter-shared";

export interface IStatusDAO {
  createStatus(status: StatusDto): Promise<void>;
  getFeed(
    alias: string,
    pageSize: number,
    lastItem: StatusDto,
  ): Promise<[StatusDto[], boolean]>;
  getStory(
    alias: string,
    pageSize: number,
    lastItem: StatusDto,
  ): Promise<[StatusDto[], boolean]>;
}
