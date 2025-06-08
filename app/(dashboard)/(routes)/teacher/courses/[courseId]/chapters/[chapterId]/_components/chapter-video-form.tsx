'use client';

import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { Chapter, MuxData } from '@prisma/client';
import axios from 'axios';
import { PencilIcon, PlusCircle, VideoIcon } from 'lucide-react';
import MuxPlayer from '@mux/mux-player-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}


const ChapterVideoForm = ({ initialData, courseId, chapterId, }: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleIsEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: { videoUrl: string }) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success(`La video a été mise à jour avec succès`);
      toggleIsEditing();
      router.refresh();
    } catch {
      toast.error(`Une erreur est survenue lors de la mise à jour de la video du cours. Veuillez réessayer plus tard.`);
    }
  };

  return (
    <div className='mt-6 rounded-md border-dashed bg-slate-100 p-4'>
      <div className='flex items-center justify-between font-medium'>
        une vidéo pour ce chapitre
        <Button onClick={toggleIsEditing}>
          {isEditing && <>Annuler</>}

          {!isEditing && initialData.videoUrl && (
            <>
              <PencilIcon className='mr-2 h-4 w-4' />
              Modifier
            </>
          )}

          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className='mr-2 h-4 w-4' />
              Ajouter
            </>
          )}
        </Button>
      </div>
      {!isEditing && !initialData.videoUrl && (
        <div className='aspect-video bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300'>
          <VideoIcon className='h-10 w-10 text-slate-500' />
        </div>
      )}

      {!isEditing && initialData.videoUrl && (
        <div className='relative mt-2 aspect-video'>
          <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""}/>
        </div>
      )}
      {isEditing && (
        <>
          <FileUpload
            endpoint='chapterVideo'
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <p className='mt-4 text-center text-xs text-muted-foreground'>
            Télécharger une vidéo pour ce chapitre
          </p>
        </>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
            Les vidéos peuvent prendre quelques minutes pour être traitées. 
            Veuillez rafraîchir la page si elle ne s&apos;affiche pas.
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;