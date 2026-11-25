// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { HTTPMethod } from "./HTTPMethod";
import { ApiClientError, isApiErrorResponse } from "./ApiClientError";

export class ClientCommunicator {
  private SERVER_URL: string;

  public constructor(SERVER_URL: string) {
    this.SERVER_URL = SERVER_URL;
  }

  public doPost<REQ extends TweeterRequest, RES extends TweeterResponse>(
    req: REQ | undefined,
    endpoint: string,
    headers?: Headers,
  ): Promise<RES> {
    return this.doRequest<REQ, RES>(HTTPMethod.POST, req, endpoint, headers);
  }

  public doDelete<REQ extends TweeterRequest, RES extends TweeterResponse>(
    req: REQ | undefined,
    endpoint: string,
    headers?: Headers,
  ): Promise<RES> {
    return this.doRequest<REQ, RES>(HTTPMethod.DELETE, req, endpoint, headers);
  }

  public doPut<REQ extends TweeterRequest, RES extends TweeterResponse>(
    req: REQ | undefined,
    endpoint: string,
    headers?: Headers,
  ): Promise<RES> {
    return this.doRequest<REQ, RES>(HTTPMethod.PUT, req, endpoint, headers);
  }

  private async doRequest<
    REQ extends TweeterRequest,
    RES extends TweeterResponse,
  >(
    method: HTTPMethod,
    req: REQ | undefined,
    endpoint: string,
    headers?: Headers,
  ): Promise<RES> {
    if (headers && req) {
      headers.append("Content-type", "application/json");
    } else if (req) {
      headers = new Headers({
        "Content-type": "application/json",
      });
    }

    const url = this.getUrl(endpoint);
    const params = this.getParams(
      method,
      headers,
      req ? JSON.stringify(req) : req,
    );

    let resp: Response;
    try {
      resp = await fetch(url, params);
    } catch {
      throw new ApiClientError("NETWORK_ERROR");
    }

    let response: unknown;
    try {
      response = await resp.json();
    } catch {
      throw new ApiClientError(
        resp.ok ? "INVALID_RESPONSE" : "INTERNAL_ERROR",
      );
    }

    if (!resp.ok) {
      if (isApiErrorResponse(response)) {
        throw new ApiClientError(response.code);
      }
      throw new ApiClientError("INTERNAL_ERROR");
    }

    // The response types share a base interface, but the JSON body is untyped.
    return response as RES;
  }

  private getUrl(endpoint: string): string {
    return this.SERVER_URL + endpoint;
  }

  private getParams(
    method: string,
    headers?: Headers,
    body?: BodyInit,
  ): RequestInit {
    const params: RequestInit = { method: method };

    if (headers) {
      params.headers = headers;
    }

    if (body) {
      params.body = body;
    }

    return params;
  }
}
