import { IAuthDAO } from "../auth/IAuthDAO";
import { IFollowDAO } from "../follow/IFollowDAO";
import { IStatusDAO } from "../status/IStatusDAO";
import { IUserDAO } from "../user/IUserDAO";
import { IUserImageDAO } from "../user/IUserImageDAO";

export interface IDAOFactory {
  getUserDAO(): IUserDAO;
  getAuthDAO(): IAuthDAO;
  getFollowDAO(): IFollowDAO;
  getStatusDAO(): IStatusDAO;
  getUserImageDAO(): IUserImageDAO;
}
