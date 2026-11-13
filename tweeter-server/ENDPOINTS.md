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

Handler (to be created): `src/handlers/auth/LoginHandler.ts`

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

Handler (to be created): `src/handlers/auth/RegisterHandler.ts`

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

Handler (to be created): `src/handlers/auth/LogoutHandler.ts`

Response:

```json
{ "success": true, "message": null }
```

### Get User

Request:

```http
Method: GET
Path: /user/{alias}
Body: {
  token: string
}
```

Handler (to be created): `src/handlers/user/UserGetHandler.ts`

Response: `user` is a UserDto (`firstName`, `lastName`, `alias`, `imageUrl`), or `null` if no user exists.

### Get Followees

Request:

```http
Method: GET
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

Request:

```http
Method: GET
Path: /followers/{alias}
Body: {
  token: string,
  userAlias: string,
  pageSize: number,
  lastItem: UserDto | null
}
```

Handler (to be created): `src/handlers/followers/FollowersGetHandler.ts`

Response: Same paged UserDto response as Get Followees.

### Get Is Follower Status

Request:

```http
Method: GET
Path: /isfollower/{alias}/{selectedAlias}
Body: {
  token: string
}
```

Handler (to be created): `src/handlers/follow/IsFollowerGetHandler.ts`

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

Request:

```http
Method: GET
Path: /feed/{alias}
Body: {
  token: string,
  userAlias: string,
  pageSize: number,
  lastItem: Status | null
}
```

Handler (to be created): `src/handlers/status/FeedGetHandler.ts`

Response: A paged response with `items: Status[]` and `hasMore: boolean`.

### Get Story

Request:

```http
Method: GET
Path: /story/{alias}
Body: {
  token: string,
  userAlias: string,
  pageSize: number,
  lastItem: Status | null
}
```

Handler (to be created): `src/handlers/status/StoryGetHandler.ts`

Response: A paged response with `items: Status[]` and `hasMore: boolean`.
