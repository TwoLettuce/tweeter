export interface IUserImageDAO {
  putUserImage(
    alias: string,
    imageBytes: string,
    fileExtension: string,
  ): Promise<void>;
  getUserImage(alias: string): Promise<[string, string]>;
}
