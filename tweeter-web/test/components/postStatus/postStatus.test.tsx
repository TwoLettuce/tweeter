import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import UserInfoProvider from "../../../src/components/userInfo/UserInfoProvider";
import { render, screen } from "@testing-library/react";
import { AuthToken, User } from "tweeter-shared";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHook";
import { PostStatusPresenter } from "../../../src/presenter/postStatus/PostStatusPresenter";
import { capture, instance, mock, verify } from "@typestrong/ts-mockito";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("Post Status", () => {
  const fakeUser = new User(
    "John",
    "Fortnite",
    "@john_d_fortnite",
    "fakeurl.http.jpg",
  );
  const fakeAuth = new AuthToken("AuthToken", Date.now());
  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: fakeUser,
      authToken: fakeAuth,
    });
  });

  test("Post Status and Clear buttons are both disabled on render", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElements();
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });
  test("Both buttons are enabled when the text field has text", async () => {
    const { user, postStatusButton, clearButton, statusInputField } =
      renderPostStatusAndGetElements();

    console.log(statusInputField);

    await user.type(statusInputField, "This is what I'm feeling today");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  test("Both buttons are disabled when the text field is cleared", async () => {
    const { user, postStatusButton, clearButton, statusInputField } =
      renderPostStatusAndGetElements();

    console.log(statusInputField);

    await user.type(statusInputField, "This is what I'm feeling today");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.click(clearButton);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  test("presenter's postStatus method is called with correct parameters when the Post Status button is pressed", async () => {
    const mockPostStatusPresenter = mock<PostStatusPresenter>();
    const mockPostStatusPresenterInstance = instance(mockPostStatusPresenter);

    const { user, postStatusButton, statusInputField } =
      renderPostStatusAndGetElements(mockPostStatusPresenterInstance);

    const statusMessage = "This is how I'm feeling";
    await user.type(statusInputField, statusMessage);
    expect(postStatusButton).toBeEnabled();
    await user.click(postStatusButton);
    console.log(capture(mockPostStatusPresenter.submitPost).last());
    verify(
      mockPostStatusPresenter.submitPost(statusMessage, fakeUser, fakeAuth),
    ).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    !!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />,
  );
}

function renderPostStatusAndGetElements(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", { name: /Post status/i });
  const clearButton = screen.getByRole("button", { name: /clear/i });
  const statusInputField = screen.getByPlaceholderText("What's on your mind?");
  return { user, postStatusButton, clearButton, statusInputField };
}
