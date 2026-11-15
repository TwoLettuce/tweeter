## Endpoints

All endpoint responses include `success: boolean` and `message: string | null`. Error responses use the same error format configured in `template.yaml`.

### Login

Request:

```http
Method: POST
Path: /login
Body: {
  alias: string,
  password: string
}
```

Handler: [LoginHandler](./src/handlers/auth/LoginHandler.ts)

The frontend service builds `LoginRequest`. The facade sends it to the server and converts the returned user and token DTOs into `User` and `AuthToken` objects.

The backend currently preserves the original FakeData login behavior: it returns the first fake user and a newly generated auth token. It does not validate the supplied alias or password yet.

Response:

```json
{
  "success": true,
  "message": null,
  "user": { "firstName": "string", "lastName": "string", "alias": "string", "imageUrl": "string" },
  "authToken": { "token": "string", "timestamp": 0 }
}
```

### Register

Request:

```http
Method: POST
Path: /register
Body: {
  firstName: string,
  lastName: string,
  alias: string,
  password: string,
  userImageBytes: string, // base64 encoded
  imageFileExtension: string
}
```

Handler: [RegisterHandler](./src/handlers/auth/RegisterHandler.ts)

The frontend service base64-encodes the image bytes and builds `RegisterRequest`. The facade posts it to `/register` and converts the returned user and token DTOs into `User` and `AuthToken` objects.

The backend currently preserves the original FakeData registration behavior: it returns the first fake user and a newly generated auth token. It does not yet store account details, validate credentials, or upload the supplied image.

Response: Same user and `authToken` payload as Login.

### Logout

Request:

```http
Method: POST
Path: /logout
Body: {
  token: string
}
```

Handler: [LogoutHandler](./src/handlers/auth/LogoutHandler.ts)

The frontend service builds `LogoutRequest` from the auth token. The facade posts it to `/logout` and checks the `TweeterResponse` before allowing the existing presenter to clear the local user session.

The backend currently acknowledges logout without invalidating the token, since token storage and validation have not been implemented yet.

Response:

```json
{ "success": true, "message": null }
```

### Get User

Like the other retrieval endpoints, this endpoint uses POST to carry its request as a JSON body.

Request:

```http
Method: POST
Path: /user/{alias}
Body: {
  token: string,
  alias: string
}
```

Handler: [GetUserHandler](./src/handlers/user/GetUserHandler.ts)

The frontend service builds `UserRequest`, using the same alias in the body and URL. The backend looks up that alias in `FakeData`; token validation is not implemented yet. The facade converts a returned user DTO into a `User` object and preserves `null` when no user exists.

Response: `user` is a UserDto (`firstName`, `lastName`, `alias`, `imageUrl`), or `null` if no user exists.

### Get Followees

This retrieval endpoint uses POST to carry the paged request as a JSON body.

Request:

```http
Method: POST
Path: /followees/{alias}
Body: {
  token: string,
  userAlias: string,
  pageSize: number,
  lastItem: UserDto | null
}
```

Handler:
[GetFolloweesHandler](./src/handlers/followees/GetFolloweesHandler.ts)

Response:

```json
{
  "success": true,
  "message": null,
  "items": [
    { "firstName": "string", "lastName": "string", "alias": "string", "imageUrl": "string" }
  ],
  "hasMore": true
}
```

### Get Followers

Like Get Followees, this retrieval endpoint uses POST to carry the paged request as a JSON body.

Request:

```http
Method: POST
Path: /followers/{alias}
Body: {
  token: string,
  userAlias: string,
  pageSize: number,
  lastItem: UserDto | null
}
```

Handler:
[GetFollowersHandler](./src/handlers/followers/GetFollowersHandler.ts)

Response: Same paged UserDto response as Get Followees.

### Get Is Follower Status

Like the other retrieval endpoints, this endpoint uses POST to carry its request as a JSON body.

Request:

```http
Method: POST
Path: /isfollower/{alias}/{selectedAlias}
Body: {
  token: string,
  alias: string,
  selectedAlias: string
}
```

Handler: [GetIsFollowerHandler](./src/handlers/follow/GetIsFollowerHandler.ts)

