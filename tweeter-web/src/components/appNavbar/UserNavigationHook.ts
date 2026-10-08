import { useUserInfo } from "../userInfo/UserInfoHook";
import { useUserInfoActions } from "../userInfo/UserInfoActionsHook";
import { useMessageActions } from "../toaster/MessageHooks";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenter/appNavbar/UserNavigationPresenter";

export const useUserNavigation = (): ((
  event: React.MouseEvent<Element, MouseEvent>,
  featurePath: string,
) => void) => {
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();
  const navigate = useNavigate();

  const presenterRef = useRef<UserNavigationPresenter | null>(null);
  if (!presenterRef.current) {
    const listener: UserNavigationView = {
      setDisplayedUser: setDisplayedUser,
      navigate: navigate,
      displayErrorMessage: displayErrorMessage,
    };
    presenterRef.current = new UserNavigationPresenter(listener);
  }

  const navigateToUser = async (
    event: React.MouseEvent,
    featurePath: string,
  ) => {
    event.preventDefault();
    await presenterRef.current!.doNavigate(
      event,
      displayedUser!,
      authToken!,
      featurePath,
    );
  };
  return navigateToUser;
};
