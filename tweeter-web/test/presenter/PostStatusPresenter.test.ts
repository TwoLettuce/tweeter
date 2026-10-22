import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/postStatus/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenterSpy: PostStatusPresenter;
  let presenter: PostStatusPresenter;
  let mockStatusService: StatusService;
  let mockStatusServiceInstance: StatusService;
  const authToken: AuthToken = new AuthToken("dummy-token", Date.now());
  const user: User = new User(
    "John",
    "Fortnite",
    "@john_d_fortnite",
    "fakeURL",
  );
  const messageID = "loadingInfoMessageID :)";

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    when(
      mockPostStatusView.displayInfoMessage("Posting status...", 0),
    ).thenReturn(messageID);
    const postStatusViewInstance = instance(mockPostStatusView);

    postStatusPresenterSpy = spy<PostStatusPresenter>(
      new PostStatusPresenter(postStatusViewInstance),
    );
    presenter = instance(postStatusPresenterSpy);
    mockStatusService = mock<StatusService>();
    mockStatusServiceInstance = instance(mockStatusService);
    when(postStatusPresenterSpy.statusService).thenReturn(
      mockStatusServiceInstance,
    );
  });

  test("tells the view to display a posting status message", async () => {
    await presenter.submitPost("a post", user, authToken);
    verify(mockPostStatusView.displayInfoMessage(anything(), 0)).once();
  });

  test("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await presenter.submitPost("a post", user, authToken);
    const [auth, status] = capture(mockStatusService.postStatus).last();
    if (auth != authToken) {
      throw Error(
        `Auth token does not match:\nExpected ${authToken}\nbut got ${auth}`,
      );
    } else if (status.post != "a post") {
      throw Error(
        `post does not match:\nExpected "a post"\nbut got "${status.post}"`,
      );
    }
  });

  test("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message.", async () => {
    await presenter.submitPost("a post", user, authToken);
    verify(mockPostStatusView.deleteMessage(messageID)).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", anything()),
    ).once();
  });

  test("tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message", async () => {
    when(mockStatusService.postStatus(anything(), anything())).thenThrow(
      new Error("Something's wrong"),
    );
    await presenter.submitPost("a post", user, authToken);

    verify(mockPostStatusView.deleteMessage(messageID)).once();

    console.log(capture(mockPostStatusView.displayErrorMessage).last());
    verify(
      mockPostStatusView.displayErrorMessage(
        "Failed to post the status because of exception: Something's wrong",
      ),
    ).once();

    verify(mockPostStatusView.setPost("")).never();

    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", anything()),
    ).never();
  });
});
