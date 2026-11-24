# DynamoDB data access design

This design follows the current DAO interfaces in this directory and the server services that call them. It uses DynamoDB for application records and S3 for profile-image bytes. The required feed behavior is implemented by writing a feed entry for each follower when a status is posted.

## Tables and indexes

| Resource                   | Partition key             | Sort key                 | Purpose                                                              |
| -------------------------- | ------------------------- | ------------------------ | -------------------------------------------------------------------- |
| `Users`                    | `alias` (String)          | —                        | User profile and credential record.                                  |
| `Auth`                     | `token` (String)          | —                        | Maps a session token to its alias and tracks its inactivity timeout. |
| `Follows`                  | `followerAlias` (String)  | `followeeAlias` (String) | Lists followees and checks whether one user follows another.         |
| `Follows` GSI `ByFollowee` | `followeeAlias` (String)  | `followerAlias` (String) | Lists followers.                                                     |
| `FollowCounts`             | `alias` (String)          | —                        | Stores one user's `followerCount` and `followeeCount` counters.      |
| `Statuses`                 | `authorAlias` (String)    | `statusKey` (String)     | Canonical status records, queried as an author's story.              |
| `Feeds`                    | `recipientAlias` (String) | `statusKey` (String)     | Precomputed entries for each recipient's feed.                       |

The `Follows` base key order supports followee listing. Its `ByFollowee` global secondary index reverses the key order for follower listing. A follow operation writes one relationship item; DynamoDB maintains the index. GSI queries are eventually consistent, so a just-created or deleted follow may briefly not appear in a follower-list query. If immediate consistency for both directions is required, use two relationship tables and write both entries transactionally instead.

## Item attributes

### `Users`

| Attribute      | Type   | Notes                                                                 |
| -------------- | ------ | --------------------------------------------------------------------- |
| `alias`        | String | Partition key; unique account identifier.                             |
| `firstName`    | String | Returned in `UserDto`.                                                |
| `lastName`     | String | Returned in `UserDto`.                                                |
| `passwordHash` | String | Salted password hash; never return this from `getUser`.               |
| `imageUrl`     | String | Stable S3 object URL or application URL for the user's profile image. |

`getUserWithPassword` can read the credential record and return the hash for password verification. Do not store a plaintext `password` attribute.

`DynamoUserDAO` stores passwords as bcrypt hashes through the password-encryptor interface, and `UserService.login` verifies the supplied password before creating a persisted auth token. Creating a user and its zeroed follow-counter item uses one DynamoDB transaction so follow operations always have counter rows to update.

### `Auth`

| Attribute        | Type   | Notes                                                                                       |
| ---------------- | ------ | ------------------------------------------------------------------------------------------- |
| `token`          | String | Partition key; generated session token.                                                     |
| `alias`          | String | User authenticated by this token.                                                           |
| `timestamp`      | Number | Token creation time in milliseconds, matching `AuthTokenDto.timestamp`.                     |
| `lastActivityAt` | Number | Time of the most recent successful authenticated request, in milliseconds since Unix epoch. |
| `expiresAt`      | Number | `lastActivityAt` plus five minutes, stored as Unix epoch seconds for DynamoDB TTL.          |

Auth tokens expire after **five minutes of inactivity**. `createAuth` initializes `lastActivityAt` to the current time and sets `expiresAt` five minutes later. On every authenticated request, `getAuth` must check whether five minutes have elapsed since `lastActivityAt`; if so, return no auth data and do not refresh the token. If the token is still active, update `lastActivityAt` and `expiresAt` before returning the auth data. This makes activity extend the session while an idle token expires.

The expiry check is authoritative; DynamoDB TTL is only cleanup because deletion is asynchronous. Compare timestamps at millisecond precision for the five-minute rule, while `expiresAt` uses epoch seconds as required by TTL. `AuthTokenDto.timestamp` remains the token's creation timestamp and should not be repurposed as the last-activity timestamp. The current `IAuthDAO.getAuth` signature can keep this behavior inside the DAO without changing its return type.

### `Follows`

| Attribute       | Type   | Notes                     |
| --------------- | ------ | ------------------------- |
| `followerAlias` | String | Base-table partition key. |
| `followeeAlias` | String | Base-table sort key.      |

