// AI-assisted: see AI-ATTRIBUTION.md
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { IUserImageDAO } from "../user/IUserImageDAO";
import { userImageKey, userImagesBucket } from "./UserImageSupport";

const s3Client = new S3Client({});
const contentTypes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
};

export class S3UserImageDAO implements IUserImageDAO {
  public async putUserImage(
    alias: string,
    imageBytes: string,
    fileExtension: string,
  ): Promise<void> {
    const extension = fileExtension.replace(/^\./, "").toLowerCase();
    const contentType = contentTypes[extension];
    if (!contentType) throw new Error("bad-request: Unsupported profile image type");

    await s3Client.send(
      new PutObjectCommand({
        Bucket: userImagesBucket(),
        Key: userImageKey(alias),
        Body: Buffer.from(imageBytes, "base64"),
        ContentType: contentType,
        Metadata: { fileextension: extension },
      }),
    );
  }

  public async getUserImage(alias: string): Promise<[string, string]> {
    const response = await s3Client.send(
      new GetObjectCommand({ Bucket: userImagesBucket(), Key: userImageKey(alias) }),
    );
    if (!response.Body) throw new Error("not-found: Profile image not found");

    const extension =
      response.Metadata?.fileextension ??
      Object.entries(contentTypes).find(([, value]) => value === response.ContentType)?.[0];
    if (!extension) throw new Error("internal-server-error: Unknown profile image type");

    const imageBytes = await response.Body.transformToByteArray();
    return [Buffer.from(imageBytes).toString("base64"), extension];
  }
}
