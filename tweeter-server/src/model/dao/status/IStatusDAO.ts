import { StatusDto } from "tweeter-shared";

export interface IStatusDAO {
  postToFeeds(status: StatusDto): Promise<void>;
  backfillFeed(followerAlias: string, followeeAlias: string): Promise<void>;
  postToStory(status: StatusDto): Promise<void>;
  createStatus(status: StatusDto): Promise<void>;
  getFeed(
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]>;
  getStory(
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]>;
}
