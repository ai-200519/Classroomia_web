'use client';

import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { ImageIcon, PencilIcon, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ImageFormProps {
  initialData: {
    imageUrl: string | null;
  };
  courseId: string;
}

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleIsEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: { imageUrl: string }) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success(`L'image a été mise à jour avec succès`);
      toggleIsEditing();
      router.refresh();
    } catch {
      toast.error(`Une erreur est survenue lors de la mise à jour de l\'image du cours. Veuillez réessayer plus tard.`);
    }
  };

  return (
    <div className='mt-6 rounded-md border bg-slate-100 p-4'>
      <div className='flex items-center justify-between font-medium'>
        Image pour le cours
        <Button onClick={toggleIsEditing}>
          {isEditing && <>Annuler</>}

          {!isEditing && initialData.imageUrl && (
            <>
              <PencilIcon className='mr-2 h-4 w-4' />
              Modifier
            </>
          )}

          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className='mr-2 h-4 w-4' />
              Ajouter
            </>
          )}
        </Button>
      </div>
      {!isEditing && !initialData.imageUrl && (
        <div className='flex h-60 items-center justify-center rounded-md bg-slate-200'>
          <ImageIcon className='h-10 w-10 text-slate-500' />
        </div>
      )}

      {!isEditing && initialData.imageUrl && (
        <div className='relative mt-2 aspect-video'>
          <Image
            className='object-cover'
            alt='Course image'
            src={initialData.imageUrl}
            fill
          />
        </div>
      )}
      {isEditing && (
        <>
          <FileUpload
            endpoint='courseImage'
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <p className='mt-4 text-center text-xs text-muted-foreground'>
            Ratio d&apos;aspect 16:9 recommandé
          </p>
        </>
      )}
    </div>
  );
};

export default ImageForm;