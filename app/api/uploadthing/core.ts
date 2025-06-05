import { auth } from '@clerk/nextjs/server'
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();
  if (!userId) {
    // If you throw, the user will not be able to upload
    throw new Error('Non autorisé, veuillez vous ressayer ');
  }
  // Whatever is returned here is accessible in onUploadComplete as `metadata`
  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes. Define as many FileRoutes as you like, each with a unique routeSlug.
export const ourFileRouter = {
  // Set permissions and file types for this FileRoute
  courseImage: f({ image: { maxFileSize: '16MB', maxFileCount: 1 } })
    // This code runs on your server before upload
    .middleware(() => handleAuth())
    // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
    .onUploadComplete(() => {}),
  courseAttachment: f({
    image: {
      maxFileSize: '16MB',
    },
    pdf: {
      maxFileSize: '16MB',
    },
    text: {
      maxFileSize: '16MB',
    },
    video: { maxFileSize: '1GB' },
    audio: { maxFileSize: '16MB' },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  chapterVideo: f({ video: { maxFileSize: '4GB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;