import { IAuthDAO } from "../auth/IAuthDAO";
import { IFollowDAO } from "../follow/IFollowDAO";
import { IStatusDAO } from "../status/IStatusDAO";
import { IUserDAO } from "../user/IUserDAO";
import { IUserImageDAO } from "../user/IUserImageDAO";
import { IDAOFactory } from "./IDAOFactory";

export class AwsDAOFactory implements IDAOFactory {
  getUserDAO(): IUserDAO {
    throw new Error("Method not implemented.");
  }
  getAuthDAO(): IAuthDAO {
    throw new Error("Method not implemented.");
  }
  getFollowDAO(): IFollowDAO {
    throw new Error("Method not implemented.");
  }
  getStatusDAO(): IStatusDAO {
    throw new Error("Method not implemented.");
  }
  getUserImageDAO(): IUserImageDAO {
    throw new Error("Method not implemented.");
  }
}
