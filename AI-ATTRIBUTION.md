## 2026-11-09: tweeter-server/template.yaml

- Tool: Codex
- Task: Update the SAM API and Lambda event configuration to match the Get Followees endpoint in ENDPOINTS.md.
- Review: Looks like it worked, but it didn't add any parameter fields. I'll double check that that isn't necessary.

## 2026-11-12: tweeter-server/template.yaml

- Tool: Codex
- Task: Fix the SAM deployment template's unresolved tweeterLayer reference by enabling its existing layer resource.
- Review: After some debating with Codex, it was discovered that the node_modules directory was not getting copied correctly and SAM was not deploying properly.

## 2026-11-12: tweeter-server/template.yaml

- Tool: Codex
- Task: Correct the Lambda handler path to match the compiled JavaScript location under dist/src.
- Review: Lambda deploys correctly, now getting issues with dependencies and symbolic links.

## 2026-11-13: deploy.Ps1, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Fix Lambda deployment packaging so tweeter-shared is included as a real package in the layer, and make deployment stop on command failures without deleting the existing stack first.
- Review: Lambda deployment packaging successful. Successful Lambda requests function without errors.

## 2026-11-13: tweeter-server/ENDPOINTS.md, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Align Get Followees and Get Followers endpoint documentation with the server API contract, then document the remaining application endpoints.
- Review: AI endpoint definitions look good.

## 2026-11-14: tweeter-web/src/net/ClientCommunicator.ts, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Refactor ClientCommunicator to expose methods for GET, POST, DELETE, and PUT with shared request and response handling.
- Review: code reviewed and looks good. Had to add request body to GET methods.

## 2026-11-14: tweeter-web/src/net/ServerFacade.ts, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Fix loadMoreFollowees to await and return its result, convert user DTOs, and handle failed or missing responses.
- Review: changes reviewed and accepted

## 2026-11-14: tweeter-web/src/model/service/FollowService.ts, tweeter-web/src/net/ServerFacade.ts, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Move followee request construction into FollowService and update ServerFacade to accept the typed request object.
- Review: Changes reviewed and approved

## 2026-11-14: tweeter-web/src/model/service/FollowService.ts, tweeter-web/src/net/ServerFacade.ts, tweeter-server/src/handlers/followers/FollowersGetHandler.ts (new file), tweeter-server/template.yaml, tweeter-server/ENDPOINTS.md, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Implement the Get Followers endpoint using the existing paged request/response types and followees structure. Connect the frontend service, facade, backend handler, and SAM route; align both paged endpoints with POST for JSON request bodies.
- Review: Tested Manually, functioning as expected

## 2026-11-14: tweeter-shared/src/model/dto/StatusDto.ts (new file), tweeter-shared/src/model/domain/Status.ts, tweeter-shared/src/index.ts, tweeter-web/src/model/service/StatusService.ts, tweeter-web/src/net/ServerFacade.ts, tweeter-server/src/model/service/StatusService.ts (new file), tweeter-server/src/handlers/status/FeedGetHandler.ts (new file), tweeter-server/src/handlers/status/StoryGetHandler.ts (new file), tweeter-server/template.yaml, tweeter-server/ENDPOINTS.md, tweeter-web/test/net/StatusEndpoints.test.ts (new file), AI-ATTRIBUTION.md

- Tool: Codex
- Task: Implement Get Feed and Get Story end-to-end following the followers structure, with shared status DTOs, frontend request construction, facade conversion, backend pagination and handlers, POST routes, and updated contracts. Add tests for pagination across JSON boundaries, domain reconstruction, empty pages, and failures.
- Review: Tested Manually, small bug where first 20 statuses were repeated but unable to replicate or find cause.

## 2026-11-14: start-dev.ps1 (new file), AI-ATTRIBUTION.md

- Tool: Codex
- Task: Create start-dev.ps1 to build tweeter-shared, build tweeter-web, and start tweeter-web in order, stopping if a command fails.
- Review: script tested and working as expected

## 2026-11-14: tweeter-web/test/net/StatusEndpoints.test.ts, tweeter-web/package.json, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Rewrite the status endpoint tests as a successful client-side StatusService story integration test against the deployed backend, without mocks. Configure Jest projects so network integration tests use Node's fetch while existing UI and presenter tests retain jsdom.
- Review: Reviewed tests and ensured that I understand the testing framework and that it meets project specification

