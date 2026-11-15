// AI-assisted: see AI-ATTRIBUTION.md
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

// All classes that should be available to other modules need to exported here. export * does not work when
// uploading to lambda. Instead we have to list each export.
export { FakeData } from "./util/FakeData";
export type { UserDto } from "./model/dto/UserDto";
export type { StatusDto } from "./model/dto/StatusDto";
export type { TweeterRequest } from "./model/net/request/TweeterRequest";
export type { PagedItemRequest } from "./model/net/request/PagedItemRequest";
export type { TweeterResponse } from "./model/net/response/TweeterResponse";
export type { PagedItemResponse } from "./model/net/response/PagedItemResponse";
