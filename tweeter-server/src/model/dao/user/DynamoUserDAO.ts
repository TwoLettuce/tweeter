// AI-assisted: see AI-ATTRIBUTION.md
import { CredentialsDto, UserDto } from "tweeter-shared";
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { IUserDAO } from "./IUserDAO";
import { hashPassword } from "./PasswordHash";
import { DynamoDAO, dynamoClient, tables } from "../dynamo/DynamoDAO";
import { userImageUrl } from "../s3/UserImageSupport";

interface UserItem extends UserDto {
  passwordHash: string;
}

export class DynamoUserDAO extends DynamoDAO implements IUserDAO {
  public async getUser(alias: string): Promise<UserDto | null> {
    const item = await this.getItem<UserItem>(tables.users, { alias });
    return item ? this.toUserDto(item) : null;
  }

  public async createUser(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
  ): Promise<UserDto> {
    const user: UserItem = {
      firstName,
      lastName,
      alias,
      passwordHash: await hashPassword(password),
      imageUrl: userImageUrl(alias),
    };
    try {
      await dynamoClient.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: tables.users,
                Item: user,
                ConditionExpression: "attribute_not_exists(alias)",
              },
            },
            {
              Put: {
                TableName: tables.followCounts,
                Item: { alias, followerCount: 0, followeeCount: 0 },
                ConditionExpression: "attribute_not_exists(alias)",
              },
            },
          ],
        }),
      );
    } catch (error) {
      if ((error as { name: string }).name === "TransactionCanceledException") {
        if (await this.getUser(alias))
          throw new Error("bad-request: Alias already taken");
      }
      throw error;
    }
    return this.toUserDto(user);
  }

  public async getUserWithPassword(
    alias: string,
  ): Promise<CredentialsDto | null> {
    const item = await this.getItem<UserItem>(tables.users, { alias });
    if (!item) return null;
    return { ...this.toUserDto(item), password: item.passwordHash };
  }

  private toUserDto(item: UserDto): UserDto {
    return {
      firstName: item.firstName,
      lastName: item.lastName,
      alias: item.alias,
      imageUrl: item.imageUrl,
    };
  }
}
