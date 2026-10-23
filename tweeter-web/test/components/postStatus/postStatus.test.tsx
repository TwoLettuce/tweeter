import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import UserInfoProvider from "../../../src/components/userInfo/UserInfoProvider";
import { render, screen } from "@testing-library/react";
import { AuthToken, User } from "tweeter-shared";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHook";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("Post Status", () => {
  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: new User(
        "John",
        "Fortnite",
        "@john_d_fortnite",
        "fakeurl.http.jpg",
      ),
      authToken: new AuthToken("AuthToken", Date.now()),
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
    expect(statusInputField).toHaveValue("This is what I'm feeling today");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });
});

function renderPostStatus() {
  return render(<PostStatus />);
}

function renderPostStatusAndGetElements() {
  const user = userEvent.setup();

  renderPostStatus();

  const postStatusButton = screen.getByRole("button", { name: /Post status/i });
  const clearButton = screen.getByRole("button", { name: /clear/i });
  const statusInputField = screen.getByPlaceholderText("What's on your mind?");
  return { user, postStatusButton, clearButton, statusInputField };
}
