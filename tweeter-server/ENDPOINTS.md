## Endpoints

Successful endpoint responses include `success: true` and a `message` field. Errors return a non-2xx status and the shared response shape below. Error messages are safe for display; implementation details stay in server logs.

```json
{
  "success": false,
  "code": "ALIAS_TAKEN",
  "message": "That alias is already in use."
}
```

Current error codes are `INVALID_CREDENTIALS` (401), `SESSION_EXPIRED` (401), `INVALID_INPUT` (400), `NOT_FOUND` (404), `ALIAS_TAKEN` (409), `RELATIONSHIP_CONFLICT` (409), and `INTERNAL_ERROR` (500). Unexpected server failures use the generic `INTERNAL_ERROR` message.

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
Path: /isfollower/{followerAlias}/{followeeAlias}
Body: {
  token: string,
  followerAlias: string,
  followeeAlias: string
}
```

Handler: [GetIsFollowerHandler](./src/handlers/follow/GetIsFollowerHandler.ts)

The frontend service builds `IsFollowerRequest` with the follower's alias and the followee's alias, which the facade also includes in the URL. The backend checks that relationship in the follow DAO.

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

## API Gateway Method Descriptions

The following descriptions can be used for the corresponding API Gateway methods. `pathParameters` documents values captured from each route; an empty object means the route has no path parameters.

### Login (`POST /login`)

```json
{
  "description": "Authenticate a user and return the user and authorization token.",
  "pathParameters": {},
  "requestBody": {
    "alias": "string. Alias of the user attempting to log in.",
    "password": "string. Password of the user attempting to log in."
  }
}
```

### Register (`POST /register`)

```json
{
  "description": "Register a user and return the user and authorization token.",
  "pathParameters": {},
  "requestBody": {
    "firstName": "string. User's first name.",
    "lastName": "string. User's last name.",
    "alias": "string. User's unique alias.",
    "password": "string. User's password.",
    "userImageBytes": "string. User image bytes encoded as base64.",
    "imageFileExtension": "string. File extension of the user image."
  }
}
```

### Logout (`POST /logout`)

```json
{
  "description": "Log out the user associated with the authorization token.",
  "pathParameters": {},
  "requestBody": {
    "token": "string. Authorization token."
  }
}
```

### Get User (`POST /user/{alias}`)

```json
{
  "description": "Retrieve the user with the given alias.",
  "pathParameters": {
    "alias": "Alias of the user to retrieve."
  },
  "requestBody": {
    "token": "string. Authorization token.",
    "alias": "string. Alias of the user to retrieve."
  }
}
```

### Get Followees (`POST /followees/{alias}`)

```json
{
  "description": "Retrieve a page of users followed by the given user.",
  "pathParameters": {
    "alias": "Alias of the user whose followees should be fetched."
  },
  "requestBody": {
    "token": "string. Authorization token.",
    "userAlias": "string. Alias of the user whose followees should be fetched.",
    "pageSize": "number. Number of followees to fetch at a time.",
    "lastItem": "UserDto object or null. The last followee from the previous request page."
  }
}
```

### Get Followers (`POST /followers/{alias}`)

```json
{
  "description": "Retrieve a page of users who follow the given user.",
  "pathParameters": {
    "alias": "Alias of the user whose followers should be fetched."
  },
  "requestBody": {
    "token": "string. Authorization token.",
    "userAlias": "string. Alias of the user whose followers should be fetched.",
    "pageSize": "number. Number of followers to fetch at a time.",
    "lastItem": "UserDto object or null. The last follower from the previous request page."
  }
}
```

### Get Is Follower Status (`POST /isfollower/{followerAlias}/{followeeAlias}`)

```json
{
  "description": "Determine whether the follower follows the followee.",
  "pathParameters": {
    "followerAlias": "Alias of the user whose follow relationship is being checked.",
    "followeeAlias": "Alias of the user being followed."
  },
  "requestBody": {
    "token": "string. Authorization token.",
    "followerAlias": "string. Alias of the user whose follow relationship is being checked.",
    "followeeAlias": "string. Alias of the user being followed."
  }
}
```

### Get Followee Count (`POST /followeecount/{alias}`)

```json
{
  "description": "Retrieve the number of users followed by the given user.",
  "pathParameters": {
    "alias": "Alias of the user whose followee count should be fetched."
  },
  "requestBody": {
    "token": "string. Authorization token.",
    "alias": "string. Alias of the user whose followee count should be fetched."
  }
}
```

### Get Follower Count (`POST /followercount/{alias}`)

```json
{
  "description": "Retrieve the number of users who follow the given user.",
  "pathParameters": {
    "alias": "Alias of the user whose follower count should be fetched."
  },
  "requestBody": {
    "token": "string. Authorization token.",
    "alias": "string. Alias of the user whose follower count should be fetched."
  }
}
```

### Follow (`POST /follow`)

```json
{
  "description": "Follow the specified user.",
  "pathParameters": {},
  "requestBody": {
    "token": "string. Authorization token.",
    "userToFollow": "UserDto object. User to follow."
  }
}
```

### Unfollow (`POST /unfollow`)

```json
{
  "description": "Stop following the specified user.",
  "pathParameters": {},
  "requestBody": {
    "token": "string. Authorization token.",
    "userToUnfollow": "UserDto object. User to unfollow."
  }
}
```

### Post Status (`POST /status`)

```json
{
  "description": "Publish a new status.",
  "pathParameters": {},
  "requestBody": {
    "token": "string. Authorization token.",
    "newStatus": "StatusDto object containing the post text, author UserDto, and timestamp."
  }
}
```

### Get Feed (`POST /feed/{alias}`)

```json
{
  "description": "Retrieve a page of feed statuses for the given user.",
  "pathParameters": {
    "alias": "Alias of the user whose feed should be fetched."
  },
  "requestBody": {
    "token": "string. Authorization token.",
    "userAlias": "string. Alias of the user whose feed should be fetched.",
    "pageSize": "number. Number of feed items to fetch at a time.",
    "lastItem": "StatusDto object or null. The last item of the previous request page."
  }
}
```

### Get Story (`POST /story/{alias}`)

```json
{
  "description": "Retrieve a page of statuses posted by the given user.",
  "pathParameters": {
    "alias": "Alias of the user whose story should be fetched."
  },
  "requestBody": {
    "token": "string. Authorization token.",
    "userAlias": "string. Alias of the user whose story should be fetched.",
    "pageSize": "number. Number of story items to fetch at a time.",
    "lastItem": "StatusDto object or null. The last item of the previous request page."
  }
}
```
