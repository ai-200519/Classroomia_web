'use client';

import { UploadDropzone } from '@/app/api/uploadthing/uploadthing';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof OurFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      className="ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300 "
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res?.[0]?.url) {
          onChange(res[0].url);
          toast.success('Téléchargement réussi !');
        } else {
          toast.error('Erreur lors du téléchargement: URL non reçue');
        }
      }}
      onUploadError={(error: Error) => {
        console.error('Upload error:', error);
        toast.error(`${error?.message || 'Une erreur est survenue lors du téléchargement.'}`);
      }}
    />
  );
};
