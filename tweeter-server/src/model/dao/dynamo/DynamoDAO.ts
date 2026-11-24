// AI-assisted: see AI-ATTRIBUTION.md
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchGetCommand,
  BatchWriteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
} from "@aws-sdk/lib-dynamodb";

const baseClient = new DynamoDBClient({});
export const dynamoClient = DynamoDBDocumentClient.from(baseClient, {
  marshallOptions: { removeUndefinedValues: true },
});

export const tables = {
  users: process.env.USERS_TABLE ?? "Users",
  auth: process.env.AUTH_TABLE ?? "Auth",
  follows: process.env.FOLLOWS_TABLE ?? "Follows",
  followCounts: process.env.FOLLOW_COUNTS_TABLE ?? "FollowCounts",
  statuses: process.env.STATUSES_TABLE ?? "Statuses",
  feeds: process.env.FEEDS_TABLE ?? "Feeds",
  byFolloweeIndex: process.env.BY_FOLLOWEE_INDEX ?? "ByFollowee",
};

export abstract class DynamoDAO {
  protected async getItem<T>(tableName: string, key: Record<string, unknown>): Promise<T | undefined> {
    const result = await dynamoClient.send(
      new GetCommand({ TableName: tableName, Key: key, ConsistentRead: true }),
    );
    return result.Item as T | undefined;
  }

  protected async queryItems<T>(
    input: QueryCommandInput,
    desiredItemCount = Number.POSITIVE_INFINITY,
  ): Promise<{ items: T[]; lastEvaluatedKey?: QueryCommandOutput["LastEvaluatedKey"] }> {
    const items: T[] = [];
    let lastEvaluatedKey = input.ExclusiveStartKey;

    while (items.length < desiredItemCount) {
      const remaining = desiredItemCount - items.length;
      const result = await dynamoClient.send(
        new QueryCommand({
          ...input,
          ExclusiveStartKey: lastEvaluatedKey,
          ...(Number.isFinite(remaining) ? { Limit: remaining } : {}),
        }),
      );
      items.push(...((result.Items ?? []) as T[]));
      lastEvaluatedKey = result.LastEvaluatedKey;
      if (!lastEvaluatedKey) break;
    }

    return { items, lastEvaluatedKey };
  }

  protected async batchGetItems<T>(
    tableName: string,
    keys: Record<string, unknown>[],
  ): Promise<T[]> {
    const results: T[] = [];
    for (let start = 0; start < keys.length; start += 100) {
      let requestItems: Record<string, any> = {
        [tableName]: { Keys: keys.slice(start, start + 100) },
      };
      let attempts = 0;
      while (Object.keys(requestItems).length > 0) {
        const response = await dynamoClient.send(
          new BatchGetCommand({
            RequestItems: {
              ...requestItems,
              [tableName]: { ...requestItems[tableName], ConsistentRead: true },
            },
          }),
        );
        results.push(...((response.Responses?.[tableName] ?? []) as T[]));
        requestItems = response.UnprocessedKeys ?? {};
        if (Object.keys(requestItems).length > 0) {
          if (++attempts > 8) throw new Error("DynamoDB BatchGet retry limit exceeded");
          await new Promise((resolve) => setTimeout(resolve, 25 * 2 ** attempts));
        }
      }
    }
    return results;
  }

  protected async batchPutItems(
    tableName: string,
    items: Record<string, unknown>[],
  ): Promise<void> {
    for (let start = 0; start < items.length; start += 25) {
      let requestItems: Record<string, any> = {
        [tableName]: items.slice(start, start + 25).map((Item) => ({ PutRequest: { Item } })),
      };
      let attempts = 0;
      while (Object.keys(requestItems).length > 0) {
        const response = await dynamoClient.send(
          new BatchWriteCommand({ RequestItems: requestItems }),
        );
        requestItems = response.UnprocessedItems ?? {};
        if (Object.keys(requestItems).length > 0) {
          if (++attempts > 8) throw new Error("DynamoDB BatchWrite retry limit exceeded");
          await new Promise((resolve) => setTimeout(resolve, 25 * 2 ** attempts));
        }
      }
    }
  }
}

export function requirePageSize(pageSize: number): number {
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new Error("bad-request: pageSize must be a positive integer");
  }
  return pageSize;
}

export function queryInputHasMore<T>(
  result: { items: T[]; lastEvaluatedKey?: QueryCommandOutput["LastEvaluatedKey"] },
  pageSize: number,
): boolean {
  return result.items.length > pageSize || result.lastEvaluatedKey != null;
}
