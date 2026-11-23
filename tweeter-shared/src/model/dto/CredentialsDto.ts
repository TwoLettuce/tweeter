import { UserDto } from "./UserDto";

export interface CredentialsDto extends UserDto {
  password: string;
}
