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
import { Chapter, Course } from '@prisma/client';
import axios from 'axios';
import { Loader2, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import ChaptersList from './chapters-list';

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const chaptersFormSchema = z.object({
  chapterTitle: z.string().trim().min(1, 'Le chapitre est obligatoire'),
});

type ChaptersFormSchemaType = z.infer<typeof chaptersFormSchema>;

const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const form = useForm<ChaptersFormSchemaType>({
    mode: 'onChange',
    defaultValues: { chapterTitle: '' },
    resolver: zodResolver(chaptersFormSchema),
  });

  const { isValid, isSubmitting } = form.formState;

  const toggleIsCreating = () => setIsCreating((current) => !current);

  const onSubmit = async (values: ChaptersFormSchemaType) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success('Chapitre créé avec succès');
      toggleIsCreating();
      form.reset();
      router.refresh();
    } catch {
      toast.error('Une erreur est survenue lors de la création du chapitre');
    }
  };

  const handleOnReorder = async (
    updatedOrder: { id: string; position: number }[],
  ) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updatedOrder,
      });
      toast.success('Changement d\'ordre');
      router.refresh();
    } catch {
      toast.error('Une erreur est survenue');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOnEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className='relative mt-6 rounded-md border bg-slate-100 p-4'>
      {isUpdating && (
        <div className='absolute right-0 top-0 flex h-full w-full items-center justify-center rounded-md bg-slate-500/20'>
          <Loader2 className='h-6 w-6 animate-spin text-sky-700' />
        </div>
      )}
      <div className='flex items-center justify-between font-medium'>
        Course Chapitres
        <Button onClick={toggleIsCreating}>
          {isCreating ? (
            'Annuler'
          ) : (
            <>
              <PlusCircle className='mr-2 h-4 w-4' />
              Ajouter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-4 space-y-4'>
            <FormField
              control={form.control}
              name='chapterTitle'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder='e.g. Introduction et Contexte'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-x-2'>
              <Button disabled={!isValid || isSubmitting} type='submit'>
                Create
              </Button>
            </div>
          </form>
        </Form>
      )}

      {!isCreating && (
        <>
          {initialData.chapters.length === 0 && (
            <p className='mt-2 text-sm italic text-slate-500'>pas de chapitres</p>
          )}
          {initialData.chapters.length !== 0 && (
            <ChaptersList
              items={initialData.chapters}
              isUpdating={isUpdating}
              onEdit={handleOnEdit}
              onReorder={handleOnReorder}
            />
          )}
          <p className='mt-4 text-center text-xs text-muted-foreground'>
            Glissez et déposez pour réorganiser les chapitres
          </p>
        </>
      )}
    </div>
  );
};

export default ChaptersForm;