Use aliases in relationship records rather than embedding full `UserDto` values. Resolve user details when returning `UserDto[]` from `getFollowees` or `getFollowers`. The pair of key attributes also makes a follow idempotent when written conditionally and gives `getIsFollowerStatus` a direct key lookup.

`ByFollowee` uses `followeeAlias` as its partition key and `followerAlias` as its sort key. The GSI must project the aliases needed to fetch the related users; `ALL` is simplest, while `KEYS_ONLY` reduces index storage if the DAO always fetches user profiles separately.

`isFollower(followerAlias, followeeAlias)` is a direct `GetItem` on the `Follows` base table using both key values. It does not load a follower page or depend on object identity.

### `FollowCounts`

| Attribute       | Type   | Notes                                        |
| --------------- | ------ | -------------------------------------------- |
| `alias`         | String | Partition key; user whose counts are stored. |
| `followerCount` | Number | Number of users following this user.         |
| `followeeCount` | Number | Number of users this user follows.           |

Initialize both counters to zero when creating a user. `getFollowerCount` and `getFolloweeCount` read these counters directly; they do not retrieve relationship pages. `follow` and `unfollow` must change the relationship item and both affected users' counters atomically. Use a transaction with a condition on the relationship item's existence so a repeated follow or unfollow does not increment or decrement counters twice. A follow from A to B increments A's `followeeCount` and B's `followerCount`; unfollow decrements those same counters. The methods return the target user's `[followerCount, followeeCount]` after the operation, matching the existing service response behavior.

### `Statuses`

| Attribute     | Type   | Notes                                                                                                             |
| ------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| `authorAlias` | String | Partition key.                                                                                                    |
| `statusKey`   | String | Sort key formed from a fixed-width, sortable timestamp and a unique status ID, for example `0001730000000000#id`. |
| `statusId`    | String | SHA-256 identifier derived from author alias, timestamp, and post text.                                           |
| `timestamp`   | Number | Milliseconds since Unix epoch, matching `StatusDto.timestamp`.                                                    |
| `post`        | String | Status text.                                                                                                      |
| `user`        | Map    | Snapshot of the author fields needed to reconstruct `StatusDto`, including alias and image URL.                   |

Each status is stored as an individual item. Query `Statuses` by `authorAlias`, in descending `statusKey` order, to implement `getStory`. The implementation derives `statusId` from the author alias, timestamp, and post text so the current `StatusDto` cursor can reconstruct the complete key. This distinguishes different posts with the same timestamp; an identical author, timestamp, and post is treated as the same status on retry. Format the timestamp consistently so string sort order matches chronological order.

`createStatus` writes the canonical status item, and `postToStory` delegates to it. `StatusService.postStatus` writes the story first and then fans out feed entries, so a failed fan-out can be retried without duplicating the story item.

### `Feeds`

| Attribute        | Type   | Notes                                                                 |
| ---------------- | ------ | --------------------------------------------------------------------- |
| `recipientAlias` | String | Partition key; owner of this feed entry.                              |
| `statusKey`      | String | Same sortable timestamp plus status ID used for the canonical status. |
| `authorAlias`    | String | Author of the status.                                                 |
| `timestamp`      | Number | Status timestamp.                                                     |
| `post`           | String | Status text.                                                          |
| `user`           | Map    | User snapshot needed to reconstruct `StatusDto`.                      |

When a user posts, query their followers and write one `Feeds` item per follower. Then `getFeed` queries by `recipientAlias` in descending `statusKey` order and returns a page. This makes feed reads a single-partition query rather than a runtime merge across followed users. Store enough data in each entry to return a `StatusDto` without querying every followed user's story. The denormalized author snapshot can be stale if profile data changes; stable image URLs and fetching current profiles during response assembly are alternatives if that matters.

Feed fan-out can require many writes for an account with many followers. Design `postToFeeds` to batch writes and handle partial failures or retries; DynamoDB batch writes can leave unprocessed items that must be retried. Decide whether `follow` should backfill recent statuses from the new followee into the follower's feed. Without backfill, the follower sees only statuses posted after the follow.

