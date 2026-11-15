// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "./TweeterRequest";

export interface CountRequest extends TweeterRequest {
  readonly token: string;
  readonly alias: string;
}
