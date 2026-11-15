// AI-assisted: see AI-ATTRIBUTION.md
import {
  AuthToken,
  CountRequest,
  PagedItemRequest,
  RegisterRequest,
  User,
  UserDto,
} from "tweeter-shared";
import { ServerFacade } from "../../src/net/ServerFacade";

describe("ServerFacade integration", () => {
  let serverFacade: ServerFacade;
  const alias: string = "@allen";
  // The current FakeData backend does not validate tokens or persist registration.
  const token: string = "dummy-token";

  beforeEach(() => {
    serverFacade = new ServerFacade();
  });

  test("register returns a user and auth token from the server", async () => {
    // Match the user returned by the current FakeData registration implementation.
    const req: RegisterRequest = {
      firstName: "Allen",
      lastName: "Anderson",
      alias: alias,
      password: "Integration-test-password-1!",
      // A base64-encoded one-pixel PNG.
      userImageBytes:
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=",
      imageFileExtension: "png",
    };

    const [user, authToken] = await serverFacade.register(req);

    expect(user).toBeInstanceOf(User);
    expect(user.firstName).toBe(req.firstName);
    expect(user.lastName).toBe(req.lastName);
    expect(user.alias).toBe(req.alias);
    expect(user.imageUrl).toEqual(expect.any(String));
    expect(user.imageUrl.length).toBeGreaterThan(0);
    expect(authToken).toBeInstanceOf(AuthToken);
    expect(authToken.token).toEqual(expect.any(String));
    expect(authToken.token.length).toBeGreaterThan(0);
    expect(Number.isFinite(authToken.timestamp)).toBe(true);
    expect(authToken.timestamp).toBeGreaterThan(0);
  }, 30000);

  test("get followers returns user pages from the server", async () => {
    const req: PagedItemRequest<UserDto> = {
      token: token,
      userAlias: alias,
      pageSize: 5,
      lastItem: null,
    };

    const [firstPage, hasMore] = await serverFacade.loadMoreFollowers(req);

    expect(firstPage.length).toBe(req.pageSize);
    expect(hasMore).toBe(true);
    for (const user of firstPage) {
      expect(user).toBeInstanceOf(User);
      expect(user.firstName).toEqual(expect.any(String));
      expect(user.lastName).toEqual(expect.any(String));
      expect(user.alias).toMatch(/^@.+/);
      expect(user.imageUrl).toEqual(expect.any(String));
    }

    const [secondPage, secondPageHasMore] = await serverFacade.loadMoreFollowers({
      ...req,
      lastItem: firstPage[firstPage.length - 1].dto,
    });

    expect(secondPage.length).toBe(req.pageSize);
    expect(typeof secondPageHasMore).toBe("boolean");
    for (const user of secondPage) {
      expect(user).toBeInstanceOf(User);
      expect(firstPage.some((previous) => previous.equals(user))).toBe(false);
    }
  }, 30000);

  test("get follower count returns a count from the server", async () => {
    const req: CountRequest = { token: token, alias: alias };

    const count = await serverFacade.getFollowerCount(req);

    // FakeData currently returns a random integer from 1 through 10.
    expect(Number.isInteger(count)).toBe(true);
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(10);
  }, 30000);

  test("get followee count returns a count from the server", async () => {
    const req: CountRequest = { token: token, alias: alias };

    const count = await serverFacade.getFolloweeCount(req);

    expect(Number.isInteger(count)).toBe(true);
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(10);
  }, 30000);
});
