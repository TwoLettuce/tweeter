// AI-assisted: see AI-ATTRIBUTION.md
import { UserDto } from "tweeter-shared";
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { IFollowDAO } from "./IFollowDAO";
import { ApiError } from "../../../errors/ApiError";
import {
  DynamoDAO,
  dynamoClient,
  queryInputHasMore,
  requirePageSize,
  tables,
} from "../dynamo/DynamoDAO";

interface FollowItem {
  followerAlias: string;
  followeeAlias: string;
}

interface UserItem extends UserDto {
  passwordHash?: string;
}

interface FollowCountItem {
  alias: string;
  followerCount: number;
  followeeCount: number;
}

export class DynamoFollowDAO extends DynamoDAO implements IFollowDAO {
  public async getFollowees(
    alias: string,
    pageSizeValue: number,
    lastFollowee: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    const pageSize = requirePageSize(pageSizeValue);
    const result = await this.queryItems<FollowItem>(
      {
        TableName: tables.follows,
        KeyConditionExpression: "followerAlias = :alias",
        ExpressionAttributeValues: { ":alias": alias },
        ConsistentRead: true,
        ...(lastFollowee
          ? {
              ExclusiveStartKey: {
                followerAlias: alias,
                followeeAlias: lastFollowee.alias,
              },
            }
          : {}),
      },
      pageSize + 1,
    );

    const relationships = result.items.slice(0, pageSize);
    const users = await this.getUsersInRelationshipOrder(
      relationships.map((relationship) => relationship.followeeAlias),
    );
    return [users, queryInputHasMore(result, pageSize)];
  }

  public async getFollowers(
    alias: string,
    pageSizeValue: number,
    lastFollower: UserDto | null,
  ): Promise<[UserDto[], boolean]> {
    const pageSize = requirePageSize(pageSizeValue);
    const result = await this.queryItems<FollowItem>(
      {
        TableName: tables.follows,
        IndexName: tables.byFolloweeIndex,
        KeyConditionExpression: "followeeAlias = :alias",
        ExpressionAttributeValues: { ":alias": alias },
        ...(lastFollower
          ? {
              ExclusiveStartKey: {
                followeeAlias: alias,
                followerAlias: lastFollower.alias,
              },
            }
          : {}),
      },
      pageSize + 1,
    );

    const relationships = result.items.slice(0, pageSize);
    const users = await this.getUsersInRelationshipOrder(
      relationships.map((relationship) => relationship.followerAlias),
    );
    return [users, queryInputHasMore(result, pageSize)];
  }

  public async isFollower(
    followerAlias: string,
    followeeAlias: string,
  ): Promise<boolean> {
    return (
      (await this.getItem<FollowItem>(tables.follows, {
        followerAlias,
        followeeAlias,
      })) != null
    );
  }

  public async getFollowerCount(alias: string): Promise<number> {
    return (await this.getCountItem(alias))?.followerCount ?? 0;
  }

  public async getFolloweeCount(alias: string): Promise<number> {
    return (await this.getCountItem(alias))?.followeeCount ?? 0;
  }

  public async follow(
    follower: UserDto,
    userToFollow: UserDto,
  ): Promise<[number, number]> {
    return this.changeFollow(follower.alias, userToFollow.alias, true);
  }

  public async unfollow(
    follower: UserDto,
    userToUnfollow: UserDto,
  ): Promise<[number, number]> {
    return this.changeFollow(follower.alias, userToUnfollow.alias, false);
  }

  private async changeFollow(
    followerAlias: string,
    followeeAlias: string,
    shouldFollow: boolean,
  ): Promise<[number, number]> {
    if (followerAlias === followeeAlias) {
      throw new ApiError("INVALID_INPUT");
    }

    const countDelta = shouldFollow ? 1 : -1;
    try {
      await dynamoClient.send(
        new TransactWriteCommand({
          TransactItems: [
            shouldFollow
              ? {
                  Put: {
                    TableName: tables.follows,
                    Item: { followerAlias, followeeAlias },
                    ConditionExpression:
                      "attribute_not_exists(followerAlias) AND attribute_not_exists(followeeAlias)",
                  },
                }
              : {
                  Delete: {
                    TableName: tables.follows,
                    Key: { followerAlias, followeeAlias },
                    ConditionExpression: "attribute_exists(followerAlias)",
                  },
                },
            {
              Update: {
                TableName: tables.followCounts,
                Key: { alias: followerAlias },
                UpdateExpression: "ADD followeeCount :delta",
                ConditionExpression:
                  shouldFollow
                    ? "attribute_exists(alias) AND attribute_exists(followeeCount)"
                    : "attribute_exists(alias) AND followeeCount >= :one",
                ExpressionAttributeValues: {
                  ":delta": countDelta,
                  ...(shouldFollow ? {} : { ":one": 1 }),
                },
              },
            },
            {
              Update: {
                TableName: tables.followCounts,
                Key: { alias: followeeAlias },
                UpdateExpression: "ADD followerCount :delta",
                ConditionExpression:
                  shouldFollow
                    ? "attribute_exists(alias) AND attribute_exists(followerCount)"
                    : "attribute_exists(alias) AND followerCount >= :one",
                ExpressionAttributeValues: {
                  ":delta": countDelta,
                  ...(shouldFollow ? {} : { ":one": 1 }),
                },
              },
            },
          ],
        }),
      );
    } catch (error) {
      if ((error as { name?: string }).name !== "TransactionCanceledException") {
        throw error;
      }
      const relationshipExists = await this.isFollower(followerAlias, followeeAlias);
      if (relationshipExists === shouldFollow) {
        return this.getCountsForUser(followeeAlias);
      }
      throw error;
    }

    return this.getCountsForUser(followeeAlias);
  }

  private async getCountItem(alias: string): Promise<FollowCountItem | undefined> {
    return this.getItem<FollowCountItem>(tables.followCounts, { alias });
  }

  private async getCountsForUser(alias: string): Promise<[number, number]> {
    const item = await this.getCountItem(alias);
    return [item?.followerCount ?? 0, item?.followeeCount ?? 0];
  }

  private async getUsersInRelationshipOrder(aliases: string[]): Promise<UserDto[]> {
    if (aliases.length === 0) return [];
    const users = await this.batchGetItems<UserItem>(
      tables.users,
      aliases.map((alias) => ({ alias })),
    );
    const usersByAlias = new Map(users.map((user) => [user.alias, user]));
    return aliases
      .map((alias) => usersByAlias.get(alias))
      .filter((user): user is UserItem => user !== undefined)
      .map(({ firstName, lastName, alias, imageUrl }) => ({
        firstName,
        lastName,
        alias,
        imageUrl,
      }));
  }
}
