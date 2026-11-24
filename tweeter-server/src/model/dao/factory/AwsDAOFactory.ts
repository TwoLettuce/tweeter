// AI-assisted: see AI-ATTRIBUTION.md
import { IAuthDAO } from "../auth/IAuthDAO";
import { IFollowDAO } from "../follow/IFollowDAO";
import { IStatusDAO } from "../status/IStatusDAO";
import { IUserDAO } from "../user/IUserDAO";
import { IUserImageDAO } from "../user/IUserImageDAO";
import { IDAOFactory } from "./IDAOFactory";
import { DynamoAuthDAO } from "../auth/DynamoAuthDAO";
import { DynamoFollowDAO } from "../follow/DynamoFollowDAO";
import { DynamoStatusDAO } from "../status/DynamoStatusDAO";
import { DynamoUserDAO } from "../user/DynamoUserDAO";
import { S3UserImageDAO } from "../s3/S3UserImageDAO";

export class AwsDAOFactory implements IDAOFactory {
  private readonly userDAO: IUserDAO = new DynamoUserDAO();
  private readonly authDAO: IAuthDAO = new DynamoAuthDAO();
  private readonly followDAO: IFollowDAO = new DynamoFollowDAO();
  private readonly statusDAO: IStatusDAO = new DynamoStatusDAO();
  private readonly userImageDAO: IUserImageDAO = new S3UserImageDAO();

  getUserDAO(): IUserDAO { return this.userDAO; }
  getAuthDAO(): IAuthDAO { return this.authDAO; }
  getFollowDAO(): IFollowDAO { return this.followDAO; }
  getStatusDAO(): IStatusDAO { return this.statusDAO; }
  getUserImageDAO(): IUserImageDAO { return this.userImageDAO; }
}
