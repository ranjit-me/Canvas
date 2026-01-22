import { createUploadthing, type FileRouter } from "uploadthing/next";

// Debug: Log environment variables
console.log("UploadThing Config:", {
  hasSecret: !!process.env.UPLOADTHING_SECRET,
  hasAppId: !!process.env.UPLOADTHING_APP_ID,
  secretLength: process.env.UPLOADTHING_SECRET?.length,
  appId: process.env.UPLOADTHING_APP_ID,
});

const f = createUploadthing();

export const ourFileRouter = {
  // Simplified uploader without auth for testing
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      // Allow anyone to upload for testing
      console.log("Upload middleware called");
      return { userId: "test-user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete!");
      console.log("File URL:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
