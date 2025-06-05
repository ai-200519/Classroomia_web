'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof OurFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      className="ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (!res || res.length === 0) {
          toast.error('Aucun fichier reçu dans la réponse');
          return;
        }
        
        // Extract URL from the first file
        const url = res[0]?.url;
        if (!url) {
          toast.error('URL du fichier manquante');
          return;
        }

        try {
          onChange(url);
        } catch (err) {
          console.error('Callback error:', err);
          toast.error('Échec du traitement du fichier téléchargé');
        }
      }}
      onUploadError={(error: Error) => {
        toast.error('Une erreur est survenue lors du téléchargement du fichier.');
        console.error(error);
      }}
    />
  );
};