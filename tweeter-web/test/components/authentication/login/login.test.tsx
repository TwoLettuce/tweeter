import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { LoginPresenter } from "../../../../src/presenter/authentication/login/LoginPresenter";

library.add(fab);

describe("Login Component", () => {
  test("starts with sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  test("enabled when both the alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement("/");
    await fillAndExpectEnabled(user, [aliasField, passwordField], signInButton);
  });

  test("disabled if either the alias or password field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement("/");
    await fillAndExpectEnabled(user, [aliasField, passwordField], signInButton);

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await fillAndExpectEnabled(user, [aliasField], signInButton);

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  test("presenter's login method is called with correct parameters when the sign-in button is pressed", async () => {
    const mockLoginPresenter = mock<LoginPresenter>();
    const mockLoginPresenterInstance = instance(mockLoginPresenter);
    const origUrl = "http://your-mom.com";
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElement(origUrl, mockLoginPresenterInstance);

    await fillAndExpectEnabled(user, [aliasField, passwordField], signInButton);
    await user.click(signInButton);

    verify(mockLoginPresenter.doLogin("value", "value", false, origUrl)).once();
  });
});

async function fillAndExpectEnabled(
  user: UserEvent,
  fields: HTMLElement[],
  button: HTMLElement,
) {
  for (let field of fields) {
    await user.type(field, "value");
  }
  expect(button).toBeEnabled();
}

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>,
  );
}

function renderLoginAndGetElement(
  originalUrl: string,
  presenter?: LoginPresenter,
) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");
  return { user, signInButton, aliasField, passwordField };
}
