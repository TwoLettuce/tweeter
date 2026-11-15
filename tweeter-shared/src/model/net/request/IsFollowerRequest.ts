// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "./TweeterRequest";

export interface IsFollowerRequest extends TweeterRequest {
  readonly token: string;
  readonly alias: string;
  readonly selectedAlias: string;
}
