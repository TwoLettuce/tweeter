import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../../../model/service/UserService";
import { Buffer } from "buffer";

export interface RegisterView {
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setImageFileExtension: React.Dispatch<React.SetStateAction<string>>;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  displayErrorMessage: (
    message: string,
    bootstrapClasses?: string | undefined,
  ) => string;
  navigate: NavigateFunction;
}

export class RegisterPresenter {
  private view: RegisterView;
  private userService: UserService;
  private imageBytes: Uint8Array<ArrayBufferLike> = new Uint8Array();

  public constructor(view: RegisterView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageFileExtension: string,
    rememberMe: boolean,
  ) {
    try {
      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        this.imageBytes,
        imageFileExtension,
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`,
      );
    } finally {
    }
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64",
        );

        this.imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.imageBytes = new Uint8Array();
    }
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }
}
