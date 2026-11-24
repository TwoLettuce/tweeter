// AI-assisted: see AI-ATTRIBUTION.md
import { createHash } from "node:crypto";

const bucketName = process.env.USER_IMAGES_BUCKET ?? "tweeter-user-images";

export function userImageKey(alias: string): string {
  const aliasKey = createHash("sha256").update(alias).digest("hex");
  return `profile-images/${aliasKey}`;
}

export function userImageUrl(alias: string): string {
  const baseUrl =
    process.env.USER_IMAGE_BASE_URL ??
    `https://${bucketName}.s3.${process.env.AWS_REGION ?? "us-east-1"}.amazonaws.com`;
  return `${baseUrl.replace(/\/$/, "")}/${userImageKey(alias)}`;
}

export function userImagesBucket(): string {
  return bucketName;
}