## 2026-11-14: tweeter-shared/src/model/net/request/LoginRequest.ts (new file), tweeter-shared/src/model/net/response/LoginResponse.ts (new file), tweeter-shared/src/model/dto/AuthTokenDto.ts (new file), tweeter-shared/src/model/domain/AuthToken.ts, tweeter-shared/src/model/net/response/TweeterResponse.ts, tweeter-shared/src/index.ts, tweeter-web/src/model/service/UserService.ts, tweeter-web/src/net/ServerFacade.ts, tweeter-web/src/net/ClientCommunicator.ts, tweeter-server/src/model/service/UserService.ts (new file), tweeter-server/src/handlers/auth/LoginHandler.ts (new file), tweeter-server/template.yaml, tweeter-server/ENDPOINTS.md, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Implement Login end-to-end using shared request/response types, token DTO conversion, frontend service and facade, backend FakeData service and handler, and a POST SAM route. Update the endpoint documentation and remove request-body logging to avoid printing passwords; no tests were added.
- Review: Login tested manually, functions as expected.

## 2026-11-14: tweeter-shared/src/model/net/request/RegisterRequest.ts (new file), tweeter-shared/src/model/net/response/RegisterResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-web/src/model/service/UserService.ts, tweeter-web/src/net/ServerFacade.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/src/handlers/auth/RegisterHandler.ts (new file), tweeter-server/template.yaml, tweeter-server/ENDPOINTS.md, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Implement Register end-to-end following Login, including shared request/response types, base64 image request construction, facade DTO conversion, backend FakeData service and handler, and a POST SAM route. Document the current FakeData limitations; no tests were added.
- Review: Tested manulaly, functions as expected

## 2026-11-14: tweeter-shared/src/model/net/request/LogoutRequest.ts (new file), tweeter-shared/src/index.ts, tweeter-web/src/model/service/UserService.ts, tweeter-web/src/net/ServerFacade.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/src/handlers/auth/LogoutHandler.ts (new file), tweeter-server/template.yaml, tweeter-server/ENDPOINTS.md, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Implement Logout end-to-end with a service-built token request, facade response handling, backend service and handler, and a POST SAM route. Document that token revocation awaits persistent authentication; no tests were added.
- Review: Tested manually, produced an error that was unreproducible, likely because AWS hadn't finished configuring yet.

## 2026-11-14: tweeter-shared/src/model/net/request/UserRequest.ts (new file), tweeter-shared/src/model/net/response/UserResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-web/src/model/service/UserService.ts, tweeter-web/src/net/ServerFacade.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/src/handlers/user/UserGetHandler.ts (new file), tweeter-server/template.yaml, tweeter-server/ENDPOINTS.md, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Implement Get User end-to-end with shared request/response types, service-built requests, facade DTO conversion, backend FakeData lookup and handler, and a POST SAM route. Preserve null for unknown aliases and update the endpoint documentation; no tests were added.
- Review: Reviewed and tested manually. Working as expected.

## 2026-11-14: tweeter-shared/src/model/net/request/IsFollowerRequest.ts (new file), tweeter-shared/src/model/net/response/IsFollowerResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-web/src/model/service/FollowService.ts, tweeter-web/src/net/ServerFacade.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/handlers/follow/IsFollowerGetHandler.ts (new file), tweeter-server/template.yaml, tweeter-server/ENDPOINTS.md, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Implement Get Is Follower Status end-to-end with shared request/response types, service-built requests containing both aliases, facade handling, backend FakeData service and handler, and a POST SAM route. Update documentation to describe the contract and random FakeData result; no tests were added.
- Review: Reviewed and tested manually. Button state doesn't change until response from API call is received. TODO: disable button while waiting to transition between users.

## 2026-11-14: tweeter-server/src/handlers/followees/FolloweesGetHandler.ts -> tweeter-server/src/handlers/followees/GetFolloweesHandler.ts (renamed), tweeter-server/src/handlers/followers/FollowersGetHandler.ts -> tweeter-server/src/handlers/followers/GetFollowersHandler.ts (renamed), tweeter-server/src/handlers/user/UserGetHandler.ts -> tweeter-server/src/handlers/user/GetUserHandler.ts (renamed), tweeter-server/src/handlers/follow/IsFollowerGetHandler.ts -> tweeter-server/src/handlers/follow/GetIsFollowerHandler.ts (renamed), tweeter-server/src/handlers/status/FeedGetHandler.ts -> tweeter-server/src/handlers/status/GetFeedHandler.ts (renamed), tweeter-server/src/handlers/status/StoryGetHandler.ts -> tweeter-server/src/handlers/status/GetStoryHandler.ts (renamed), tweeter-server/template.yaml, tweeter-server/ENDPOINTS.md, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Rename resource-first Get handler files and exported functions to GetResource/getResource naming, updating SAM handler references and endpoint documentation, including planned count handlers.
- Review: Reviewed. Appears to have only affected names. No testing required.

