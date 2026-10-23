import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";

describe("Post Status", () => {
  test("Post Status and Clear buttons are both disabled on render", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElements();
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
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
  const statusInputField = screen.getByRole("textbox");
  return { user, postStatusButton, clearButton, statusInputField };
}
