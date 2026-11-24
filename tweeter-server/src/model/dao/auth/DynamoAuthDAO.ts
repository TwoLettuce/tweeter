// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken } from "tweeter-shared";
import { DeleteCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { AuthDataDto } from "../../domain/AuthData";
import { IAuthDAO } from "./IAuthDAO";
import { DynamoDAO, dynamoClient, tables } from "../dynamo/DynamoDAO";

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;

interface AuthItem {
  token: string;
  alias: string;
  timestamp: number;
  lastActivityAt: number;
  expiresAt: number;
}

export class DynamoAuthDAO extends DynamoDAO implements IAuthDAO {
  public async getAuth(token: string): Promise<AuthDataDto | null> {
    for (let attempt = 0; attempt < 2; attempt++) {
      const item = await this.getItem<AuthItem>(tables.auth, { token });
      if (!item) return null;

      const now = Date.now();
      if (
        !Number.isFinite(item.lastActivityAt) ||
        now - item.lastActivityAt >= INACTIVITY_TIMEOUT_MS
      ) {
        return null;
      }

      const expiresAt = Math.ceil((now + INACTIVITY_TIMEOUT_MS) / 1000);
      try {
        await dynamoClient.send(
          new UpdateCommand({
            TableName: tables.auth,
            Key: { token },
            UpdateExpression: "SET lastActivityAt = :now, expiresAt = :expiresAt",
            ConditionExpression:
              "lastActivityAt = :observed AND lastActivityAt > :cutoff",
            ExpressionAttributeValues: {
              ":now": now,
              ":expiresAt": expiresAt,
              ":observed": item.lastActivityAt,
              ":cutoff": now - INACTIVITY_TIMEOUT_MS,
            },
          }),
        );
        return {
          alias: item.alias,
          token: { token: item.token, timestamp: item.timestamp },
        };
      } catch (error) {
        if ((error as { name?: string }).name !== "ConditionalCheckFailedException") {
          throw error;
        }
      }
    }
    return null;
  }

  public async createAuth(alias: string) {
    const generated = AuthToken.Generate().dto;
    const now = Date.now();
    await dynamoClient.send(
      new PutCommand({
        TableName: tables.auth,
        Item: {
          token: generated.token,
          alias,
          timestamp: generated.timestamp,
          lastActivityAt: now,
          expiresAt: Math.ceil((now + INACTIVITY_TIMEOUT_MS) / 1000),
        },
        ConditionExpression: "attribute_not_exists(token)",
      }),
    );
    return generated;
  }

  public async deleteAuth(token: string): Promise<void> {
    await dynamoClient.send(new DeleteCommand({ TableName: tables.auth, Key: { token } }));
  }
}
