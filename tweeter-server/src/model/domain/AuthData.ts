// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, AuthTokenDto } from "tweeter-shared";

export interface AuthDataDto {
  readonly alias: string;
  readonly token: AuthTokenDto;
}

export class AuthData {
  private _alias: string;
  private _token: AuthToken;

  public constructor(alias: string, token: AuthToken | AuthTokenDto) {
    this._alias = alias;
    this._token = token instanceof AuthToken ? token : AuthToken.fromDto(token);
  }

  public get alias(): string {
    return this._alias;
  }

  public get token(): AuthToken {
    return this._token;
  }

  public static fromDto(dto: AuthDataDto): AuthData {
    return new AuthData(dto.alias, dto.token);
  }

  public get dto(): AuthDataDto {
    return {
      alias: this.alias,
      token: this.token.dto,
    };
  }
}
