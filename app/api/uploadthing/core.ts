import { auth } from '@clerk/nextjs/server'
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const handleAuth = async () => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Non autorisé, veuillez vous ressayer ');
    return { userId };
  } catch (error) {
    console.error('[UPLOADTHING_AUTH]', error);
    throw new Error('Erreur d\'authentification');
}};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: '16MB', maxFileCount: 1 } })
    // This code runs on your server before upload
    .middleware(() => handleAuth())
    // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
    .onUploadComplete(async ({ file }) => {
      console.log(`[UPLOAD_SUCCESS] ${file.name}`);
      return { success: true };
    }),
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
