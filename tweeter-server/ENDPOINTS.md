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

Handler: [UserGetHandler](./src/handlers/user/UserGetHandler.ts)

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
[FolloweesGetHandler](./src/handlers/followees/FolloweesGetHandler.ts)

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
[FollowersGetHandler](./src/handlers/followers/FollowersGetHandler.ts)

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

Handler: [IsFollowerGetHandler](./src/handlers/follow/IsFollowerGetHandler.ts)

The frontend service builds `IsFollowerRequest` using the current user's alias and the selected user's alias, which the facade also includes in the URL. The backend currently returns `FakeData.instance.isFollower()`, a random boolean; relationship lookup and token validation are not implemented yet.

Response:

```json
{ "success": true, "message": null, "isFollower": true }
```

### Get Followee Count

Request:

```http
Method: GET
Path: /followeecount/{alias}
Body: {
  token: string
}
```

Handler (to be created): `src/handlers/follow/FolloweeCountGetHandler.ts`

Response: `{ "success": true, "message": null, "count": 0 }`

### Get Follower Count

Request:

```http
Method: GET
Path: /followercount/{alias}
Body: {
  token: string
}
```

Handler (to be created): `src/handlers/follow/FollowerCountGetHandler.ts`

Response: `{ "success": true, "message": null, "count": 0 }`

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

Handler (to be created): `src/handlers/follow/FollowPostHandler.ts`

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

Handler (to be created): `src/handlers/follow/UnfollowPostHandler.ts`

Response: Same follower and followee count payload as Follow.

### Post Status

Request:

```http
Method: POST
Path: /status
Body: {
  token: string,
  newStatus: Status
}
```

`Status` contains `post: string`, `user: UserDto`, and `timestamp: number`.

Handler (to be created): `src/handlers/status/StatusPostHandler.ts`

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

Handler: [FeedGetHandler](./src/handlers/status/FeedGetHandler.ts)

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

Handler: [StoryGetHandler](./src/handlers/status/StoryGetHandler.ts)

Response: Same paged `StatusDto` response as Get Feed.

Both endpoints currently use backend `FakeData` pagination, like Get Followers; they do not yet filter statuses by the requested user or follow relationships.
