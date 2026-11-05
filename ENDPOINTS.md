## Endpoints:

#### Get Followees

```http
Method: GET
Path: /followees/{alias}
Body: {
  authToken: string,
  lastFollowee: User,
  pageSize: number
}
```

#### Get Followers

```http
Method: GET
Path: /followers/{alias}
Body: {
  authToken: string,
  lastFollower: User,
  pageSize: number
}
```
