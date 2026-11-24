// AI-assisted: see AI-ATTRIBUTION.md
import { createHash } from "node:crypto";
import { StatusDto } from "tweeter-shared";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { IStatusDAO } from "./IStatusDAO";
import {
  DynamoDAO,
  dynamoClient,
  queryInputHasMore,
  requirePageSize,
  tables,
} from "../dynamo/DynamoDAO";

interface StatusItem {
  authorAlias: string;
  recipientAlias?: string;
  statusKey: string;
  statusId: string;
  timestamp: number;
  post: string;
  user: StatusDto["user"];
}

function statusId(status: StatusDto): string {
  return createHash("sha256")
    .update(`${status.user.alias}\0${status.timestamp}\0${status.post}`)
    .digest("hex");
}

function statusKey(status: StatusDto, id = statusId(status)): string {
  if (!Number.isSafeInteger(status.timestamp) || status.timestamp < 0) {
    throw new Error(
      "bad-request: Status timestamp must be a non-negative integer",
    );
  }
  return `${String(status.timestamp).padStart(16, "0")}#${id}`;
}

function toStatusDto(item: StatusItem): StatusDto {
  return { post: item.post, user: item.user, timestamp: item.timestamp };
}

export class DynamoStatusDAO extends DynamoDAO implements IStatusDAO {
  public async createStatus(status: StatusDto): Promise<void> {
    await dynamoClient.send(
      new PutCommand({
        TableName: tables.statuses,
        Item: this.toItem(status),
      }),
    );
  }

  public async postToStory(status: StatusDto): Promise<void> {
    await this.createStatus(status);
  }

  public async postToFeeds(status: StatusDto): Promise<void> {
    const queryInput = {
      TableName: tables.follows,
      IndexName: tables.byFolloweeIndex,
      KeyConditionExpression: "followeeAlias = :alias",
      ExpressionAttributeValues: { ":alias": status.user.alias },
      ProjectionExpression: "followerAlias",
      Limit: 100,
    };

    let lastKey: Record<string, unknown> | undefined;
    do {
      const result = await dynamoClient.send(
        new QueryCommand({ ...queryInput, ExclusiveStartKey: lastKey }),
      );
      const followers = result.Items ?? [];
      await this.batchPutItems(
        tables.feeds,
        followers.map(({ followerAlias }) => ({
          ...this.toItem(status),
          recipientAlias: followerAlias,
        })),
      );
      lastKey = result.LastEvaluatedKey;
    } while (lastKey);
  }

  public async getFeed(
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    return this.getStatusPage(
      tables.feeds,
      "recipientAlias",
      alias,
      pageSize,
      lastItem,
    );
  }

  public async getStory(
    alias: string,
    pageSize: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    return this.getStatusPage(
      tables.statuses,
      "authorAlias",
      alias,
      pageSize,
      lastItem,
    );
  }

  private async getStatusPage(
    tableName: string,
    partitionKey: "recipientAlias" | "authorAlias",
    alias: string,
    pageSizeValue: number,
    lastItem: StatusDto | null,
  ): Promise<[StatusDto[], boolean]> {
    const pageSize = requirePageSize(pageSizeValue);
    const result = await this.queryItems<StatusItem>(
      {
        TableName: tableName,
        KeyConditionExpression: "#partition = :alias",
        ExpressionAttributeNames: { "#partition": partitionKey },
        ExpressionAttributeValues: { ":alias": alias },
        ScanIndexForward: false,
        ConsistentRead: true,
        ...(lastItem
          ? {
              ExclusiveStartKey: {
                [partitionKey]: alias,
                statusKey: statusKey(lastItem),
              },
            }
          : {}),
      },
      pageSize + 1,
    );

    return [
      result.items.slice(0, pageSize).map(toStatusDto),
      queryInputHasMore(result, pageSize),
    ];
  }

  private toItem(status: StatusDto): StatusItem {
    const id = statusId(status);
    return {
      authorAlias: status.user.alias,
      statusKey: statusKey(status, id),
      statusId: id,
      timestamp: status.timestamp,
      post: status.post,
      user: status.user,
    };
  }
}