## 2026-11-14: tweeter-shared/src/model/net/request/CountRequest.ts (new file), tweeter-shared/src/model/net/response/CountResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-web/src/model/service/FollowService.ts, tweeter-web/src/net/ServerFacade.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/handlers/follow/GetFolloweeCountHandler.ts (new file), tweeter-server/src/handlers/follow/GetFollowerCountHandler.ts (new file), tweeter-server/template.yaml, tweeter-server/ENDPOINTS.md, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Implement Get Followee Count and Get Follower Count end-to-end with shared count request/response types, service-built requests, facade handling, backend FakeData counts and handlers, and POST SAM routes. Update existing backend count callers and endpoint documentation; no tests were added.
- Review: Manually tested. Works as expected

## 2026-11-14: tweeter-shared/src/model/net/request/FollowRequest.ts (new file), tweeter-shared/src/model/net/request/UnfollowRequest.ts (new file), tweeter-shared/src/model/net/response/FollowResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-web/src/model/service/FollowService.ts, tweeter-web/src/net/ServerFacade.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/handlers/follow/FollowHandler.ts (new file), tweeter-server/src/handlers/follow/UnfollowHandler.ts (new file), tweeter-server/template.yaml, tweeter-server/ENDPOINTS.md, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Implement Follow and Unfollow end-to-end with service-built token/user DTO requests, facade response handling, backend services and handlers, and POST SAM routes. Remove placeholder delays, preserve the count tuple order, and document the current FakeData limitations; no tests were added.
- Review: Reviewed and tested manually

## 2026-11-14: tweeter-shared/src/model/net/request/PostStatusRequest.ts (new file), tweeter-shared/src/index.ts, tweeter-web/src/model/service/StatusService.ts, tweeter-web/src/net/ServerFacade.ts, tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/handlers/status/PostStatusHandler.ts (new file), tweeter-server/template.yaml, tweeter-server/ENDPOINTS.md, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Implement the remaining Post Status endpoint with a shared status DTO request, service-built request, facade response handling, backend service and handler, and POST SAM route. Update documentation to describe the placeholder backend behavior and verify that all documented endpoints have configured routes and handler exports; no tests were added.
- Review: Tested, works as expected.

## 2026-11-14: tweeter-web/src/net/ServerFacade.ts, AI-ATTRIBUTION.md

- Tool: Codex
- Task: De-duplicate ServerFacade while maintaining readability by extracting shared POST success checking, paged DTO conversion, and login/register response conversion. Preserve public method signatures, routes, returned values, and error messages.
- Review: Code de-duplication is cleaner and still readable.

## 2026-11-14: tweeter-web/test/net/ServerFacade.test.ts (new file), AI-ATTRIBUTION.md

- Tool: Codex
- Task: Add Jest integration tests that call the real client-side ServerFacade and deployed backend for Register, Get Followers, Get Follower Count, and Get Followee Count. Verify returned domain objects, follower pagination, and the current FakeData count ranges without mocking server communication.
- Review: Tests are legible and easily understood.

## 2026-11-14: tweeter-web/test/tsconfig.json (new file), AI-ATTRIBUTION.md

- Tool: Codex
- Task: Fix missing Jest globals in IDE test files by adding a test-directory TypeScript configuration that extends the web configuration and includes Jest and Node types.
- Review: IDE errors remedied

## 2026-11-17: tweeter-server/ENDPOINTS.md, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Add API Gateway-style descriptions for each endpoint defined in ENDPOINTS.md, documenting its path parameters and request body fields.
- Review: All good!

## 2026-11-23: tweeter-server/src/model/domain/AuthData.ts, tweeter-server/src/model/dao/auth/IAuthDAO.ts, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Add a DTO getter and `fromDto` method to `AuthData`. Define the `AuthDataDto` shape and use it in the auth DAO contract.
- Review: a little funky to put the DTO interface and the class in the same file but it's all good. After further review and implementation it looks like the DTO/interface is all I really need.

