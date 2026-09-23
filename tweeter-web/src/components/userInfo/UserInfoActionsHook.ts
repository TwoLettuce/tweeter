import { AuthToken, User } from "tweeter-shared";
import { UserInfoActionsContext } from "./UserInfoContexts";
import { useContext } from "react";

interface UserInfoActions {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  clearUserInfo: () => void;
  setDisplayedUser: (user: User) => void;
}

export const useUserInfoActions = (): UserInfoActions => {
  const { updateUserInfo, clearUserInfo, setDisplayedUser } = useContext(
    UserInfoActionsContext,
  );
  return {
    updateUserInfo: updateUserInfo,
    clearUserInfo: clearUserInfo,
    setDisplayedUser: setDisplayedUser,
  };
};
