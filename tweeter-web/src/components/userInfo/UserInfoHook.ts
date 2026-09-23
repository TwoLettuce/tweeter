import { useContext } from "react";
import { UserInfoContext } from "./UserInfoContexts";

export const useUserInfo = () => useContext(UserInfoContext);
