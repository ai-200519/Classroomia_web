'use client';

import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { Attachment, Course } from '@prisma/client';
import axios from 'axios';
import { File, Loader2, PlusCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const toggleIsEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: { url: string }) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success('Le cours est actualisé');
      toggleIsEditing();
      router.refresh();
    } catch {
      toast.error('Une erreur est survenue lors de la mise à jour du cours');
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);

      toast.success('Effacé avec succès');
      router.refresh();
    } catch {
      toast.error('Une erreur est survenue lors de la suppression de l\'attachement');  
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className='mt-6 rounded-md border bg-slate-100 p-4'>
      <div className='flex items-center justify-between font-medium'>
        Documents joints
        <Button onClick={toggleIsEditing}>
          {isEditing && <>Annuler</>}

          {!isEditing && (
            <>
              <PlusCircle className='mr-2 h-4 w-4' />
              Ajouter
            </>
          )}
        </Button>
      </div>

      {isEditing && (
        <>
          <FileUpload
            endpoint='courseAttachment'
            onChange={(url) => {
              if (url) {
                onSubmit({ url });
              } else {
                toast.error('Invalid file URL');
              }
            }}
          />
          <p className='mt-4 text-center text-xs text-muted-foreground'>
            Ajoutez tout ce dont vos étudiants pourraient avoir besoin pour compléter le cours.
          </p>
        </>
      )}

      {!isEditing && !initialData.attachments.length ? (
        <p className='mt-2 text-sm italic text-slate-500'>No attachments yet</p>
      ) : (
        <div className='space-y-2'>
          {initialData.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className='flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700'>
              <File className='mr-2 h-4 w-4 flex-shrink-0' />
              <p className='line-clamp-1 text-xs'>{attachment.name}</p>

              {deletingId === attachment.id ? (
                <Loader2 className='ml-2 h-4 w-4 animate-spin' />
              ) : (
                <button
                  onClick={() => onDelete(attachment.id)}
                  className='ml-auto transition hover:opacity-75'>
                  <X className='ml-2 h-4 w-4' />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;