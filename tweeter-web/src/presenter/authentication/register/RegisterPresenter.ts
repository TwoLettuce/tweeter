import { Buffer } from "buffer";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "../AuthenticationPresenter";
import { User } from "tweeter-shared";

export interface RegisterView extends AuthenticationView {
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setImageFileExtension: React.Dispatch<React.SetStateAction<string>>;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  private imageBytes: Uint8Array = new Uint8Array();

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageFileExtension: string,
    rememberMe: boolean,
  ) {
    await this.doAuthenticationOperation(
      async () => {
        const [user, authToken] = await this.userService.register(
          firstName,
          lastName,
          alias,
          password,
          this.imageBytes,
          imageFileExtension,
        );
        return [user, authToken, rememberMe];
      },
      (user: User) => this.view.navigate(`/feed/${user.alias}`),
      "register user",
    );
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
