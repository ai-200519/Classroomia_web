'use client';

import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface ChapterDescriptionFormProps {
  initialData: {
    description: string | null;
  };
  courseId: string;
  chapterId: string; 
}

const ChapterDescriptionFormSchema = z.object({
  description: z.string().trim().min(1),
});

type ChapterDescriptionFormSchemaType = z.infer<typeof ChapterDescriptionFormSchema>;

const ChapterDescriptionForm = ({ initialData, courseId, chapterId }: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<ChapterDescriptionFormSchemaType>({
    mode: 'onChange',
    defaultValues: { description: initialData?.description || '' },

    resolver: zodResolver(ChapterDescriptionFormSchema),
  });

  const { isValid, isSubmitting } = form.formState;

  const toggleIsEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: ChapterDescriptionFormSchemaType) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success('Le chapitre est actualisé');
      toggleIsEditing();
      router.refresh();
    } catch {
      toast.error('Une erreur est survenue lors de la mise à jour du chapitre');
    }
  };

  return (
    <div className='mt-6 rounded-md border bg-slate-100 p-4'>
      <div className='flex items-center justify-between font-medium'>
        Description du chapitre
        <Button onClick={toggleIsEditing}>
          {isEditing ? (
            'Annuler'
          ) : (
            <>
              <PencilIcon className='mr-2 h-4 w-4' />
              Modifier
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            'mt-2 text-sm',
            !initialData.description && 'italic text-slate-500',
          )}>
          {!initialData.description && 'Aucune description fournie'}
          {initialData.description && (
            <Preview
              value={ initialData.description }
            />
          )}

        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-4 space-y-4'>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Editor
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button disabled={!isValid || isSubmitting} type='submit'>
                Sauvegarder
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ChapterDescriptionForm;