import {
  AppNavbarPresenter,
  AppNavbarView,
} from "../../src/presenter/appNavbar/AppNavbarPresenter";
import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
  let mockAppNavbarView: AppNavbarView;
  let presenter: AppNavbarPresenter;
  const authToken: AuthToken = new AuthToken("dummy-token", Date.now());
  let mockUserService: UserService;
  let infoMessageID = "InfoMessageID";

  beforeEach(() => {
    mockAppNavbarView = mock<AppNavbarView>();
    when(mockAppNavbarView.displayInfoMessage(anything(), 0)).thenReturn(
      infoMessageID,
    );
    when(mockAppNavbarView.displayErrorMessage(anything()));
    const mockAppNavbarViewInstance = instance(mockAppNavbarView);

    mockUserService = mock<UserService>();
    let mockUserServiceInstance = instance(mockUserService);

    const appNavbarPresenterSpy = spy(
      new AppNavbarPresenter(mockAppNavbarViewInstance),
    );
    when(appNavbarPresenterSpy.userService).thenReturn(mockUserServiceInstance);

    presenter = instance(appNavbarPresenterSpy);
  });

  test("tells the view to display a logging out message", async () => {
    await presenter.logOut(authToken);
    verify(mockAppNavbarView.displayInfoMessage(anything(), 0)).once();
  });

  test("calls logout on the user service with the correct auth token", async () => {
    await presenter.logOut(authToken);
    verify(mockUserService.logout(authToken)).once();
  });

  test("tells the view to clear the info message, user info, and navigates to login", async () => {
    await presenter.logOut(authToken);
    verify(mockAppNavbarView.deleteMessage(infoMessageID)).once();
    verify(mockAppNavbarView.clearUserInfo()).once();
    verify(mockAppNavbarView.navigate(anything()));
  });

  test("tells the view to display an error message and does not tell it to delete the info message, clear the user info or navigate to the login page", async () => {
    let error = new Error("An error occured");
    when(mockUserService.logout(anything())).thenThrow(error);

    await presenter.logOut(new AuthToken("invalid", Date.now()));
    verify(
      mockAppNavbarView.displayErrorMessage(
        "Failed to log user out because of exception: An error occured",
      ),
    ).once();

    verify(mockAppNavbarView.deleteMessage(infoMessageID)).never();
    verify(mockAppNavbarView.clearUserInfo()).never();
    verify(mockAppNavbarView.navigate(anything())).never();
  });
});