## 2026-11-24: tweeter-server/src/model/dao/DATABASE.md (new file), AI-ATTRIBUTION.md

- Tool: Codex
- Task: Document a DynamoDB and S3 data design based on the existing DAO interfaces, including precomputed feeds, follow lookup in both directions, pagination, counts, credentials, and profile images.
- Review: it didn't create the design, but I gave it my thoughts and it helped fine-tune that design.

## 2026-11-24: tweeter-server/src/model/dao/DATABASE.md, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Update the database design to specify that auth tokens expire after five minutes of inactivity, with activity-based expiry refresh and DynamoDB TTL cleanup.
- Review: It asked me some questions about my design, so I indicated that it could go ahead and fix the issues it found

## 2026-11-24: tweeter-server/src/model/dao/follow/IFollowDAO.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/model/dao/DATABASE.md, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Replace zero-page relationship counting with direct counter lookups, define transactional follow counter updates, and use an alias-based relationship lookup for follower status.
- Review: I approve of the changes

## 2026-11-24: tweeter-server/package.json, tweeter-server/package-lock.json, tweeter-server/src/handlers/auth/LoginHandler.ts, tweeter-server/src/handlers/auth/LogoutHandler.ts, tweeter-server/src/handlers/auth/RegisterHandler.ts, tweeter-server/src/handlers/follow/FollowHandler.ts, tweeter-server/src/handlers/follow/GetFolloweeCountHandler.ts, tweeter-server/src/handlers/follow/GetFollowerCountHandler.ts, tweeter-server/src/handlers/follow/GetIsFollowerHandler.ts, tweeter-server/src/handlers/follow/UnfollowHandler.ts, tweeter-server/src/handlers/followees/GetFolloweesHandler.ts, tweeter-server/src/handlers/followers/GetFollowersHandler.ts, tweeter-server/src/handlers/status/GetFeedHandler.ts, tweeter-server/src/handlers/status/GetStoryHandler.ts, tweeter-server/src/handlers/status/PostStatusHandler.ts, tweeter-server/src/handlers/user/GetUserHandler.ts, tweeter-server/src/model/dao/auth/DynamoAuthDAO.ts (new file), tweeter-server/src/model/dao/dynamo/DynamoDAO.ts (new file), tweeter-server/src/model/dao/factory/AwsDAOFactory.ts, tweeter-server/src/model/dao/follow/DynamoFollowDAO.ts (new file), tweeter-server/src/model/dao/follow/IFollowDAO.ts, tweeter-server/src/model/dao/s3/S3UserImageDAO.ts (new file), tweeter-server/src/model/dao/s3/UserImageSupport.ts (new file), tweeter-server/src/model/dao/status/DynamoStatusDAO.ts (new file), tweeter-server/src/model/dao/user/DynamoUserDAO.ts (new file), tweeter-server/src/model/dao/user/PasswordHash.ts (new file), tweeter-server/src/model/dao/DATABASE.md, tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/template.yaml, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Implement DynamoDB DAOs and the S3 user-image DAO using DATABASE.md, share common AWS access and pagination helpers, wire the DAOs into Lambda handlers, and provision the matching DynamoDB tables and private image bucket.
- Review: Codex did a LOT more than I asked it to, I only wanted it to write the DAOs to match the interfaces but it went all the way and tried to finish the rest of the phase. My prompt was "Create Dynamo DB implementations (naming them DynamoAuthDAO, DynamoUserDAO, etc. (plus s3UserImageDAO)). Use the definitions in DATABASE.md and avoid code duplication." I will review and commit small groups of code as I verify them.

## 2026-11-24: tweeter-server/package.json, tweeter-server/package-lock.json, tweeter-server/src/model/dao/user/IPasswordEncryptor.ts (new file), tweeter-server/src/model/dao/user/BcryptPasswordEncryptor.ts (new file), tweeter-server/src/model/dao/user/PasswordHash.ts (deleted), tweeter-server/src/model/dao/user/DynamoUserDAO.ts, tweeter-server/src/model/dao/factory/IDAOFactory.ts, tweeter-server/src/model/dao/factory/AwsDAOFactory.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/src/model/dao/DATABASE.md, AI-ATTRIBUTION.md

- Tool: Codex
- Task: Replace scrypt password hashing with bcrypt, define a password-encryptor interface, and adapt the bcrypt library to that interface for registration and login.
- Review: TODO
