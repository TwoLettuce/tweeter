import { User } from "tweeter-shared";

type FolloweesRequest = {
  alias: string;
  body: {
    authToken: string;
    lastFollowee: User | null;
    pageSize: number;
  };
};

export const followeesGetHandler = (request: FolloweesRequest) => {};
