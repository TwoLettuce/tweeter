// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";

describe("StatusService integration", () => {
  let statusService: StatusService;
  const userAlias: string = "@allen";
  const pageSize: number = 10;
  // The current backend uses FakeData and does not validate auth tokens yet.
  const authToken: AuthToken = new AuthToken("dummy-token", Date.now());

  beforeEach(() => {
    statusService = new StatusService();
  });

  test("successfully retrieves a user's story pages from the server", async () => {
    const [firstPage, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      userAlias,
      pageSize,
      null,
    );

    expect(firstPage.length).toBe(pageSize);
    expect(hasMore).toBe(true);
    for (const status of firstPage) {
      expect(status).toBeInstanceOf(Status);
      expect(status.post).toEqual(expect.any(String));
      expect(status.post.length).toBeGreaterThan(0);
      expect(status.timestamp).toEqual(expect.any(Number));
      expect(status.user).toBeInstanceOf(User);
      expect(status.user.alias).toEqual(expect.any(String));
    }

    const [secondPage, secondPageHasMore] = await statusService.loadMoreStoryItems(
      authToken,
      userAlias,
      pageSize,
      firstPage[firstPage.length - 1],
    );

    expect(secondPage.length).toBeGreaterThan(0);
    expect(secondPage.length).toBeLessThanOrEqual(pageSize);
    expect(typeof secondPageHasMore).toBe("boolean");
    for (const status of secondPage) {
      expect(status).toBeInstanceOf(Status);
      expect(firstPage.some((previous) => previous.equals(status))).toBe(false);
    }
  }, 30000);
});
