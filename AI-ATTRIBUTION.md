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
