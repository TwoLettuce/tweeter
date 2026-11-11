## Endpoints:

### Get Followees

```http
Method: GET
Path: /followees/{alias}
Body: {
  authToken: string,
  lastFollowee: User,
  pageSize: number
}
```

Returns User[]:

```
{
  [
    {
      _firstName: string,
      _lastName: string,
      _alias: string,
      _imageUrl: string,
    }
    ...
  ],
  hasMore: boolean
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
