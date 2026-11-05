## Endpoints:

#### Get Followees

```http
Method: GET
Path: /followees/{alias}
Headers: Authorization
Body: {
  lastFollowee: User,
  pageSize: number
}
```

#### Get Followers

Method: GET
Path: /followers/{alias}
Headers: Authorization=authToken
Body: {
lastFollower: User,
pageSize: number
}
