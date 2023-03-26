import { S3 } from "@aws-sdk/client-s3";

const { AWS_KEY, AWS_SECRET, STORAGE_ENDPOINT } = process.env;

// if (!STORAGE_ENDPOINT) {
//   throw new Error(`Storage is missing required configuration.`);
// }

if (!AWS_KEY) {
  throw new Error(`Storage is missing required configuration.`);
}

if (!AWS_SECRET) {
  throw new Error(`Storage is missing required configuration.`);
}

export const s3Client = new S3({
  // endpoint: STORAGE_ENDPOINT,
  // forcePathStyle: true,
  credentials: {
    accessKeyId: AWS_KEY!,
    secretAccessKey: AWS_SECRET!,
  },

  // This is only needed for the AWS SDK and it must be set to their region
  region: "us-east-1",
});
