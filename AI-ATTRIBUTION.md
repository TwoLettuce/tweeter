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
