import { AuthToken, User } from "tweeter-shared";
import { UserInfoActionsContext } from "./UserInfoContexts";
import { useContext } from "react";

const { updateUserInfo, clearUserInfo, setDisplayedUser } = useContext(
  UserInfoActionsContext,
);

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
  return {
    updateUserInfo: updateUserInfo,
    clearUserInfo: clearUserInfo,
    setDisplayedUser: setDisplayedUser,
  };
};
