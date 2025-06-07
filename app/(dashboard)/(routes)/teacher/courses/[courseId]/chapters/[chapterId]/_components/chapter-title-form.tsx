'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { PencilIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

interface ChapterTitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
  chapterId: string; 
}

const ChapterTitleFormSchema = z.object({
  title: z.string().trim().min(1),
});

type ChapterTitleFormSchemaType = z.infer<typeof ChapterTitleFormSchema>;

const ChapterTitleForm = ({ initialData, courseId, chapterId }: ChapterTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<ChapterTitleFormSchemaType>({
    mode: 'onChange',
    defaultValues: { title: initialData?.title || '' },
    resolver: zodResolver(ChapterTitleFormSchema),
  });

  const { isValid, isSubmitting } = form.formState;

  const toggleIsEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: ChapterTitleFormSchemaType) => {
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
        Titre du chapitre
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
      {!isEditing && <p className='mt-2 text-sm'>{initialData.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-4 space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='e.g. "Introduction et contexte"'
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

export default ChapterTitleForm;