## Paging and DAO mapping

The relevant DAO methods map to these key queries:

| DAO method                                                       | DynamoDB operation                                                                                                             |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `IAuthDAO.getAuth(token)`                                        | Read by `token`, reject if idle for five minutes, otherwise refresh `lastActivityAt` and `expiresAt` and return auth data.     |
| `IAuthDAO.createAuth(alias)`                                     | Put `Auth` item with new token, creation timestamp, initial `lastActivityAt`, and five-minute `expiresAt`.                     |
| `IAuthDAO.deleteAuth(token)`                                     | Delete `Auth` item by `token`.                                                                                                 |
| `IUserDAO.getUser(alias)`                                        | Get `Users` item by `alias`, excluding credential fields.                                                                      |
| `IUserDAO.getUserWithPassword(alias)`                            | Get `Users` item by `alias` and return credentials for verification.                                                           |
| `IFollowDAO.getFollowees(alias, ...)`                            | Query `Follows` by `followerAlias`.                                                                                            |
| `IFollowDAO.getFollowers(alias, ...)`                            | Query `ByFollowee` by `followeeAlias`.                                                                                         |
| `IFollowDAO.isFollower(followerAlias, followeeAlias)`            | Get `Follows` item by both key values.                                                                                         |
| `IFollowDAO.getFollowerCount(alias)` / `getFolloweeCount(alias)` | Get the user's `FollowCounts` item and return the corresponding counter.                                                       |
| `IFollowDAO.follow` / `unfollow`                                 | Transactionally put/delete the relationship and update both affected users' counters; return the target user's updated counts. |
| `IStatusDAO.getStory(alias, ...)`                                | Query `Statuses` by `authorAlias`.                                                                                             |
| `IStatusDAO.getFeed(alias, ...)`                                 | Query `Feeds` by `recipientAlias`.                                                                                             |
| `IStatusDAO.postToStory` / `createStatus`                        | Write the canonical status in `Statuses`; `postToStory` delegates to `createStatus`.                                           |
| `IStatusDAO.postToFeeds(status)`                                 | Fan out a feed entry to the author's followers.                                                                                |
| `IUserImageDAO.putUserImage(...)`                                | Decode the supplied image and put the object in S3.                                                                            |
| `IUserImageDAO.getUserImage(alias)`                              | Get the S3 object if the application needs image bytes; otherwise return/use the stored image URL.                             |

Use DynamoDB `Query` pagination with `LastEvaluatedKey` as the continuation cursor. The current DAO accepts a `StatusDto` or `UserDto` as the last item; that can identify the last key, but an opaque cursor carrying the actual DynamoDB key is safer and avoids relying on mutable DTO fields. Ensure `hasMore` is based on whether another matching item exists, not merely whether DynamoDB returned a `LastEvaluatedKey` at a 1 MB boundary.

## Counts and consistency choices

Follower and followee counts use `FollowCounts` records, while paged list methods remain dedicated to listing users. The service uses direct DAO count and relationship lookups; it does not call list methods with a zero page size or compare returned user objects by identity.

## S3 profile images

Store image bytes in a private S3 bucket at `profile-images/<sha256-of-alias>`. Validate allowed file types and set the object's content type and extension metadata. The SAM template creates a CloudFront distribution with Origin Access Control for the bucket, and `Users.imageUrl` is the distribution URL followed by the object key. The bucket blocks public access. If replacing an image at the same key, account for caching and the fact that an upload to an existing key replaces that object.

`register` creates the user and counters transactionally, then uploads the image and creates auth. S3 and DynamoDB cannot share a transaction, so a failed image upload can leave a user without an image; handle cleanup or retries for this partial failure.

## Design notes

- DynamoDB partition keys must match the access patterns. The `Follows` GSI is what enables the reverse follower lookup; a sort key alone cannot query by its value without the partition key.
- Individual story/feed items make timestamp ordering and page reads practical. Do not store an ever-growing `StatusDto[]` in one user item.
- Feed materialization trades more writes and storage for fast reads, which matches the stated requirement. Fan-out should be retryable because one status can have many feed writes.
- Keep auth and password data private, and return only the fields in `UserDto` from normal user reads.