The frontend service builds `IsFollowerRequest` using the current user's alias and the selected user's alias, which the facade also includes in the URL. The backend currently returns `FakeData.instance.isFollower()`, a random boolean; relationship lookup and token validation are not implemented yet.

Response:

```json
{ "success": true, "message": null, "isFollower": true }
```

### Get Followee Count

Like the other retrieval endpoints, this endpoint uses POST to carry its request as a JSON body.

Request:

```http
Method: POST
Path: /followeecount/{alias}
Body: {
  token: string,
  alias: string
}
```

Handler: [GetFolloweeCountHandler](./src/handlers/follow/GetFolloweeCountHandler.ts)

The frontend service builds `CountRequest` with the token and user's alias. The facade posts it to the alias-specific URL and reads `count` from `CountResponse`.

Response: `{ "success": true, "message": null, "count": 0 }`

### Get Follower Count

Like Get Followee Count, this endpoint uses POST with a `CountRequest` body and returns `CountResponse`.

Request:

```http
Method: POST
Path: /followercount/{alias}
Body: {
  token: string,
  alias: string
}
```

Handler: [GetFollowerCountHandler](./src/handlers/follow/GetFollowerCountHandler.ts)

Response: `{ "success": true, "message": null, "count": 0 }`

Both count endpoints currently use backend `FakeData`, which returns random counts from 1 through 10. Stored relationship counts and token validation are not implemented yet.

### Follow

Request:

```http
Method: POST
Path: /follow
Body: {
  token: string,
  userToFollow: UserDto
}
```

Handler: [FollowHandler](./src/handlers/follow/FollowHandler.ts)

The frontend service builds `FollowRequest` from the token and target user's DTO. The facade posts it to `/follow` and returns the counts from `FollowResponse` in follower-count, followee-count order.

Response: `{ "success": true, "message": null, "followerCount": 0, "followeeCount": 0 }`

### Unfollow

Request:

```http
Method: POST
Path: /unfollow
Body: {
  token: string,
  userToUnfollow: UserDto
}
```

Handler: [UnfollowHandler](./src/handlers/follow/UnfollowHandler.ts)

The frontend service builds `UnfollowRequest` and the facade posts it to `/unfollow`. This endpoint also uses `FollowResponse` for the two returned counts.

Response: Same follower and followee count payload as Follow.

Both endpoints currently return backend FakeData counts for the target user. They do not yet persist relationship changes or validate tokens.

### Post Status

Request:

```http
Method: POST
Path: /status
Body: {
  token: string,
  newStatus: StatusDto
}
```

`StatusDto` contains `post: string`, `user: UserDto`, and `timestamp: number`.

Handler: [PostStatusHandler](./src/handlers/status/PostStatusHandler.ts)

The frontend service builds `PostStatusRequest` from the token and status DTO. The facade posts it to `/status` and checks the `TweeterResponse` before the existing presenter clears the composer and displays success.

The backend currently acknowledges the request without storing the status or distributing it to followers' feeds. Token validation is not implemented yet, and feed/story retrieval still returns FakeData.

Response: `{ "success": true, "message": null }`

### Get Feed

Like Get Followers, this retrieval endpoint uses POST to carry the paged request as a JSON body.

Request:

```http
Method: POST
Path: /feed/{alias}
Body: {
  token: string,
  userAlias: string,
  pageSize: number,
  lastItem: StatusDto | null
}
```

`StatusDto` contains `post: string`, `user: UserDto`, and `timestamp: number`.

Handler: [GetFeedHandler](./src/handlers/status/GetFeedHandler.ts)

Response: A paged response with `items: StatusDto[]` and `hasMore: boolean`. The facade converts these DTOs into `Status` objects.

### Get Story

Like Get Followers, this retrieval endpoint uses POST to carry the paged request as a JSON body.

Request:

```http
Method: POST
Path: /story/{alias}
Body: {
  token: string,
  userAlias: string,
  pageSize: number,
  lastItem: StatusDto | null
}
```

Handler: [GetStoryHandler](./src/handlers/status/GetStoryHandler.ts)

Response: Same paged `StatusDto` response as Get Feed.

Both endpoints currently use backend `FakeData` pagination, like Get Followers; they do not yet filter statuses by the requested user or follow relationships.
