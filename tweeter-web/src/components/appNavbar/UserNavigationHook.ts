import { useUserInfo } from "../userInfo/UserInfoHook";
import { useUserInfoActions } from "../userInfo/UserInfoActionsHook";
import { useMessageActions } from "../toaster/MessageHooks";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { UserNavigationPresenter } from "../../presenter/appNavbar/UserNavigationPresenter";

export const useUserNavigation = async (
  event: React.MouseEvent,
  featurePath: string,
): Promise<void> => {
  event.preventDefault();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();
  const navigate = useNavigate();
  const presenterRef = useRef<UserNavigationPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserNavigationPresenter();
  }

  try {
    const alias = presenterRef.current!.extractAlias(event.target.toString());

    const toUser = await presenterRef.current!.getUser(authToken!, alias);

    if (toUser) {
      if (!toUser.equals(displayedUser!)) {
        setDisplayedUser(toUser);
        navigate(`${featurePath}/${toUser.alias}`);
      }
    }
  } catch (error) {
    displayErrorMessage(`Failed to get user because of exception: ${error}`);
  }
};
