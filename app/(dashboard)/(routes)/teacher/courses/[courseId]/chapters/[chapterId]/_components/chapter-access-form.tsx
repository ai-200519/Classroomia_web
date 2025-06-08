'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
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

interface ChapterAccessFormProps {
  initialData: {
    description: string | null;
    isFree: boolean;
  };
  courseId: string;
  chapterId: string; 
}

const ChapterAccessFormSchema = z.object({
  isFree: z.boolean().default(false),
});

type ChapterAccessFormSchemaType = z.infer<typeof ChapterAccessFormSchema>;

const ChapterAccessForm = ({ initialData, courseId, chapterId }: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<ChapterAccessFormSchemaType>({
    mode: 'onChange',
    defaultValues: { isFree: Boolean(initialData.isFree)},

    resolver: zodResolver(ChapterAccessFormSchema),
  });

  const { isValid, isSubmitting } = form.formState;

  const toggleIsEditing = () => setIsEditing((current) => !current);

  const onSubmit = async (values: ChapterAccessFormSchemaType) => {
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
        Paramètres d&apos;accès au chapitre
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
        <p
          className={cn(
            'mt-2 text-sm',
            !initialData.isFree && 'italic text-slate-500',
          )}>
          {initialData.isFree ? (
            <span className="text-green-600">Accès gratuit</span>
          ) : (
            <span className="text-red-600">Accès payant</span>
          )}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-4 space-y-4'>
            <FormField
              control={form.control}
              name='isFree'
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Cochez cette case si vous souhaitez permettre un accès gratuit à ce chapitre.
                    </FormDescription>
                  </div>

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

export default ChapterAccessForm;